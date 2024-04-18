using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;
using System.Threading.Tasks;
using System.Net;

namespace brflojviknet.Controllers
{
	[Route("api/[controller]")]
	public class ContentController : Controller
	{
		private const int OneHour = 3600;

		private readonly ContentfulIntegrator _contentfulIntegrator;
		private readonly AppConfig _appConfig;
		private readonly IMemoryCache _cache;

		public ContentController(ContentfulIntegrator contentfulIntegrator, AppConfig appConfig, IMemoryCache memoryCache)
		{
			_contentfulIntegrator = contentfulIntegrator;
			_appConfig = appConfig;
			_cache = memoryCache;
		}

		// GET api/content/
		[HttpGet]
		[Route("")]
		[ResponseCache(Duration = OneHour)]
		public async Task<JsonResult> All()
		{
			if (_appConfig.IsDevelopment && Request.Headers.TryGetValue("Origin", out StringValues requestOrigin))
			{
				Response.Headers.Add("Access-Control-Allow-Origin", requestOrigin);
			}

			var content = await _contentfulIntegrator.GetAllEntries();
			return Json(content);
		}

		//GET api/content/demodata
		[HttpGet]
		[Route("demodata")]
		[ResponseCache(Duration = OneHour)]
		public JsonResult DemoData()
		{
			Response.ContentType = "application/json";
			return Json(_appConfig.DemoData);
		}

		//GET api/content/webhook
		[HttpPost]
		[Route("webhook")]
		public async Task<bool> ContentfulWebhook()
		{
			_cache.Remove(HomeController.HomeControllerIndexCacheKey);
			var cacheIsRenewed = await _contentfulIntegrator.RenewCache();
			return cacheIsRenewed;
		}

		//GET api/content/contentfulredirect/someUrl
		[HttpGet]
		[Route("contentfulredirect/{url}")]
		public ActionResult ContentfulRedirect(string url)
		{
			var returnUrl = WebUtility.UrlDecode(url);
			return Redirect(returnUrl);
		}
	}
}
