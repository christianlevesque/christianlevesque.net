---
pageTitle: Creating the Request Header Parser Microservice
tags:
    - fcc
    - fcc_header_parser
category: fcc_header_parser
date: 2020-10-07
headerImage: /images/fcc/creating-request-header-parser-microservice.png
gitUrl: https://github.com/christianlevesque/fcc-header-parser-microservice/tree/v0.4.1
---

Now we have enough information to complete the Request Header Parser Microservice! To begin with, let's create a data model to represent the request headers to send as JSON.

## `RequestHeaders` POCO

If you're familiar with [Model-View-Controller architecture](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), you know that data models are just POCOs. We're going to create a new POCO in our project called `RequestHeaders`. It won't inherit from anything, and for simplicity, it can live in the root namespace of the project (for my project, that would be `header_parser`, but yours may be different).

If you look back at the project requirements in [the introduction to the Request Header Parser Microservice](/blog/fcc/header-parser), you will see that the API needs to return a JSON object with three keys, so `RequestHeaders` should have one auto-implemented string property for each of those keys: `IpAddress`, `Software`, and `Language`.

```csharp
// RequestHeaders.cs

namespace header_parser
{
	public class RequestHeaders
	{
		public string IpAddress { get; set; }
		public string Software { get; set; }
		public string Language { get; set; }
	}
}
```

## Returning JSON from the microservice

Now that we have a data model to represent the JSON, we need to copy our header values into an instance of the data model. Simply set each property of the `RequestHeaders` class to the corresponding header value after the end of the first `if` block inside the `app.Run` callback:

```csharp
if (!context.Request.Headers.TryGetValue("User-Agent", out var software) ||
    !context.Request.Headers.TryGetValue("X-Forwarded-For", out var ipAddress) ||
    !context.Request.Headers.TryGetValue("Accept-Language", out var language))
{
    context.Response.StatusCode = 400;
    await context.Response.WriteAsync("<h1>Bad request</h1>");
    return;
}

var headers = new RequestHeaders
{
    IpAddress = ipAddress,
    Language = language,
    Software = software
};
```

Now we need to convert our data model to JSON in the response. To do that, we will use the `JsonConverter.Serialize()` method, and to use that, we will need to add `using System.Text.Json` to the top of `Startup.cs`. `JsonConverter.Serialize()` can work with just an instance of the object to serialize, so just pass `JsonSerializer.Serialize(headers)` in as the argument to `HttpResponse.WriteAsync()`:

```csharp
context.Response.Headers.Add("X-Application-Purpose", "FreeCodeCamp Request Header Parser Microservice");
context.Response.ContentType = "text/html";
context.Response.StatusCode = 200;
await context.Response.WriteAsync(JsonSerializer.Serialize(headers));
```

Before we run this, we can make a couple more small changes. Firstly, delete the line that adds the `X-Application-Purpose` header because that was just a demonstration. Secondly, our response is no longer `HTML` - now it's `JSON`, and the correct MIME type for `JSON` is `application/json`, so go ahead and update the `HttpResponse.ContentType` as well. Your `Startup.cs` file should look like this:

```csharp
using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;

namespace header_parser
{
	public class Startup
	{
		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}

			app.Run(async context =>
			{
				if (!context.Request.Headers.TryGetValue("User-Agent", out var software) ||
					!context.Request.Headers.TryGetValue("X-Forwarded-For", out var ipAddress) ||
					!context.Request.Headers.TryGetValue("Accept-Language", out var language))
				{
					context.Response.StatusCode = 400;
					await context.Response.WriteAsync("<h1>Bad request</h1>");
					return;
				}
				
				var headers = new RequestHeaders
				{
					IpAddress = ipAddress,
					Language = language,
					Software = software
				};

				context.Response.ContentType = "application/json";
				context.Response.StatusCode = 200;
				await context.Response.WriteAsync(JsonSerializer.Serialize(headers));
			});
		}
	}
}
```

Now you can run the project and make sure that it works. Once the project is running, switch over to Postman and spin up a new request to `localhost:5000`. Be sure that the `X-Forwarded-For`, `Accept-Language`, and `User-Agent` headers all have values, and send your request. It should run fine and your response should look a lot like this:

```json
{
    "IpAddress": "12.34.56.78",
    "Software": "PostmanRuntime/7.26.8",
    "Language": "en-US"
}
```

You may think we're ready to upload our microservice and test it, but not yet! The JSON returned by the microservice isn't quite right because the casing is wrong - our JSON is in Pascal case, but the keys that FreeCodeCamp expects are all lowercase.

## Changing the JSON output

There are a number of ways to change the JSON created by a POCO. When we learn how to use ASP.NET controllers in a later part of the series, we will see that ASP.NET can actually convert your POCO to JSON automatically, in a standardized way. But a simple app using `app.Run()` doesn't get that benefit, so we have to use a different method.

The simplest method supported by ASP.NET Core 3.1 is the `JsonPropertyNameAttribute`. Open `RequestHeaders.cs`, and at the top of the file, add `using System.Text.Json.Serialization`, then add `[JsonPropertyName("<output_name>")]` before each auto-property, replacing `<output_name>` with the name each property should take in the JSON output. Your final `RequestHeaders.cs` file should look like this:

```csharp
using System.Text.Json.Serialization;

namespace header_parser
{
	public class RequestHeaders
	{
		[JsonPropertyName("ipaddress")]
		public string IpAddress { get; set; }
		
		[JsonPropertyName("software")]
		public string Software { get; set; }
		
		[JsonPropertyName("language")]
		public string Language { get; set; }
	}
}
```

Give that a run and re-run your request from Postman. Your response should now look something like this:

```json
{
    "ipaddress": "12.34.56.78",
    "software": "PostmanRuntime/7.26.8",
    "language": "en-US"
}
```

Now, you're ready to upload your microservice to the web and give it a test!