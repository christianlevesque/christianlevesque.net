---
pageTitle: Introduction to Controllers in ASP.NET Core
tags:
    - fcc
    - fcc_file_metadata
category: fcc_file_metadata
date: 2020-10-14
headerImage: /images/fcc/creating-file-metadata-microservice.png
blurb: Learn the basics of Controllers in ASP.NET Core
gitUrl: https://github.com/christianlevesque/fcc-file-metadata-microservice/tree/v0.1.0
---

I've mentioned Controllers several times. But what exactly *are* controllers, anyway?

## Controllers in ASP.NET Core

Controllers are just classes that group together related functionality in your app. Say your app has a login system. There will be several different functions related to your users' accounts - for example, registering a new account, logging in, logging out, changing their email address, and downloading or deleting their data from your server. All of these functionalities will probably be grouped together on a single class: the `UserController`. Each functionality will have its own method on the `UserController` class. Controller methods that return a response to the client are called "actions".

### Example Controller

Don't put this controller into your project yet because we need to modify `Startup.cs` first, or the controller won't actually get loaded into the project. Just look at the code, and we'll go over a few things that make controllers special.

```csharp
using Microsoft.AspNetCore.Mvc;
  
namespace file_metadata.Controllers {
    [Route("/User")]
    public class UserController : Controller {
        public IActionResult GetUser() {
            return Ok(new {Message = "Hello from an ASP.NET Core controller!"});
        }
    }
}
```

First thing, notice that `UserController` extends the `Controller` base class, which is in `Microsoft.AspNetCore.Mvc`. This isn't a requirement in ASP.NET Core, but it will make your life a lot easier because the `Controller` class includes a bunch of useful functionality. One example of this is the `Ok()` method, which `GetUser()` returns. `Ok()` returns a `200 OK` status code, plus converts any object passed in to a JSON response body. `Ok()` doesn't render HTML, so you'll see it used in API-accessible methods but not regular web pages.

Next, notice that the class is decorated with the `[Route]` attribute. You won't generally see this on controllers that render HTML responses, but it's pretty common to see on API controllers. The `[Route]` attribute defines the API endpoint that your code is accessible on. In the above example, the `UserController` can be accessed at `http://127.0.0.1:5000/User`.

Finally, the `GetUser()` method (or "action") returns an `IActionResult`, which is the type returned by the `Controller` class's built-in utilities like `Ok()`. Controller actions generally return `IActionResult` or `Task<IActionResult>`, but they don't have to. 