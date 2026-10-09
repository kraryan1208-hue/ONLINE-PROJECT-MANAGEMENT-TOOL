package com.projectmanagement.dao;

import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.Task;
import com.projectmanagement.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * JDBC Implementation of TaskDAO.
 * Supports CRUD, dynamic filtering, status updates, and distribution statistics.
 */
public class TaskDAOImpl implements TaskDAO {

    private Task mapResultSetToTask(ResultSet rs) throws SQLException {
        Task t = new Task();
        t.setId(rs.getInt("id"));
        t.setTitle(rs.getString("title"));
        t.setDescription(rs.getString("description"));
        t.setProjectId(rs.getInt("project_id"));
        t.setAssignedTo(rs.getInt("assigned_to"));
        t.setPriority(rs.getString("priority"));
        t.setDeadline(rs.getDate("deadline"));
        t.setStatus(rs.getString("status"));
        t.setCreatedAt(rs.getTimestamp("created_at"));
        t.setUpdatedAt(rs.getTimestamp("updated_at"));

        try {
            t.setProjectTitle(rs.getString("project_title"));
        } catch (SQLException ignored) {}

        try {
            t.setAssigneeName(rs.getString("assignee_name"));
        } catch (SQLException ignored) {}

        return t;
    }

    private static final String BASE_SELECT =
        "SELECT t.*, p.title AS project_title, u.name AS assignee_name " +
        "FROM tasks t " +
        "LEFT JOIN projects p ON t.project_id = p.id " +
        "LEFT JOIN users u ON t.assigned_to = u.id ";

