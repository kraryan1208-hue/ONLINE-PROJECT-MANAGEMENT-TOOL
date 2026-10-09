package com.projectmanagement.dao;

import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.Activity;
import com.projectmanagement.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ActivityDAOImpl implements ActivityDAO {

    @Override
    public boolean logActivity(int userId, String activity) throws DatabaseException {
        String sql = "INSERT INTO activities (user_id, activity) VALUES (?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            if (userId > 0) {
                stmt.setInt(1, userId);
            } else {
                stmt.setNull(1, java.sql.Types.INTEGER);
            }
            stmt.setString(2, activity);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error recording activity log", e);
        } finally {
            DBConnection.close(stmt, conn);
        }
    }

    @Override
    public List<Activity> getRecentActivities(int limit) throws DatabaseException {
        List<Activity> list = new ArrayList<>();
        String sql = "SELECT a.*, u.name as user_name, u.role as user_role FROM activities a " +
                     "LEFT JOIN users u ON a.user_id = u.id ORDER BY a.id DESC LIMIT ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, limit > 0 ? limit : 20);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Activity act = new Activity();
                act.setId(rs.getInt("id"));
                act.setUserId(rs.getInt("user_id"));
                act.setActivity(rs.getString("activity"));
                act.setCreatedAt(rs.getTimestamp("created_at"));
                act.setUserName(rs.getString("user_name") != null ? rs.getString("user_name") : "System");
                act.setUserRole(rs.getString("user_role") != null ? rs.getString("user_role") : "SYSTEM");
                list.add(act);
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving recent activities", e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }
}
