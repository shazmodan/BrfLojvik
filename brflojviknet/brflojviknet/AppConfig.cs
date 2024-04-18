using System.IO;
using System.Reflection;
using Microsoft.Extensions.Configuration;

namespace brflojviknet
{
	public class AppConfig
	{
		private const string _demoDataFileName = "demoData.json";

		public string ContentfulSpace { get; private set; }
		public string ContentfulApiKey { get; private set; }
		public bool IsDevelopment { get; private set; }
		public string DemoData { get; private set; }

		public AppConfig(IConfiguration configuration)
		{
			var assemblyPath = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);
            var demoDataFilePath = Path.Combine(assemblyPath, _demoDataFileName);
			DemoData = File.ReadAllText(demoDataFilePath);

			ContentfulApiKey = configuration.GetSection("AppConfiguration")["ContentfulApiKey"];
			ContentfulSpace = configuration.GetSection("AppConfiguration")["ContentfulSpace"];
			IsDevelopment = bool.Parse(configuration.GetSection("AppConfiguration")["IsDevelopment"]);
		}
	}
}
