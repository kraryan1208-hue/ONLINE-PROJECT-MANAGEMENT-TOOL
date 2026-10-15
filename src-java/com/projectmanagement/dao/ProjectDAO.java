package com.projectmanagement.dao;

import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.Project;
import com.projectmanagement.model.ProjectProgress;
import com.projectmanagement.model.User;
import java.util.List;

/**
 * Data Access Object (DAO) Interface for Project entity.
 * Handles Project CRUD, relational project member allocation,
 * and dynamic metrics querying against MySQL database & v_project_progress view.
 */
public interface ProjectDAO {
    // Project CRUD
    boolean createProject(Project project) throws DatabaseException;
    Project getProjectById(int id) throws DatabaseException;
    List<Project> getAllProjects() throws DatabaseException;
    List<Project> getProjectsByManager(int managerId) throws DatabaseException;
    List<Project> searchProjects(String keyword, String status) throws DatabaseException;
    boolean updateProject(Project project) throws DatabaseException;
    boolean deleteProject(int id) throws DatabaseException;
    int getTotalProjectsCount() throws DatabaseException;
    int getActiveProjectsCount() throws DatabaseException;

    // Relational Project Members (project_members table)
    boolean addProjectMember(int projectId, int userId) throws DatabaseException;
    boolean removeProjectMember(int projectId, int userId) throws DatabaseException;
    List<User> getProjectMembers(int projectId) throws DatabaseException;
    List<Project> getProjectsForMember(int userId) throws DatabaseException;
    List<Integer> getMemberIdsByProject(int projectId) throws DatabaseException;

    // Dynamic Project Progress View (v_project_progress MySQL view)
    ProjectProgress getProjectProgressFromView(int projectId) throws DatabaseException;
    List<ProjectProgress> getAllProjectProgressFromView() throws DatabaseException;
}