    @Override
    public boolean createTask(Task task) throws DatabaseException {
        String sql = "INSERT INTO tasks (title, description, project_id, assigned_to, priority, deadline, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, task.getTitle());
            stmt.setString(2, task.getDescription());
            stmt.setInt(3, task.getProjectId());
            if (task.getAssignedTo() > 0) {
                stmt.setInt(4, task.getAssignedTo());
            } else {
                stmt.setNull(4, java.sql.Types.INTEGER);
            }
            stmt.setString(5, task.getPriority() != null ? task.getPriority() : "Medium");
            stmt.setDate(6, task.getDeadline());
            stmt.setString(7, task.getStatus() != null ? task.getStatus() : "Pending");

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error creating task: " + task.getTitle(), e);
        } finally {
            DBConnection.close(stmt, conn);
        }
    }

    @Override
    public Task getTaskById(int id) throws DatabaseException {
        String sql = BASE_SELECT + " WHERE t.id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();
            if (rs.next()) {
                return mapResultSetToTask(rs);
            }
            return null;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving task ID: " + id, e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public List<Task> getAllTasks() throws DatabaseException {
        List<Task> list = new ArrayList<>();
        String sql = BASE_SELECT + " ORDER BY t.id DESC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            while (rs.next()) {
                list.add(mapResultSetToTask(rs));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving all tasks", e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public List<Task> getTasksByProject(int projectId) throws DatabaseException {
        List<Task> list = new ArrayList<>();
        String sql = BASE_SELECT + " WHERE t.project_id = ? ORDER BY t.id DESC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, projectId);
            rs = stmt.executeQuery();
            while (rs.next()) {
                list.add(mapResultSetToTask(rs));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving tasks for project ID: " + projectId, e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public List<Task> getTasksByAssignee(int userId) throws DatabaseException {
        List<Task> list = new ArrayList<>();
        String sql = BASE_SELECT + " WHERE t.assigned_to = ? ORDER BY t.deadline ASC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            rs = stmt.executeQuery();
            while (rs.next()) {
                list.add(mapResultSetToTask(rs));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving tasks for assignee ID: " + userId, e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public boolean updateTask(Task task) throws DatabaseException {
        String sql = "UPDATE tasks SET title = ?, description = ?, project_id = ?, assigned_to = ?, priority = ?, deadline = ?, status = ? WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, task.getTitle());
            stmt.setString(2, task.getDescription());
            stmt.setInt(3, task.getProjectId());
            if (task.getAssignedTo() > 0) {
                stmt.setInt(4, task.getAssignedTo());
            } else {
                stmt.setNull(4, java.sql.Types.INTEGER);
            }
            stmt.setString(5, task.getPriority());
            stmt.setDate(6, task.getDeadline());
            stmt.setString(7, task.getStatus());
            stmt.setInt(8, task.getId());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating task ID: " + task.getId(), e);
        } finally {
            DBConnection.close(stmt, conn);
        }
    }

    @Override
    public boolean updateTaskStatus(int taskId, String status) throws DatabaseException {
        String sql = "UPDATE tasks SET status = ? WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, status);
            stmt.setInt(2, taskId);

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating status for task ID: " + taskId, e);
        } finally {
            DBConnection.close(stmt, conn);
        }
    }

    @Override
    public boolean deleteTask(int id) throws DatabaseException {
        String sql = "DELETE FROM tasks WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error deleting task ID: " + id, e);
        } finally {
            DBConnection.close(stmt, conn);
        }
    }

    @Override
    public List<Task> filterTasks(String keyword, String status, String priority, Integer projectId, Integer assignedTo) throws DatabaseException {
        List<Task> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(BASE_SELECT + " WHERE 1=1 ");

        if (keyword != null && !keyword.trim().isEmpty()) {
            sql.append(" AND (LOWER(t.title) LIKE ? OR LOWER(t.description) LIKE ? OR LOWER(p.title) LIKE ?) ");
        }
        if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            sql.append(" AND t.status = ? ");
        }
        if (priority != null && !priority.trim().isEmpty() && !"ALL".equalsIgnoreCase(priority)) {
            sql.append(" AND t.priority = ? ");
        }
        if (projectId != null && projectId > 0) {
            sql.append(" AND t.project_id = ? ");
        }
        if (assignedTo != null && assignedTo > 0) {
            sql.append(" AND t.assigned_to = ? ");
        }
        sql.append(" ORDER BY t.id DESC");

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql.toString());
            int idx = 1;

            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                stmt.setString(idx++, pattern);
                stmt.setString(idx++, pattern);
                stmt.setString(idx++, pattern);
            }
            if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
                stmt.setString(idx++, status.trim());
            }
            if (priority != null && !priority.trim().isEmpty() && !"ALL".equalsIgnoreCase(priority)) {
                stmt.setString(idx++, priority.trim());
            }
            if (projectId != null && projectId > 0) {
                stmt.setInt(idx++, projectId);
            }
            if (assignedTo != null && assignedTo > 0) {
                stmt.setInt(idx++, assignedTo);
            }

            rs = stmt.executeQuery();
            while (rs.next()) {
                list.add(mapResultSetToTask(rs));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Error filtering tasks", e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public Map<String, Integer> getTaskStatusDistribution(Integer projectId) throws DatabaseException {
        Map<String, Integer> map = new HashMap<>();
        map.put("Completed", 0);
        map.put("In Progress", 0);
        map.put("Pending", 0);

        StringBuilder sql = new StringBuilder("SELECT status, COUNT(*) as cnt FROM tasks ");
        if (projectId != null && projectId > 0) {
            sql.append("WHERE project_id = ? ");
        }
        sql.append("GROUP BY status");

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql.toString());
            if (projectId != null && projectId > 0) {
                stmt.setInt(1, projectId);
            }

            rs = stmt.executeQuery();
            while (rs.next()) {
                String status = rs.getString("status");
                int count = rs.getInt("cnt");
                map.put(status, count);
            }
            return map;
        } catch (SQLException e) {
            throw new DatabaseException("Error getting task distribution", e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public int getTotalTasksCount() throws DatabaseException {
        return getCountByQuery("SELECT COUNT(*) FROM tasks");
    }

    @Override
    public int getCompletedTasksCount() throws DatabaseException {
        return getCountByQuery("SELECT COUNT(*) FROM tasks WHERE status = 'Completed'");
    }

    @Override
    public int getPendingTasksCount() throws DatabaseException {
        return getCountByQuery("SELECT COUNT(*) FROM tasks WHERE status = 'Pending'");
    }

    private int getCountByQuery(String sql) throws DatabaseException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            if (rs.next()) return rs.getInt(1);
            return 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error counting tasks", e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }
}
