---
pageTitle: Creating the Timestamp Microservice
tags:
    - fcc
    - fcc_timestamp
category: fcc_timestamp
date: 2020-10-11
headerImage: /images/fcc/creating-timestamp-microservice.png
blurb: Write a simple ASP.NET Core application that satisfies the requirements for the FreeCodeCamp Timestamp Microservice
gitUrl: https://github.com/christianlevesque/fcc-timestamp-microservice/tree/v0.3.1
---

Before we start writing our Timestamp Microservice, let's take a minute to think about the app and what it needs to do.

## Planning our microservice

The app is going to send the same response no matter what - a JSON object with `unix` and `utc` keys containing timestamps. There should be two different paths that the app responds to: `/api/timestamp` and `/api/timestamp/{date}`.

### How many middlewares will we need?

Based on that, we need to write at least two middlewares. One middleware should check for the presence of a `{date}` parameter and send a response if `{date}` exists. The other middleware should create a response to represent the current time, because if `{date}` *doesn't* exist, we are supposed to return the current timestamp.

We will go ahead and write two more middlewares, too. We need to do two more things: 1) We need to add the `Content-Type` header to our response, because that will always be the same no matter what the result of the operation is, and 2) we need to correct an irregularity in how Nginx proxies requests with slashes (more on that later).

**Middleware total: 4**

### `app.Use()`, `app.Map()`, `app.UseWhen()`, or `app.MapWhen()`?

There are several different ways the app could be put together. But we really just want to do something simple, so we'll use `app.Use()` because the other choices would add a lot of complexity to the logic with little gain. The other choices can be very powerful, but `app.Use()` is what you'll use most often.

### Possible responses

Our app needs to return one of two JSON responses. If successful, it needs to return a JSON object with the schema:

```json
{
    "unix": 0,
    "utc": "Sun, 13 Dec 2020 20:45:00 GMT"    
}
```

If an invalid date is supplied, it needs to return a JSON object with the schema:

```json
{
    "error": "Invalid Date"
}
```

For the success case, we'll create a `Timestamp` class to represent the response. Since the failure case is always the same, we'll create a simple dictionary on `Startup` to store that response and send it on failure.

### Possible requests

There are five types of requests that FreeCodeCamp might send.

#### No date parameter

If FreeCodeCamp sends a request to `/api/timestamp`, they want the current timestamp. In that case, we'll use `DateTime.Now` to form our response.

#### UNIX date parameter

If FreeCodeCamp sends a request to `/api/timestamp/1234567890`, it represents a UNIX timestamp. We'll need to parse the supplied date as a `long` and add that value to `DateTime.UnixEpoch` to get the appropriate `DateTime` object.

#### UTC date parameter

If FreeCodeCamp sends a request to `/api/timestamp/2000-01-01`, it represents a UTC date string. .NET Core can simply parse the date for us.

#### Non-UTC date parameter

If FreeCodeCamp sends a request to `/api/timestamp/01 January 2000`, it represents a date that JavaScript can understand as-is, but .NET Core can't. Fortunately, .NET Core understands the date format `01-January-2000`, so we can do a simple string replacement.

#### Invalid date

If FreeCodeCamp sends a request to `/api/timestamp/january-third-two-thousand`, it's not a valid date. Send the error response.

### Additional methods

We also need to write a method on `Startup` to generate a `Timestamp` object to return from the microservice. We only need to call it once, but there's a fair bit of logic involved so I'd like to extract it to a separate method that returns a `Timestamp`. This `GetTimestamp()` method will accept a `string`, which will be the date supplied by the FreeCodeCamp tests.

Now, we're finally ready to start writing our app!

## Writing our microservice responses

Open the code where we left it off last lesson. We'll start by creating our response objects so we always have them available.

### Error response

For the error response, let's create an `IDictionary` on the `Startup` class. It's internal only and never changes, so it can be `private readonly`. First, add `using System.Collections.Generic` to your `using` statements. Then, at the very top of the `Startup` class, add the following code:

```csharp
private readonly IDictionary<string, string> _error = new Dictionary<string, string>
{
    {"error", "Invalid Date"}
};
```

This will satisfy the JSON requirement for an invalid date.

### Timestamp response

For the timestamp response, let's create a new `Timestamp` class in the current namespace. In a new file or within the `timestamp` namespace in `Startup.cs`, add the following code:

```csharp
using System.Text.Json.Serialization;

namespace timestamp
{
	public class Timestamp
	{
		[JsonPropertyName("unix")]
		public long Unix { get; }
		
		[JsonPropertyName("utc")]
		public string Utc { get; set; }
	}
}
```

This class creates our properties and maps them to the expected JSON response schema.

#### `Timestamp` constructors

Let's also create two constructors - one that receives a `DateTime` object, and one with no arguments. Add `using System` to your `using` statements and add this to the `Timestamp` class:

