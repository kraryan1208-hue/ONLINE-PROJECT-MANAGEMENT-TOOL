package com.projectmanagement.dao;

import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.SystemSetting;
import java.util.List;
import java.util.Map;

/**
 * Data Access Object (DAO) Interface for SystemSetting entity.
 * Handles reading and updating global configurations in the system_settings table.
 */
public interface SystemSettingDAO {
    List<SystemSetting> getAllSettings() throws DatabaseException;
    Map<String, String> getSettingsMap() throws DatabaseException;
    String getSettingValue(String key, String defaultValue) throws DatabaseException;
    boolean updateSetting(String key, String value) throws DatabaseException;
    boolean updateSettings(Map<String, String> settings) throws DatabaseException;
}
