---
pageTitle: Introduction to CORS in ASP.NET Core
tags:
    - fcc
    - fcc_timestamp
category: fcc_timestamp
date: 2020-10-11
headerImage: /images/fcc/intro-to-cors.png
blurb: Learn more about what CORS is and how to handle CORS in ASP.NET Core
gitUrl: https://github.com/christianlevesque/fcc-timestamp-microservice/tree/v0.2.0
---

## Cleaning up our code

First things first, let's clear out most of the application code and start with a blank slate. Go ahead and delete everything we added last lesson, leaving just the `if (env.IsDevelopment()) {...}` part. (If your IDE complains that `using Microsoft.AspNetCore.Http` is not being used, don't worry about it - we'll be using it again when we start building the app out in the next post.)

## What is CORS?

As we discussed when creating the Request Header Parser Microservice, Cross-Origin Resource Sharing is a protocol that signals to web browsers that your app is willing to let other domains (like `https://www.freecodecamp.org`) access your app. But why does it need to do this?

### Same-Origin Policy

Back in the day, hackers used to be able to do all sorts of bad things on the web, like steal session cookies for your online banking and use those to make purchases or wire transfers from your account. This was possible because browsers would send whatever HTTP request a webpage wanted. Combined with other attack vectors like cross-site scripting (XSS), this could be devastating to a website's users even if the website owner wasn't doing anything wrong.

To prevent this from happening, browsers started implementing the Same-Origin Policy, meaning that certain types of requests can only be made to the exact same domain you're on. For example, right now you're on `https://www.christianlevesque.io`, so the browser will only honor HTTP requests made to that exact domain. If you open the JavaScript console in your browser and run this:

```js
fetch('https://www.facebook.com')
```

you'll get an error message saying something about cross-origin requests.

So what does the browser consider the "same origin"? There are three criteria the browser uses:

#### HTTP Protocol

The `http://` and `https://` protocols are considered different origins, so if you ran

```js
fetch('http://www.christianlevesque.io')
```

from the console, it would fail (this time with a "mixed content" error message instead of "cross-origin").

#### HTTP Host

The actual domain name is considered a unique origin, and subdomains are distinct from the root domain. If you ran

```js
fetch('https://christianlevesque.io')
```

from the console, it would fail with a "cross-origin" message.

#### HTTP Port

Even the port number is a unique origin, because different services can listen on different ports. HTTP traffic can theoretically come on any port, so even though HTTP usually travels over `port 80` and HTTPS usually travels over `port 443`, you can change the way your server listens for traffic.

You can't test this one with a `fetch()` call because my website only listens on `80` and `443`, but if you've ever built a full-stack JavaScript app with Webpack DevServer running on `localhost:8080` and an Express server running on `localhost:8000`, you've probably run into this issue before (unless you knew to configure DevServer's proxy feature from the start).

### But cross-origin requests still work!

Yes, they do. Content Delivery Networks are used to deliver front-end libraries like jQuery, Bootstrap, and React. You can link images straight from Imgur. This is because browsers allow some kinds of cross-origin content like images, and there are workarounds for other content like APIs. Cross-origin content isn't bad if it's **wanted**, so browsers have devised different ways of letting servers decide whether cross-origin requests should be fulfilled or not.

## How CORS works

