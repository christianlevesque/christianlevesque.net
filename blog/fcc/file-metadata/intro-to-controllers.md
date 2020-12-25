---
pageTitle: Introduction to Controllers in ASP.NET Core
tags:
    - fcc
    - fcc_file_metadata
category: fcc_file_metadata
date: 2020-10-14
headerImage: /images/fcc/creating-file-metadata-microservice.png
blurb: Learn the basics of Controllers in ASP.NET Core
gitUrl: https://github.com/christianlevesque/fcc-file-metadata-microservice/tree/v0.1.1
---

I've mentioned Controllers several times. But what exactly *are* controllers, anyway?

## Controllers in ASP.NET Core

Controllers are just classes that group together related functionality in your app. Say your app has a login system. There will be several different functions related to your users' accounts - for example, registering a new account, logging in, logging out, changing their email address, and downloading or deleting their data from your server. All of these functionalities will probably be grouped together on a single class: the `UserController`. Each functionality will have its own method on the `UserController` class. Controller methods that return a response to the client are called "actions".

Controllers aren't just any classes with related functionality, though, because that describes **any** class in C#. Specifically, controllers define the `endpoints` for your app, or the places where users interact with your app. These map to the URI portion of the address. The Timestamp Microservice app had two endpoints, for example: `/api/timestamp` and `/api/timestamp/{date}`. If we had built the Timestamp Microservice with controllers, it would have had a single controller, `TimestampController`. `TimestampController` would have had two actions: one for requests without a date, and one for requests with a date.

### Formal controller definition

According to the [Microsoft docs entry on controllers](https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/actions), a controller must be *instantiable* - i.e., you must be able to call `new MyController()`. This means static classes and abstract classes can't be controllers. Furthermore, a controller **must** meet at least one of the following requirements:

- class name has the `Controller` suffix
- class inerits from a class whose name has the `Controller` suffix
- class is decorated with either the `[Controller]` or `[ApiController]` attribute

Controllers have several conventions that developers follow, too. Controllers typically go in the `<project_root>/Controllers` directory in your ASP.NET project. They also typically inherit from the `Controller` or `ControllerBase` classes in `Microsoft.AspNetCore.Mvc`.

## Examples

Don't put these controllers into your project - just look at the code. We'll start writing our own controllers shortly.

### Example controller

This controller is designed to respond to requests with a traditional rendered HTML response. HTML-rendering controllers return the `View()` method, but we won't be covering these in this series. This example controller has a single action, which is accessible by a `GET` request to `/User` on the app. Because no route is explicitly defined, the routing relationship between the controller name, action name, and endpoint route is defined in `Startup.cs` (we'll cover how this works in a later lesson). In my experience, this is used most often in ASP.NET apps that render HTML on the backend like traditional websites.

```csharp
using Microsoft.AspNetCore.Mvc;

namespace file_metadata.Controllers {
    [Controller]
    public class UserController : Controller {
        public IActionResult Index() {
            return View();
        }
    }
}
```

This file is identifiable as a controller because it follows several of the required and optional conventions for controllers. The class name is suffixed by `Controller` and decorated with the `[Controller]` attribute, which both tell ASP.NET that this class is a controller. It also extends the `Controller` class, and based on its namespace we can assume it's stored in the `/Controllers` directory of the project, which both help developers identify it as a controller.

### Example API controller

This controller responds to requests like an API, with either an empty response or JSON response by default. You can get empty or JSON responses by using the many utility methods on the `ControllerBase` class, such as `Ok()` for a `200 OK` response and `NotFound()` for a `404 Not Found` response. (The `Controller` class extends `ControllerBase`, so even if your controller extends `Controller`, you can still use these utility methods.) Like the previous example, this controller has a single action accessible at `GET /User`, but the route is defined on the controller with the `[Route]` attribute, so you don't need to define an explicit routing rule in `Startup.cs`. This convention is more common in RESTful APIs.

```csharp
using Microsoft.AspNetCore.Mvc;

namespace file_metadata.Controllers {
    [ApiController]
    [Route("/User")]
    public class UserController : ControllerBase {
        public IActionResult GetUser() {
            return Ok(new {Message = "Hello from an ASP.NET Core controller!"});
        }
    }
}
```

These examples were short and compact because we need to start writing controllers in order to really understand how they work. Head over to the next lesson to get started!