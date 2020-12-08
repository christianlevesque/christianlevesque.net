---
pageTitle: Reading Request Headers in ASP.NET Core
tags:
    - fcc
    - fcc_header_parser
category: fcc_header_parser
date: 2020-10-06
headerImage: /images/fcc/reading-request-headers.png
gitUrl: https://github.com/christianlevesque/fcc-header-parser-microservice/tree/v0.3.1
---

Last lesson, we spent most of our time writing response headers. However, this lesson we're going to be *reading* the *request* headers.

The Request Header Parser Microservice requires us to read the request headers from a request and write them into the response as JSON, so in order to do that, we need to be able to read those headers. I mentioned in the previous lesson that the `HttpContext` object has a reference to the `HttpRequest` object, and that's where we'll be going to read the headers.

## Reading request headers

Request headers live at `HttpRequest.Headers`, which is an `IHeaderDictionary` just like `HttpResponse.Headers`. But when you're reading headers, you have to use the `IDictionary.TryGetValue()` method because you don't know for sure whether a header exists.

Let's start by reading the `User-Agent` request header and then printing it back to the browser. To retrieve the `User-Agent` value, add the following code to the very top of the `app.Run()` callback:

```csharp
if (!context.Request.Headers.TryGetValue("User-Agent", out var software))
{
    context.Response.StatusCode = 400;
    await context.Response.WriteAsync("<h1>Bad request</h1>");
    return;
}
```

Let's break it down.

- `if (!context.Request.Headers.TryGetValue("User-Agent", out var software)) {...}` This is the standard `IDictionary.TryGetValue()` method. It checks for the `User-Agent` header, and if it's present, copies its value to the `software` variable, which is declared inline.
- `context.Response.StatusCode = 400` This sets the HTTP status code to 400 if the `TryGetValue()` call fails. A failure means the required header is not present, so `400 Bad Request` is a common HTTP status code in that case.
- `await context.Response.WriteAsync("<h1>Bad request</h1>")` This just prints an HTML `<h1>` to the output with the contents "Bad request" to serve as a visual indicator that there was a problem.
- `return` If the request was bad, we want to return here and stop the execution. The return type of the `app.Run()` callback is `Task` so we don't return anything, we just stop the execution.

Then, simply change the final `WriteAsync()` to print the value of the software variable:

```csharp
await context.Response.WriteAsync($"<p>Your software is {software}</p>");
```

Your `Startup.cs` file should now look like this:

```csharp
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
				if (!context.Request.Headers.TryGetValue("User-Agent", out var software))
				{
					context.Response.StatusCode = 400;
					await context.Response.WriteAsync("<h1>Bad request</h1>");
					return;
				}

				context.Response.Headers.Add("X-Application-Purpose", "FreeCodeCamp Request Header Parser Microservice");
				context.Response.ContentType = "text/html";
				context.Response.StatusCode = 200;
				await context.Response.WriteAsync($"<p>Your software is {software}</p>");
			});
		}
	}
}
```

Now run the app and navigate to `http://127.0.0.1:5000` in your browser. Your `User-Agent` header string should now be printed on the screen!

## Reading the rest of the request headers

Now that we know how to read request headers, it's a pretty trivial thing to read the other two headers and print them to the screen as well. Go ahead and modify your code to retrieve all three headers...

```csharp
if (!context.Request.Headers.TryGetValue("User-Agent", out var software) ||
    !context.Request.Headers.TryGetValue("X-Forwarded-For", out var ipAddress) ||
    !context.Request.Headers.TryGetValue("Accept-Language", out var language))
{
    context.Response.StatusCode = 400;
    await context.Response.WriteAsync("<h1>Bad request</h1>");
    return;
}
```

...and print them back to the user:

```csharp
await context.Response.WriteAsync($"<p>Your software is {software}</p>" +
								  $"<p>Your IP address is {ipAddress}</p>" +
								  $"<p>Your preferred language is {language}</p>");
```

Your final `Startup.cs` file should look like this:

```csharp
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

				context.Response.Headers.Add("X-Application-Purpose", "FreeCodeCamp Request Header Parser Microservice");
				context.Response.ContentType = "text/html";
				context.Response.StatusCode = 200;
				await context.Response.WriteAsync($"<p>Your software is {software}</p>" +
												  $"<p>Your IP address is {ipAddress}</p>" +
												  $"<p>Your preferred language is {language}</p>");
			});
		}
	}
}
```

Now if you try to navigate to `http://127.0.0.1:5000` in your browser, you'll get a bad request message. Why is that?

### Bad request - missing header

One of the headers we ask for is the `X-Forwarded-For` header, which is not part of the HTTP standard. `X-Forwarded-For` is most commonly used by proxies such as Nginx to identify the IP address of the user making the request, but we don't have Nginx set up to forward requests to our app (yet) so the `X-Forwarded-For` header doesn't exist on the request. As a result, the second call to `Headers.TryGetValue()` is returning `false` and our Bad Response block is triggered.

To verify that our app is working correctly, we need to go into Postman and make the request from there. Create a new request of type `GET` and point it to `localhost:5000`. If you send the request as-is, you will still get a `400 Bad Request` response because several headers are missing. If you switch over to the Headers tab in Postman and expand the hidden headers, you will see that Postman generates 6 headers automatically - one of which is `User-Agent`. That means we still need to manually add `X-Forwarded-For` and `Accept-Language`. Go ahead and add these two headers with whatever values you choose, and send the request. The response body should contain three `<p>` blocks, one for each header we checked.

## That's it!

Now that we know how to pull in the request headers and store them in variables, all we need to do is send the response in JSON format and we will be ready to upload our microservice!