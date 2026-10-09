package com.projectmanagement.dao;

import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.Task;
import java.util.List;
import java.util.Map;

/**
 * Data Access Object (DAO) Interface for Task entity.
 */
public interface TaskDAO {
    boolean createTask(Task task) throws DatabaseException;
    Task getTaskById(int id) throws DatabaseException;
    List<Task> getAllTasks() throws DatabaseException;
    List<Task> getTasksByProject(int projectId) throws DatabaseException;
    List<Task> getTasksByAssignee(int userId) throws DatabaseException;
    boolean updateTask(Task task) throws DatabaseException;
    boolean updateTaskStatus(int taskId, String status) throws DatabaseException;
    boolean deleteTask(int id) throws DatabaseException;
    List<Task> filterTasks(String keyword, String status, String priority, Integer projectId, Integer assignedTo) throws DatabaseException;
    Map<String, Integer> getTaskStatusDistribution(Integer projectId) throws DatabaseException;
    int getTotalTasksCount() throws DatabaseException;
    int getCompletedTasksCount() throws DatabaseException;
    int getPendingTasksCount() throws DatabaseException;
}
