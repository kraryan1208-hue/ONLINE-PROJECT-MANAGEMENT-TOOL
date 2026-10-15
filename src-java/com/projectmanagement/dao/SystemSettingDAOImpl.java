package com.projectmanagement.dao;

import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.SystemSetting;
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
 * JDBC Implementation of SystemSettingDAO.
 * Persists and retrieves global configuration parameters in system_settings table.
 */
public class SystemSettingDAOImpl implements SystemSettingDAO {

    @Override
    public List<SystemSetting> getAllSettings() throws DatabaseException {
        List<SystemSetting> list = new ArrayList<>();
        String sql = "SELECT * FROM system_settings ORDER BY id ASC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
            while (rs.next()) {
                SystemSetting s = new SystemSetting();
                s.setId(rs.getInt("id"));
                s.setSettingName(rs.getString("setting_name"));
                s.setSettingValue(rs.getString("setting_value"));
                list.add(s);
            }
            return list;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving system settings from database", e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public Map<String, String> getSettingsMap() throws DatabaseException {
        Map<String, String> map = new HashMap<>();
        List<SystemSetting> list = getAllSettings();
        for (SystemSetting s : list) {
            map.put(s.getSettingName(), s.getSettingValue());
        }
        return map;
    }

    @Override
    public String getSettingValue(String key, String defaultValue) throws DatabaseException {
        String sql = "SELECT setting_value FROM system_settings WHERE setting_name = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, key);
            rs = stmt.executeQuery();
            if (rs.next()) {
                String val = rs.getString("setting_value");
                return val != null ? val : defaultValue;
            }
            return defaultValue;
        } catch (SQLException e) {
            throw new DatabaseException("Error retrieving setting: " + key, e);
        } finally {
            DBConnection.close(rs, stmt, conn);
        }
    }

    @Override
    public boolean updateSetting(String key, String value) throws DatabaseException {
        String sql = "INSERT INTO system_settings (setting_name, setting_value) VALUES (?, ?) " +
                     "ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, key);
            stmt.setString(2, value);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new DatabaseException("Error updating system setting '" + key + "'", e);
        } finally {
            DBConnection.close(stmt, conn);
        }
    }

    @Override
    public boolean updateSettings(Map<String, String> settings) throws DatabaseException {
        if (settings == null || settings.isEmpty()) {
            return true;
        }
        String sql = "INSERT INTO system_settings (setting_name, setting_value) VALUES (?, ?) " +
                     "ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);
            stmt = conn.prepareStatement(sql);

            for (Map.Entry<String, String> entry : settings.entrySet()) {
                stmt.setString(1, entry.getKey());
                stmt.setString(2, entry.getValue());
                stmt.addBatch();
            }

            stmt.executeBatch();
            conn.commit();
            return true;
        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ignored) {}
            }
            throw new DatabaseException("Error batch updating system settings", e);
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                } catch (SQLException ignored) {}
            }
            DBConnection.close(stmt, conn);
        }
    }
}
