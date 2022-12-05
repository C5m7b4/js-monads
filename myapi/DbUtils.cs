namespace myapi;

public static class DbUtils
{
  public static string GetConnectionString(IConfiguration config)
  {
    string server = config["DB:server"];
    string database = config["DB:database"];
    string username = config["DB:username"];
    string password = config["DB:password"];
    string connectionString = "Data Source=" + server + ";Initial Catalog=" + database + ";User Id=" + username + ";Password=" + password + ";TrustServerCertificate=true";
    return connectionString;
  }
}