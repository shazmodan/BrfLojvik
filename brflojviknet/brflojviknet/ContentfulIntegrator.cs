using Contentful.Core;
using Contentful.Core.Configuration;
using Contentful.Core.Search;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace brflojviknet
{
	public class ContentfulIntegrator
	{
		private readonly AppConfig _appConfig;
		private readonly HttpClient _httpClient;
		private readonly IMemoryCache _cache;
		private readonly ContentfulOptions _contentfulOptions;
		private readonly QueryBuilder<object> _queryBuilder;

		private const string ContentfulEntriesCacheKey = "ContentfulEntriesCacheKey";

		public ContentfulIntegrator(AppConfig appConfig, HttpClient httpClient, IMemoryCache memoryCache)
		{
			ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls
			| SecurityProtocolType.Tls11
			| SecurityProtocolType.Tls12;

			_appConfig = appConfig;
			_httpClient = httpClient;
			_cache = memoryCache;
			_contentfulOptions = new ContentfulOptions()
			{
				DeliveryApiKey = _appConfig.ContentfulApiKey,
				ManagementApiKey = null,
				SpaceId = _appConfig.ContentfulSpace,
				UsePreviewApi = false,
				MaxNumberOfRateLimitRetries = 10
			};
			_queryBuilder = QueryBuilder<object>.New.Limit(999);
		}

		public async Task<bool> RenewCache()
		{
			_cache.Remove(ContentfulEntriesCacheKey);
			var content = await GetAllEntries();
			return true;
		}

		public async Task<object> GetAllEntries()
		{
			if (!_cache.TryGetValue(ContentfulEntriesCacheKey, out object cacheEntry))
			{
				var clientWithOptions = new ContentfulClient(_httpClient, _contentfulOptions);

				cacheEntry = await clientWithOptions.GetEntries<object>(_queryBuilder);

				var cacheEntryOptions = new MemoryCacheEntryOptions()
				{
					AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(7)
				};

				_cache.Set(ContentfulEntriesCacheKey, cacheEntry, cacheEntryOptions);
			}

			return cacheEntry;
		}

		public async Task<string> GetAllEntriesAsJson()
		{
			var content = await GetAllEntries();
			var json = JsonConvert.SerializeObject(content, new JsonSerializerSettings
			{
				ContractResolver = new CamelCasePropertyNamesContractResolver()
			});

			return json;
		}

	}
}
