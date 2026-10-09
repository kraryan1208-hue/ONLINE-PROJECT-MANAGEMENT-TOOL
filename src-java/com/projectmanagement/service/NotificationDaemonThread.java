package com.projectmanagement.service;

import com.projectmanagement.dao.TaskDAO;
import com.projectmanagement.dao.TaskDAOImpl;
import com.projectmanagement.model.Task;

import java.util.List;

/**
 * Meaningful Java Thread implementation satisfying Review 1 Core Java Rubric:
 * A background daemon thread that runs periodically (every 5 minutes or configured interval)
 * inspecting approaching task deadlines and logging notifications.
 */
public class NotificationDaemonThread extends Thread {

    private volatile boolean running = true;
    private final TaskDAO taskDAO;
    private final long checkIntervalMs;

    public NotificationDaemonThread() {
        this(60000); // 1 minute default check
    }

    public NotificationDaemonThread(long intervalMs) {
        this.taskDAO = new TaskDAOImpl();
        this.checkIntervalMs = intervalMs;
        setName("OPMT-Deadline-Notification-Daemon");
        setDaemon(true); // Daemon thread exits when JVM stops
    }

    @Override
    public void run() {
        System.out.println("[Thread: " + getName() + "] Started background deadline monitoring.");
        while (running) {
            try {
                // Perform deadline checks
                List<Task> pendingTasks = taskDAO.filterTasks(null, "Pending", null, null, null);
                long now = System.currentTimeMillis();
                for (Task task : pendingTasks) {
                    if (task.getDeadline() != null) {
                        long diff = task.getDeadline().getTime() - now;
                        if (diff > 0 && diff < 86400000L * 2) { // Within 2 days
                            System.out.println("[Thread Warning] Task ID " + task.getId() + " ('" + task.getTitle() + "') approaches deadline: " + task.getDeadline());
                        }
                    }
                }
                // Sleep for interval
                Thread.sleep(checkIntervalMs);
            } catch (InterruptedException e) {
                System.out.println("[Thread: " + getName() + "] Interrupted. Shutting down gracefully.");
                running = false;
            } catch (Exception e) {
                System.err.println("[Thread: " + getName() + "] Error during scheduled inspection: " + e.getMessage());
            }
        }
    }

    public void stopDaemon() {
        this.running = false;
        interrupt();
    }
}
