package com.projectmanagement.model;

import java.io.Serializable;

/**
 * SystemSetting Model representing configuration settings in MySQL database.
 */
public class SystemSetting implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private String settingName;
    private String settingValue;

    public SystemSetting() {
    }

    public SystemSetting(int id, String settingName, String settingValue) {
        this.id = id;
        this.settingName = settingName;
        this.settingValue = settingValue;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSettingName() {
        return settingName;
    }

    public void setSettingName(String settingName) {
        this.settingName = settingName;
    }

    public String getSettingValue() {
        return settingValue;
    }

    public void setSettingValue(String settingValue) {
        this.settingValue = settingValue;
    }
}
