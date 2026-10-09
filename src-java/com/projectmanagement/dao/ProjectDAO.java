package com.projectmanagement.dao;

import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.Project;
import java.util.List;

/**
 * Data Access Object (DAO) Interface for Project entity.
 */
public interface ProjectDAO {
    boolean createProject(Project project) throws DatabaseException;
    Project getProjectById(int id) throws DatabaseException;
    List<Project> getAllProjects() throws DatabaseException;
    List<Project> getProjectsByManager(int managerId) throws DatabaseException;
    List<Project> searchProjects(String keyword, String status) throws DatabaseException;
    boolean updateProject(Project project) throws DatabaseException;
    boolean deleteProject(int id) throws DatabaseException;
    int getTotalProjectsCount() throws DatabaseException;
    int getActiveProjectsCount() throws DatabaseException;
}