```csharp
public Timestamp(DateTime date)
{
    Unix = (long) (date - DateTime.UnixEpoch).TotalMilliseconds;
    Utc = date.ToString("R");
}

public Timestamp() : this(DateTime.Now) { }
```

The first constructor creates a `TimeSpan` by subtracting the UNIX epoch from the supplied `DateTime`, then gets the total milliseconds of that `TimeSpan` and converts it to a `long` for the `Unix` property. It also generates the `Utc` property by formatting the `DateTime` with the `R` option, which is the exact format expected by FreeCodeCamp.

The second constructor just calls the first constructor and supplies the current date. (`DateTime.Now` can't be the default value for the first constructor because it's not a constant value.)

## Writing our middlewares, part 1

### First middleware - Nginx proxy correction

When Nginx matches paths in `Location` blocks, it knows how to match trailing slashes - `/api/timestamp` and `/api/timestamp/` will both trigger the `/api/timestamp` block. However, when Nginx proxies requests, it sends the unmatched portion of the URI as the URI to the proxy.

For example, if I have a location block like this:

```nginx
Location /api/timestamp {
    proxy_pass http://127.0.0.1:5000/;
}
```

and Nginx receives a request for `/api/timestamp/2015-01-01`, the `proxy_pass` URI will be `//api/timestamp/2015-01-01` because the unique part of the request is `/2015-01-01`. This gets appended to the proxy path, which already includes a `/`.

Most of the time, it's not a big deal. ASP.NET Core's routing middleware is able to correct it for you, and even when you're not using routing middleware (like now), you could just have two location blocks - one to serve `/api/timestamp/`, and one to redirect requests for `/api/timestamp` to `/api/timestamp/`. But the FreeCodeCamp testing suite doesn't follow redirects, so we have a couple choices. We could either have two location blocks, or we could correct the double slash. My `/api/timestamp` block has about a dozen or so rules, so rather than duplicating these rules, it's easier to just correct the double slash. To do that, add the following middleware after `app.UseCors()`:

```csharp
app.Use((context, next) =>
{
    if (context.Request.Path.ToString().StartsWith("//"))
    {
        context.Request.Path = context.Request.Path.ToString().Substring(1);
    }

    return next.Invoke();
});
```

This middleware simply checks if the path starts with a double slash, and if so, reassign it without the double slash. Instead of awaiting the call to `next.Invoke()`, I chose to return the `Task`.

### Second middleware - apply `Content-Type` header

