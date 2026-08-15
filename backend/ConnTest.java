import java.sql.*;
public class ConnTest {
  public static void main(String[] args) throws Exception {
    String url = System.getenv().getOrDefault("DB_URL", "jdbc:postgresql://localhost:5433/sa_learnership");
    String user = System.getenv().getOrDefault("DB_USERNAME", "sa_learnership_user");
    String pass = System.getenv().getOrDefault("DB_PASSWORD", "Mog@le");
    System.out.println("URL=" + url);
    System.out.println("USER=" + user);
    System.out.println("PASSWORD_SET=" + (pass != null && !pass.isEmpty()));
    try (Connection c = DriverManager.getConnection(url, user, pass)) {
      System.out.println("CONNECTED");
      try (Statement s = c.createStatement()) {
        ResultSet rs = s.executeQuery("SELECT current_user, current_database();");
        while (rs.next()) {
          System.out.println(rs.getString(1) + " | " + rs.getString(2));
        }
      }
    }
  }
}
