package com.projectmanagement.dao;

import com.projectmanagement.exception.AuthenticationException;
import com.projectmanagement.exception.DatabaseException;
import com.projectmanagement.model.User;
import java.util.List;

/**
 * Data Access Object (DAO) Interface for User entities.
 * Defines contract for JDBC operations, demonstrating abstraction.
 */
public interface UserDAO {
    User authenticate(String email, String password) throws DatabaseException, AuthenticationException;
    boolean createUser(User user) throws DatabaseException;
    User getUserById(int id) throws DatabaseException;
    User getUserByEmail(String email) throws DatabaseException;
    List<User> getAllUsers() throws DatabaseException;
    List<User> searchUsers(String keyword, String role) throws DatabaseException;
    List<User> getUsersByRole(String role) throws DatabaseException;
    boolean updateUser(User user) throws DatabaseException;
    boolean updateProfile(int userId, String name, String email, String password) throws DatabaseException;
    boolean deleteUser(int id) throws DatabaseException;
    int getTotalUsersCount() throws DatabaseException;
}
