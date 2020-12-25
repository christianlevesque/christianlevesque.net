---
pageTitle: Writing Controllers in ASP.NET Core
tags:
    - fcc
    - fcc_file_metadata
category: fcc_file_metadata
date: 2020-10-15
headerImage: /images/fcc/creating-file-metadata-microservice.png
blurb: Learn how to create controllers in ASP.NET Core
gitUrl: https://github.com/christianlevesque/fcc-file-metadata-microservice/tree/v0.1.1
---

Before we can actually write a controller, we need to add controller support into our application. Clone my starter project from [GitHub](https://github.com/christianlevesque/fcc-file-metadata-microservice/tree/v0.1.1), open `Startup.cs`, and then add the following code to the `ConfigureServices()` method after the `AddCors()` call:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(...);

    services.AddControllers();
}
```

`services.AddControllers()` registers several parts of the ASP.NET Core platform as services. 

Next, add the following code to the `Configure()` method after the `UseCors()` call:

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // Other code
    app.UseCors();

    app.UseRouting();

    app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
}
```