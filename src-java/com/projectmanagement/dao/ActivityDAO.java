package com.projectmanagement.dao;

import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.Activity;
import java.util.List;

public interface ActivityDAO {
    boolean logActivity(int userId, String activity) throws DatabaseException;
    List<Activity> getRecentActivities(int limit) throws DatabaseException;
}
