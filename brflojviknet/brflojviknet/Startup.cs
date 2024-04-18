using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;

namespace brflojviknet
{
	public class Startup
	{
		private class RedirectUrl
		{
			public bool ShouldRedirect { get; set; }
			public string Url { get; set; }

			public RedirectUrl(bool shouldRedirect, string url)
			{
				ShouldRedirect = shouldRedirect;
				Url = url;
			}
		}	

		private const int OneWeek = 604800;
		public IConfiguration Configuration { get; }

		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddMvc();
			services.AddMemoryCache();
			services.AddResponseCaching();
			services.AddSingleton(new AppConfig(Configuration));
			services.AddSingleton<HttpClient, HttpClient>();
			services.AddSingleton<ContentfulIntegrator, ContentfulIntegrator>();
		}

		private static RedirectUrl GetRedirectUrl(string host)
		{
			var newUrl = "https://brflojvik.se";

			if (host.Contains("brflojvik.com"))
			{
				return new RedirectUrl(true, newUrl);
			}

			if (host.Contains("www.brflojvik.se"))
			{
				return new RedirectUrl(true, newUrl);
			}

			return new RedirectUrl(false, "");
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			app.Use(async (context, next) =>
			{
				var redirectUrl = GetRedirectUrl(context.Request.Host.Host);
				if (redirectUrl.ShouldRedirect)
				{
					context.Response.Redirect(redirectUrl.Url);
				}
				else
				{
					await next();
				}
			});

			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}

			app.UseStaticFiles(new StaticFileOptions()
			{
				OnPrepareResponse = ctx =>
				{
					ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=" + OneWeek);
				}
			});

			app.UseMvc(routes =>
			{
				routes.MapRoute("default", "{controller=Home}/{action=Index}/{id?}");
			});
		}
	}
}
