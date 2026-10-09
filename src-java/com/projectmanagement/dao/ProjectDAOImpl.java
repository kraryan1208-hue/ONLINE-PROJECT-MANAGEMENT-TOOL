package com.projectmanagement.dao;

import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.Project;
import com.projectmanagement.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * JDBC Implementation of ProjectDAO.
 * Features parameterized PreparedStatements and dynamic progress calculations.
 */
public class ProjectDAOImpl implements ProjectDAO {

    private Project mapResultSetToProject(ResultSet rs) throws SQLException {
        Project p = new Project();
        p.setId(rs.getInt("id"));
        p.setTitle(rs.getString("title"));
        p.setDescription(rs.getString("description"));
        p.setStartDate(rs.getDate("start_date"));
        p.setEndDate(rs.getDate("end_date"));
        p.setStatus(rs.getString("status"));
        p.setManagerId(rs.getInt("manager_id"));
        p.setCreatedAt(rs.getTimestamp("created_at"));

        // Join columns if present in SELECT
        try {
            p.setManagerName(rs.getString("manager_name"));
        } catch (SQLException ignored) {}

        try {
            int total = rs.getInt("total_tasks");
            int completed = rs.getInt("completed_tasks");
            int inProgress = rs.getInt("in_progress_tasks");
            int pending = rs.getInt("pending_tasks");

            p.setTotalTasks(total);
            p.setCompletedTasks(completed);
            p.setInProgressTasks(inProgress);
            p.setPendingTasks(pending);

            // Dynamic progress formula calculation
            double progress = (total == 0) ? 0.0 : Math.round(((double) completed / total) * 100.0 * 10.0) / 10.0;
            p.setCompletionPercentage(progress);
        } catch (SQLException ignored) {}

        return p;
    }

    private static final String BASE_SELECT_WITH_PROGRESS = 
        "SELECT p.*, u.name AS manager_name, " +
        "COUNT(t.id) AS total_tasks, " +
        "SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks, " +
        "SUM(CASE WHEN t.status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_tasks, " +
        "SUM(CASE WHEN t.status = 'Pending' THEN 1 ELSE 0 END) AS pending_tasks " +
        "FROM projects p " +
        "JOIN users u ON p.manager_id = u.id " +
        "LEFT JOIN tasks t ON p.id = t.project_id ";

    @Override
    public boolean createProject(Project project) throws DatabaseException {
        String sql = "INSERT INTO projects (title, description, start_date, end_date, status, manager_id) VALUES (?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, project.getTitle());
            stmt.setString(2, project.getDescription());
            stmt.setDate(3, project.getStartDate());
            stmt.setDate(4, project.getEndDate());
            stmt.setString(5, project.getStatus() != null ? project.getStatus() : "Planning");
            stmt.setInt(6, project.getManagerId());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error creating project: " + project.getTitle(), e);
        } finally {
            DBConnection.close(stmt, conn);
        }
    }

    @Override
    public Project getProjectById(int id) throws DatabaseException {
        String sql = BASE_SELECT_WITH_PROGRESS + " WHERE p.id = ? GROUP BY p.id, u.name";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();
            if (rs.next()) {
                return mapResultSetToProject(rs);
            }
            return null;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving project ID: " + id, e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public List<Project> getAllProjects() throws DatabaseException {
        List<Project> list = new ArrayList<>();
        String sql = BASE_SELECT_WITH_PROGRESS + " GROUP BY p.id, u.name ORDER BY p.id DESC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            while (rs.next()) {
                list.add(mapResultSetToProject(rs));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching projects list from database.", e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public List<Project> getProjectsByManager(int managerId) throws DatabaseException {
        List<Project> list = new ArrayList<>();
        String sql = BASE_SELECT_WITH_PROGRESS + " WHERE p.manager_id = ? GROUP BY p.id, u.name ORDER BY p.id DESC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, managerId);
            rs = stmt.executeQuery();
            while (rs.next()) {
                list.add(mapResultSetToProject(rs));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching projects for manager ID: " + managerId, e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public List<Project> searchProjects(String keyword, String status) throws DatabaseException {
        List<Project> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(BASE_SELECT_WITH_PROGRESS + " WHERE 1=1 ");

        if (keyword != null && !keyword.trim().isEmpty()) {
            sql.append(" AND (LOWER(p.title) LIKE ? OR LOWER(p.description) LIKE ?) ");
        }
        if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            sql.append(" AND p.status = ? ");
        }
        sql.append(" GROUP BY p.id, u.name ORDER BY p.id DESC");

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql.toString());
            int paramIndex = 1;

            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                stmt.setString(paramIndex++, pattern);
                stmt.setString(paramIndex++, pattern);
            }
            if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
                stmt.setString(paramIndex++, status.trim());
            }

            rs = stmt.executeQuery();
            while (rs.next()) {
                list.add(mapResultSetToProject(rs));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Error searching projects with keyword: " + keyword, e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public boolean updateProject(Project project) throws DatabaseException {
        String sql = "UPDATE projects SET title = ?, description = ?, start_date = ?, end_date = ?, status = ?, manager_id = ? WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, project.getTitle());
            stmt.setString(2, project.getDescription());
            stmt.setDate(3, project.getStartDate());
            stmt.setDate(4, project.getEndDate());
            stmt.setString(5, project.getStatus());
            stmt.setInt(6, project.getManagerId());
            stmt.setInt(7, project.getId());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating project ID: " + project.getId(), e);
        } finally {
            DBConnection.close(stmt, conn);
        }
    }

    @Override
    public boolean deleteProject(int id) throws DatabaseException {
        String sql = "DELETE FROM projects WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error deleting project ID: " + id, e);
        } finally {
            DBConnection.close(stmt, conn);
        }
    }

    @Override
    public int getTotalProjectsCount() throws DatabaseException {
        String sql = "SELECT COUNT(*) FROM projects";
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
            throw new DatabaseException("Error getting total projects count", e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public int getActiveProjectsCount() throws DatabaseException {
        String sql = "SELECT COUNT(*) FROM projects WHERE status = 'In Progress'";
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
            throw new DatabaseException("Error getting active projects count", e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }
}
