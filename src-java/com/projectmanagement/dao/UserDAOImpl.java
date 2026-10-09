package com.projectmanagement.dao;

import com.projectmanagement.exception.AuthenticationException;
import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.Admin;
import com.projectmanagement.model.ProjectManager;
import com.projectmanagement.model.TeamMember;
import com.projectmanagement.model.User;
import com.projectmanagement.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Concrete JDBC implementation of UserDAO.
 * Demonstrates:
 * - PreparedStatement parameterized queries (SQL injection prevention)
 * - Java Collections: ArrayList
 * - Java Exception Handling (try-with-resources and custom DatabaseException)
 * - Polymorphic User instantiation based on database role
 */
public class UserDAOImpl implements UserDAO {

    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        int id = rs.getInt("id");
        String name = rs.getString("name");
        String email = rs.getString("email");
        String password = rs.getString("password");
        String role = rs.getString("role");
        java.sql.Timestamp createdAt = rs.getTimestamp("created_at");

        User user;
        if ("ADMIN".equalsIgnoreCase(role)) {
            user = new Admin(id, name, email, password, createdAt);
        } else if ("PROJECT_MANAGER".equalsIgnoreCase(role)) {
            user = new ProjectManager(id, name, email, password, createdAt);
        } else {
            user = new TeamMember(id, name, email, password, createdAt);
        }
        return user;
    }

    @Override
    public User authenticate(String email, String password) throws DatabaseException, AuthenticationException {
        String sql = "SELECT * FROM users WHERE email = ? AND password = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, email.trim().toLowerCase());
            stmt.setString(2, password); // In production, bcrypt hash check

            rs = stmt.executeQuery();
            if (rs.next()) {
                return mapResultSetToUser(rs);
            } else {
                throw new AuthenticationException("Invalid email or password. Please verify your credentials.");
            }
        } catch (SQLException e) {
            throw new DatabaseException("Error during user authentication for " + email, e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public boolean createUser(User user) throws DatabaseException {
        String sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, user.getName());
            stmt.setString(2, user.getEmail().toLowerCase());
            stmt.setString(3, user.getPassword());
            stmt.setString(4, user.getRole());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error creating user: " + user.getEmail(), e);
        } finally {
            DBConnection.close(stmt, conn);
        }
    }

    @Override
    public User getUserById(int id) throws DatabaseException {
        String sql = "SELECT * FROM users WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();
            if (rs.next()) {
                return mapResultSetToUser(rs);
            }
            return null;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving user with ID: " + id, e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public User getUserByEmail(String email) throws DatabaseException {
        String sql = "SELECT * FROM users WHERE email = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, email.trim().toLowerCase());
            rs = stmt.executeQuery();
            if (rs.next()) {
                return mapResultSetToUser(rs);
            }
            return null;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving user by email: " + email, e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public List<User> getAllUsers() throws DatabaseException {
        List<User> list = new ArrayList<>();
        String sql = "SELECT * FROM users ORDER BY id ASC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            while (rs.next()) {
                list.add(mapResultSetToUser(rs));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Error fetching user list from database.", e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public List<User> searchUsers(String keyword, String role) throws DatabaseException {
        List<User> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM users WHERE 1=1 ");

        if (keyword != null && !keyword.trim().isEmpty()) {
            sql.append(" AND (LOWER(name) LIKE ? OR LOWER(email) LIKE ?) ");
        }
        if (role != null && !role.trim().isEmpty() && !"ALL".equalsIgnoreCase(role)) {
            sql.append(" AND role = ? ");
        }
        sql.append(" ORDER BY id ASC");

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql.toString());
            int paramIndex = 1;

            if (keyword != null && !keyword.trim().isEmpty()) {
                String searchPattern = "%" + keyword.trim().toLowerCase() + "%";
                stmt.setString(paramIndex++, searchPattern);
                stmt.setString(paramIndex++, searchPattern);
            }
            if (role != null && !role.trim().isEmpty() && !"ALL".equalsIgnoreCase(role)) {
                stmt.setString(paramIndex++, role.trim().toUpperCase());
            }

            rs = stmt.executeQuery();
            while (rs.next()) {
                list.add(mapResultSetToUser(rs));
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Error searching users with query: " + keyword, e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public List<User> getUsersByRole(String role) throws DatabaseException {
        return searchUsers(null, role);
    }

    @Override
    public boolean updateUser(User user) throws DatabaseException {
        StringBuilder sql = new StringBuilder("UPDATE users SET name = ?, email = ?, role = ?");
        boolean updatePassword = user.getPassword() != null && !user.getPassword().trim().isEmpty();
        if (updatePassword) {
            sql.append(", password = ?");
        }
        sql.append(" WHERE id = ?");

        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql.toString());
            stmt.setString(1, user.getName());
            stmt.setString(2, user.getEmail().toLowerCase());
            stmt.setString(3, user.getRole());

            int paramIndex = 4;
            if (updatePassword) {
                stmt.setString(paramIndex++, user.getPassword());
            }
            stmt.setInt(paramIndex, user.getId());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating user ID: " + user.getId(), e);
        } finally {
            DBConnection.close(stmt, conn);
        }
    }

    @Override
    public boolean updateProfile(int userId, String name, String email, String password) throws DatabaseException {
        StringBuilder sql = new StringBuilder("UPDATE users SET name = ?, email = ?");
        boolean updatePassword = password != null && !password.trim().isEmpty();
        if (updatePassword) {
            sql.append(", password = ?");
        }
        sql.append(" WHERE id = ?");

        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql.toString());
            stmt.setString(1, name);
            stmt.setString(2, email.toLowerCase());

            int idx = 3;
            if (updatePassword) {
                stmt.setString(idx++, password);
            }
            stmt.setInt(idx, userId);

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating profile for user ID: " + userId, e);
        } finally {
            DBConnection.close(stmt, conn);
        }
    }

    @Override
    public boolean deleteUser(int id) throws DatabaseException {
        String sql = "DELETE FROM users WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error deleting user with ID: " + id, e);
        } finally {
            DBConnection.close(stmt, conn);
        }
    }

    @Override
    public int getTotalUsersCount() throws DatabaseException {
        String sql = "SELECT COUNT(*) FROM users";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1);
            }
            return 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error getting users count", e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }
}
