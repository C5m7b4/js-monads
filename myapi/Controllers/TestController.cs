using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace myapi.Controllers;

[ApiController]
[Route("test")]
public class TestController : ControllerBase
{
  private readonly IConfiguration _config;

  public TestController(IConfiguration config)
  {
    _config = config;
  }

  [HttpGet]
  [Route("testservice")]
  public ActionResult TestService()
  {
    try
    {
      return Ok(new
      {
        error = 0,
        success = true,
        msg = "Test success"
      });
    }
    catch (System.Exception ex)
    {
      return Ok(new
      {
        error = 1,
        success = false,
        msg = ex.Message
      });
    }
  }

  [HttpGet]
  [Route("testdb")]
  public ActionResult TestDb()
  {
    try
    {
      using (SqlConnection conn = new SqlConnection(DbUtils.GetConnectionString(_config)))
      {
        conn.Open();
        conn.Close();
      }

      return Ok(new
      {
        error = 0,
        success = true,
        msg = "Test db success"
      });
    }
    catch (System.Exception ex)
    {
      return Ok(new
      {
        error = 1,
        success = false,
        msg = ex.Message
      });
    }
  }
}