There were a few more steps in between (like `jsonp`), but the current solution to different servers sharing resources is CORS. Browsers send a small request to the remote server before requesting a cross-origin resource, just to make sure the server wants to allow such resource sharing. This is called a "preflight request", and many cross-origin requests require one (but a few simple cases don't). If the server says it's okay with the request, the browser will send it - but if the server doesn't explicitly OK the request, the browser will cancel it with an error.

### Anatomy of a CORS request

The CORS protocol operates within the HTTP protocol. All a CORS request does is add up to three HTTP headers to a request.

#### `Origin` HTTP header

The `Origin` header tells the server what domain is sending the request. The URI portion of the address is excluded, but the protocol is included. A cross-origin GET request to Google from this blog post would look like this: 

```http request
GET / HTTP/1.1
Host: www.google.com
Origin: https://www.christianlevesque.io
```

Since this is a simple request, your browser doesn't send a preflight request. Instead, it includes the `Origin` header and sends the request, checking the response for specific headers that green-light a CORS request. If those headers are present, the response is returned to the JavaScript. If those headers aren't present, JavaScript throws an error.

#### `Access-Control-Request-Method` HTTP header (preflight only)

The `Access-Control-Request-Method` asks the server if a particular request method is acceptable or not. The browser only includes this header in a preflight request.

Browsers never consider some HTTP methods "simple" - for example, `PATCH` always sends a preflight. A preflight request sends an `OPTIONS` request to the server with CORS headers only (and the `Host` header, which is never optional). A cross-origin `PATCH` preflight request to Google from this blog post would look like this:

```http request
OPTIONS / HTTP/1.1
Host: www.google.com
Origin: https://www.christianlevesque.io
Access-Control-Request-Method: PATCH
```

For more reading, check out [this article on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method).

#### `Access-Control-Request-Headers` HTTP header (preflight only)

The `Access-Control-Request-Headers` header is used to tell the server what HTTP headers the request will contain. The browser also only includes this header in preflight requests.

Assuming your request sets the `Content-Type`, `User-Agent`, and `X-Custom-Header` headers, the preflight request from the last example would look further like this:

```http request
OPTIONS / HTTP/1.1
Host: www.google.com
Origin: https://www.christianlevesque.io
Access-Control-Request-Method: PATCH
Access-Control-Allow-Headers: Content-Type, User-Agent, X-Custom-Header
```

For more reading, check out [this article on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers).

### Anatomy of a CORS response

CORS has a series of HTTP responses that provide the information the browser asked for.

#### `Access-Control-Allow-Origin` HTTP header

This header indicates whether the `Origin` from the request is allowed to access the requested resource. If it is, the `Access-Control-Allow-Origin` header will have the same value as the `Origin` header. If a resource allows **any** domain to access, the `Access-Control-Allow-Origin` will have the value `*`.

In the `Origin` example, one of three responses might come back, depending on whether the site is allowed to access the resource:

```http request
# Request
GET / HTTP/1.1
Host: www.google.com
Origin: https://www.christianlevesque.io

# Response if that specific origin is allowed
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://www.christianlevesque.io
Vary: Origin

# Response if any origin is allowed
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *

# Response if that origin is not allowed
HTTP/1.1 204 No Content
```

The `Vary` header is sent when the `Origin` is specifically listed in the allowed origins. This tells the browser that the value of `Access-Control-Allow-Origin` will vary based on the `Origin`, since `Access-Control-Allow-Origin` returns `Origin` if it's allowed.

Other headers would probably come back with those responses - I just omitted non-CORS headers for the examples.

#### `Access-Control-Allow-Methods` HTTP header

This header lists the methods that are allowed to access a resource in a comma-separated list. It is only sent in response to `Access-Control-Request-Method`, so if your preflight doesn't send that request header, you won't see this header in the response.

Even if the `Access-Control-Request-Method` is not in the allowed list, the preflight request will come back as if it was successful. However, the browser will look at `Access-Control-Allow-Methods` and cancel the request if `Access-Control-Request-Method` is not listed.

In the `Access-Control-Request-Method` example, if the `Origin` is allowed the response will look like this (assuming allowed methods of `GET`, `POST`, and `PUT`):

```http request
# Request
OPTIONS / HTTP/1.1
Host: www.google.com
Origin: https://www.christianlevesque.io
Access-Control-Request-Method: PATCH

# Response if the origin is allowed
# regardless of whether the method is allowed
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://www.christianlevesque.io
Vary: Origin
Access-Control-Allow-Methods: GET, POST, PUT
```

#### `Access-Control-Allow-Headers` HTTP header

This header lists the HTTP headers that are allowed in requests to a resource, as a comma-separated list. It is only sent in response to `Access-Control-Request-Headers`, so if your preflight doesn't send that request header, you won't see this header in the response.

Even if `Access-Control-Request-Headers` contains headers not in the allowed list, the preflight request will come back as if it was successful. However, the browser will look at `Access-Control-Allow-Headers` and cancel the request if `Access-Control-Request-Headers` used blocked headers.

In the `Access-Control-Request-Headers` example, if the `Origin` is allowed the response will look like this (assuming allowed headers of `Content-Type` and `User-Agent`):

```http request
# Request
OPTIONS / HTTP/1.1
Host: www.google.com
Origin: https://www.christianlevesque.io
Access-Control-Request-Method: PATCH
Access-Control-Allow-Headers: Content-Type, User-Agent, X-Custom-Header

# Response if the origin is allowed
# regardless of whether the headers are allowed
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://www.christianlevesque.io
Vary: Origin
Access-Control-Allow-Headers: Content-Type, User-Agent
```

### More CORS information

There are more CORS-related headers than these. MDN maintains a list of these headers with links to articles about each of them, which you can find [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#CORS).

## Adding CORS support

Next, let's go ahead and add CORS support to our empty app. We know we'll need it, so we might as well add it now while things are pretty clean. Start by adding `using Microsoft.Extensions.DependencyInjection` and `using Microsoft.Net.Http.Headers` to your `using` section, then add the following method to the `Startup` class:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(options =>
    {
        options.AddPolicy("AllowFcc", policy =>
        {
            policy.WithOrigins("https://www.freecodecamp.org");
            policy.WithMethods("GET");
            policy.WithHeaders(HeaderNames.Accept, HeaderNames.AcceptEncoding, HeaderNames.AcceptLanguage, HeaderNames.Connection, HeaderNames.Host, HeaderNames.Origin, HeaderNames.Referer, HeaderNames.UserAgent);
        });
    });
}
```

This CORS policy is a bit different than our last one. Let's look at it line by line.

### `policy.WithOrigins()`

This method accepts a `params string[]` argument of origins to accept. Now, only one of the origins passed into `policy.WithOrigins()` will be approved for a CORS request - so in our case, only requests from `https://www.freecodecamp.org` will be allowed.

### `policy.WithMethods()`

This method accepts a `params string[]` argument of methods to accept. We only passed `GET` in, so only `GET` requests will be approved.d

### `policy.WithHeaders()`

This method accepts a `params string[]` argument of request headers to accept. `HeaderNames` is a static class in the `Microsoft.Net.Http.Headers` namespace containing static properties for each HTTP header, so for simplicity, we import `HeaderNames` and use its properties - however, we could have passed strings directly in, and that's how you add custom headers.

### Apply the CORS policy

To use the `AllowFcc` CORS policy, add the following line below your `if (env.IsDevelopment()) {...}` block:

```csharp
app.UseCors("AllowFcc");
```

## Testing CORS

Before we test how our CORS headers work, let's add an `app.Run()` block that returns any random message you like. If CORS is working in our app, we won't actually see this response, but it's an easy way to see if CORS **isn't** working.

```csharp
app.Run(context => context.Response.WriteAsync("Hello, CORS!"));
```

### Testing preflight checks

Let's make sure our preflight checks are working properly. We'll also play around with some of the values to see what happens when preflight checks fail or they send values that aren't expected by the server.

#### Sending a successful preflight check in Postman

Now, run the app and switch over to Postman. Create a new request to `localhost:5000`, set the HTTP method to `OPTIONS`, and add these three headers to the request:

```http request
Access-Control-Request-Headers: Accept, Accept-Encoding, Accept-Language, Connection, Host, Origin, Referer, User-Agent
Access-Control-Request-Method: GET
Origin: https://www.freecodecamp.org
```

These values exactly correspond to our app's CORS policy, so if you send this request, you should receive the following response back with a `204 No Content` status code:

```http request
Access-Control-Allow-Headers: Accept, Accept-Encoding, Accept-Language, Connection, Host, Origin, Referer, User-Agent
Access-Control-Allow-Methods: GET
Access-Control-Allow-Origin: https://www.freecodecamp.org
```

You'll notice that our `app.Run()` didn't actually execute. That's because `app.UseCors()` is a middleware - so on `OPTIONS` requests, it sends a response before `app.Run()` in the pipeline.

#### Sending a failing preflight check

Now, to see what happens when a preflight check fails, just change the `https://` to `http://` in the `Origin` header. Since `http://www.freecodecamp.org` isn't in the list of allowed `Origin`s, you get a `204 No Content` back, but with no CORS headers. The `app.Run()` middleware still doesn't run because even though the CORS request wasn't approved, the middleware was still triggered.

#### Sending invalid headers in a preflight check

Go ahead and switch the `Origin` header back to its correct value. Now, see what happens when you add an extra header to the `Access-Control-Request-Headers` list. Add `From` to the list of headers and re-run the request. It should appear exactly the same as the successful preflight check from a few minutes ago because sending invalid headers doesn't cause a preflight check to fail.

#### Sending invalid method in a preflight check

Remove `From` from the list of `Access-Control-Request-Headers`. Now, change the `Access-Control-Request-Method` value from `GET` to `POST` and re-run the request. As before, it should appear to be successful even though `POST` is not in the allowed methods list.

### Testing a CORS request

Now, we want to see what happens with our actual requests. To start, create a new `GET` request to `localhost:5000` in Postman and set the following headers:

```http request
Accept-Language: en-US
Referer: https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/timestamp-microservice
Origin: https://www.freecodecamp.org
```

Postman should set `Host`, `User-Agent`, `Accept`, `Accept-Encoding`, and `Connection` already (you can see these by clicking the eye icon above the headers list with a count of how many headers are hidden - if Postman is sending a `No-Cache` or `Postman-Token` header, disable these in the `Settings > General > Headers` options).

Now that all the expected headers are set and the request method matches our policy, go ahead and send the request. You should get a status of `200 OK` and see your message printed in the Body section of Postman. The CORS protocols in our app were triggered, and we know this because a) we sent the `Origin` header, which triggers CORS, and b) if we look at the response headers, the `Access-Control-Allow-Origin` header is set. This tells us that we just made a successful CORS request.

### Testing for CORS enforcement

Now, let's check and make sure that our app enforces our CORS settings. To do that, simply change the request method from `GET` to `POST`, because `POST` is not in our list of allowed headers. Send the request and wait for it...

...*WHAT?*

Okay, sorry. I couldn't resist. Yes, the request still worked, even though a disallowed HTTP method was used. It would still work if you went back and added extra request headers, too. You can even change the `Origin` header to something else entirely - the only thing that will do is remove the `Access-Control-Allow-Origin` header from the response.

This is the biggest thing I want you to take away from this lesson - **CORS does not improve the security of your app!** Servers don't actually enforce CORS rules. It's entirely up to the browser to enforce CORS rules, and there are ways to tell your browser not to enforce CORS rules on itself. So don't trust your CORS policy to protect you from cross-site requests, because it won't.

## That's all

Now that we've suffered this harrowing disappointment together, it's time to actually build our Timestamp Microservice!