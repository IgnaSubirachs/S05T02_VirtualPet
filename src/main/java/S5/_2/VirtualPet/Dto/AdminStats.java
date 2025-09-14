package S5._2.VirtualPet.Dto; // posa-ho al package que toqui

public class AdminStats {
    private long totalUsers;
    private long activeUsers;
    private long totalPets;
    private long dailyLogins;
    private long newRegistrations;

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }

    public long getTotalPets() { return totalPets; }
    public void setTotalPets(long totalPets) { this.totalPets = totalPets; }

    public long getDailyLogins() { return dailyLogins; }
    public void setDailyLogins(long dailyLogins) { this.dailyLogins = dailyLogins; }

    public long getNewRegistrations() { return newRegistrations; }
    public void setNewRegistrations(long newRegistrations) { this.newRegistrations = newRegistrations; }
}
