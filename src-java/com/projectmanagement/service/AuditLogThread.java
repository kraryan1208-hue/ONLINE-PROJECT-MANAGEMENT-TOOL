package com.projectmanagement.service;

import com.projectmanagement.dao.ActivityDAO;
import com.projectmanagement.dao.ActivityDAOImpl;

/**
 * Runnable Task demonstrating asynchronous worker thread execution for logging activities
 * without blocking client HTTP servlet request threads.
 */
public class AuditLogThread implements Runnable {

    private final int userId;
    private final String activityDescription;
    private final ActivityDAO activityDAO;

    public AuditLogThread(int userId, String activityDescription) {
        this.userId = userId;
        this.activityDescription = activityDescription;
        this.activityDAO = new ActivityDAOImpl();
    }

    @Override
    public void run() {
        try {
            activityDAO.logActivity(userId, activityDescription);
            System.out.println("[Audit Thread ID " + Thread.currentThread().getId() + "] Logged: " + activityDescription);
        } catch (Exception e) {
            System.err.println("[Audit Thread Error] Failed to write audit record: " + e.getMessage());
        }
    }

    /**
     * Helper to spawn thread asynchronously
     */
    public static void logAsync(int userId, String description) {
        Thread worker = new Thread(new AuditLogThread(userId, description));
        worker.setName("Audit-Worker-" + System.currentTimeMillis());
        worker.start();
    }
}
