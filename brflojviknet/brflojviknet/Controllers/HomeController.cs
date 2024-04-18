using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.IO;
using System.Threading.Tasks;

namespace brflojviknet
{
	public class HomeController : Controller
    {
        private const int OneHour = 3600;
		public const string HomeControllerIndexCacheKey = "HomeControllerIndexCacheKey";

		private readonly IHostingEnvironment _env;
		private readonly ContentfulIntegrator _contentfulIntegrator;
		private readonly IMemoryCache _cache;

		public HomeController(
			IHostingEnvironment env, 
			ContentfulIntegrator contentfulIntegrator, 
			IMemoryCache memoryCache
			)
		{
			_env = env;
			_contentfulIntegrator = contentfulIntegrator;
			_cache = memoryCache;
		}

		public async Task<string> GetIndexFileData()
		{
			var json = _contentfulIntegrator.GetAllEntriesAsJson();
			var encoding = new System.Text.UTF8Encoding();
			var indexFilePath = Path.Combine(_env.WebRootPath, "index.html");
			var htmlString = System.IO.File.ReadAllText(indexFilePath, encoding);
			var insertionString = string.Format("<script type='text/javascript'>window.APP_DATA={0}</script>", await json);
			var insertionIndex = htmlString.IndexOf("<script");
			var htmlWithAppData = htmlString.Insert(insertionIndex, insertionString);

			return htmlWithAppData;
		}

		// GET: /
		public async Task<IActionResult> Index()
		{
			if (!_cache.TryGetValue(HomeControllerIndexCacheKey, out string cacheEntry))
			{
				cacheEntry = await GetIndexFileData();
				var cacheEntryOptions = new MemoryCacheEntryOptions()
				{
					AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(7)
				};

				_cache.Set(HomeControllerIndexCacheKey, cacheEntry, cacheEntryOptions);
			}

			Response.ContentType = "text/html;charset=utf-8";
			return Content(cacheEntry);
		}
	}
}
