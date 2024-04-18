using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace brflojviknet
{
	public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost().Run();
        }

		//WebHost.CreateDefaultBuilder().Build();

		public static IWebHost BuildWebHost() =>
            new WebHostBuilder()
                .UseKestrel()
				.UseContentRoot(Directory.GetCurrentDirectory())
				.ConfigureAppConfiguration((builderContext, config) =>
				{
					IHostingEnvironment env = builderContext.HostingEnvironment;

					config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
						.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true);
				})
				.UseIISIntegration()
				.UseDefaultServiceProvider((context, options) =>
				{
					options.ValidateScopes = context.HostingEnvironment.IsDevelopment();
				})
				.UseStartup<Startup>()
                .Build();
    }
}