This middleware adds the `Content-Type` header to our response. (This doesn't "write to the response" - it just stores the value on the `HttpResponse` object. The response is written when we call `HttpResponse.WriteAsync()`.) The correct MIME type for our application is `application/json`, so go ahead and add this code below the first middleware:

```csharp
app.Use((context, next) =>
{
    context.Response.ContentType = "application/json";
    return next.Invoke();
});
```

### Third middleware - current timestamp

This middleware will actually come last in the pipeline, but since it's simple, we'll go ahead and write it here. Add `using System.Text.Json` to your `using` statements, then add the following code at the end of the `Configure()` method:

```csharp
app.Run(context =>  context.Response.WriteAsync(JsonSerializer.Serialize(new Timestamp())));
```

All this does is return a new JSON-serialized instance of `Timestamp`, and since we used the empty constructor, it will use `DateTime.Now` to generate the values.

At this point, you can run the application if you like and make sure everything works the way it should. Send a request in Postman to `localhost:5000` and look at the response. 

## Writing the `GetTimestamp()` method

Before we can write the middleware that returns a `Timestamp` for a specific date, we need to write the method that generates it. Add `using System` to your `using` list, then add the following code to the `Startup` class:

```csharp
private Timestamp GetTimestamp(string dateString)
{
    if (long.TryParse(dateString, out var unixDate))
    {
        var date1 = DateTime.UnixEpoch.AddMilliseconds(unixDate).ToUniversalTime();
        return new Timestamp(date1);
    }

    if (DateTime.TryParse(dateString, out var date2))
        return new Timestamp(date2);

    dateString = dateString.Replace("%20", "-");
    if (DateTime.TryParse(dateString, out var date3))
        return new Timestamp(date3);

    return null;
}
```

There are four return paths here, so let's look at all of them in turn.

### UNIX timestamp

The first block of code checks to see if FreeCodeCamp supplied a UNIX timestamp. It tries to parse a `long`, and if the `dateString` is a valid `long`, it adds that `long` to the UNIX epoch and sets the `DateTime.Kind` to UTC. Finally, it returns a new `Timestamp` instance.

```csharp
if (long.TryParse(dateString, out var unixDate))
{
    var date1 = DateTime.UnixEpoch.AddMilliseconds(unixDate).ToUniversalTime();
    return new Timestamp(date1);
}
```

### UTC date string

The second block of code checks to see if FreeCodeCamp supplied a UTC date string. It tries to parse a `DateTime` from the string, and if it was successful, it returns a new `Timestamp` instance.

```csharp
if (DateTime.TryParse(dateString, out var date2))
    return new Timestamp(date2);
```

### Non-UTC date string

The third block of code checks to see if FreeCodeCamp supplied a non-UTC date string. JavaScript can understand different date string formats than C#, and since the curriculum was designed with JavaScript in mind, they sent tests that JavaScript should be able to handle. Since we're using C#, we need to make a small modification to these date strings before we can parse them.

This code does a global replace of `%20` with `-` - this replaces a URL-encoded space character with a hyphen. This is because .NET Core can't parse "01 January 2000", but it *can* parse "01-January-2000". Since the date string pulled from the path is URL-encoded, we need to replace `%20`.

```csharp
dateString = dateString.Replace("%20", "-");
    if (DateTime.TryParse(dateString, out var date3))
        return new Timestamp(date3);
```

### Invalid date

The final return statement, `return null`, only fires if all three attempts to parse a date failed. When we write our middleware, we'll check and see if the return value is `null` and if it is, we know the parsing failed.

## Writing our middlewares, part 2

### Fourth middleware - timestamp of a provided date

This last middleware goes between `app.Run()` and the middleware that adds the `Content-Type` header. Add the following code there:

```csharp
app.Use((context, next) =>
{
    if (context.Request.Path == "/")
        return next.Invoke();

    var date = context.Request.Path.ToString().Substring(1);
                      
    var timestamp = GetTimestamp(date);
    if (timestamp == null)
        return context.Response.WriteAsync(JsonSerializer.Serialize(_error));

    return context.Response.WriteAsync(JsonSerializer.Serialize(timestamp));
});
```

Let's break this one down by section.

### No date supplied

If the request path is `/`, no date was supplied, so go straight to the next middleware (which is in `app.Run()`, handling dateless requests).

```csharp
if (context.Request.Path == "/")
        return next.Invoke();
```

### Get the date string

Get the entire request path, minus the first character. The first character is the leading `/`, so we need to discard that.

```csharp
var date = context.Request.Path.ToString().Substring(1);
```

### Get the timestamp

Get the timestamp using the date string. If `timestamp` is null, it means that `GetTimestamp()` couldn't parse a date, so return our error message.

```csharp
var timestamp = GetTimestamp(date);
if (timestamp == null)
    return context.Response.WriteAsync(JsonSerializer.Serialize(_error));
```

### Return the timestamp

Finally, return the generated timestamp as JSON.

```csharp
return context.Response.WriteAsync(JsonSerializer.Serialize(timestamp));
```

## Testing our application

Our application is ready to run! Go ahead and launch the app and switch over to Postman.

### Test the current timestamp and `Content-Type` middleware

Start by sending a blank request to `http://127.0.0.1:5000`. You should get back the current timestamp, marked as `GMT`. The `Content-Type` should be `application/json`.

### Test the double-slash replacing middleware and error response

To test this, send a blank request to `http://127.0.0.1:5000//` with two trailing slashes. The request should still return the current timestamp. If you add a third trailing slash, the request should fail with the "Invalid Date" JSON message.

### Test the supplied-date timestamp middleware

Now, test supplying a date to your microservice.

First, send a request to `http://127.0.0.1:5000/1451001600000`. This should return a date of Friday, 25 Dec 2015 at midnight.

Next, send a request to `http://127.0.0.1:5000/2015-12-25`. This should also return a date of Friday, 25 Dec 2015 at midnight.

Finally, send a request to `http://127.0.0.1:5000/25-December-2015`. This should also return a date of Friday, 25 Dec 2015 at midnight.

## That's it!

This microservice is ready to go! After you've created your own version, you'll be ready to upload it and run tests on FreeCodeCamp. If you don't remember how to set up Nginx to proxy to your app, follow the instructions from the [Request Header Parser Microservice](/blog/fcc/header-parser/uploading-request-header-parser-microservice/). Just remember to use the location `/api/timestamp` instead of `/api/whoami`!

A reference version of this final app can be found on [GitHub](https://github.com/christianlevesque/fcc-timestamp-microservice), including deployment scripts for Bash and PowerShell.

### A note about your Nginx configuration

If you use a server with caching configured, you will need to **disable** caching in your `/api/timestamp` location block. Otherwise, your microservice response may get cached by the browser and your changes won't take effect. I fell victim to this myself. To disable caching for your microservice location, add the following configuration to your location block:

```nginx
location /api/timestamp {
    # Disable cache
    add_header Last-Modified $date_gmt;
    add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
    if_modified_since off;
    expires off;
    etag off;
    
    # Other config
}
```

This sets the `Last-Modified` header to the current date, adds a `Cache-Control` header that disables caching, disables the `If-Modified-Since` request header, and disables the `Expires` and `Etag` response headers. With this in place, you should be able to avoid caching issues.