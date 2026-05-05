package com.tickets.dto;

import java.util.List;

public class DashboardStats {

    private long totalTickets;
    private long openTickets;
    private long inProgressTickets;
    private long closedTickets;
    private long highPriority;
    private long mediumPriority;
    private long lowPriority;
    private List<TechnicianStats> technicianStats;

    public DashboardStats() {}

    public DashboardStats(long totalTickets, long openTickets, long inProgressTickets, long closedTickets,
                          long highPriority, long mediumPriority, long lowPriority, List<TechnicianStats> technicianStats) {
        this.totalTickets = totalTickets;
        this.openTickets = openTickets;
        this.inProgressTickets = inProgressTickets;
        this.closedTickets = closedTickets;
        this.highPriority = highPriority;
        this.mediumPriority = mediumPriority;
        this.lowPriority = lowPriority;
        this.technicianStats = technicianStats;
    }

    public long getTotalTickets() { return totalTickets; }
    public void setTotalTickets(long totalTickets) { this.totalTickets = totalTickets; }
    public long getOpenTickets() { return openTickets; }
    public void setOpenTickets(long openTickets) { this.openTickets = openTickets; }
    public long getInProgressTickets() { return inProgressTickets; }
    public void setInProgressTickets(long inProgressTickets) { this.inProgressTickets = inProgressTickets; }
    public long getClosedTickets() { return closedTickets; }
    public void setClosedTickets(long closedTickets) { this.closedTickets = closedTickets; }
    public long getHighPriority() { return highPriority; }
    public void setHighPriority(long highPriority) { this.highPriority = highPriority; }
    public long getMediumPriority() { return mediumPriority; }
    public void setMediumPriority(long mediumPriority) { this.mediumPriority = mediumPriority; }
    public long getLowPriority() { return lowPriority; }
    public void setLowPriority(long lowPriority) { this.lowPriority = lowPriority; }
    public List<TechnicianStats> getTechnicianStats() { return technicianStats; }
    public void setTechnicianStats(List<TechnicianStats> technicianStats) { this.technicianStats = technicianStats; }

    public static class TechnicianStats {
        private Long userId;
        private String userName;
        private String userEmail;
        private long ticketCount;

        public TechnicianStats() {}

        public TechnicianStats(Long userId, String userName, String userEmail, long ticketCount) {
            this.userId = userId;
            this.userName = userName;
            this.userEmail = userEmail;
            this.ticketCount = ticketCount;
        }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public String getUserEmail() { return userEmail; }
        public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
        public long getTicketCount() { return ticketCount; }
        public void setTicketCount(long ticketCount) { this.ticketCount = ticketCount; }
    }
}
