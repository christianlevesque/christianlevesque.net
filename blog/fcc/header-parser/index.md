---
pageTitle: Request Header Parser Microservice
tags:
    - fcc
    - fcc_header_parser
    - fcc_courses
category: fcc_header_parser
date: 2020-10-03
---
This project is small and simple, so it makes a great starting point for jumping into ASP.NET Core.

Basically, this microservice will read headers from incoming requests and return some of those values as JSON. Returning results as JSON is a common task when writing APIs and microservices, and reading request headers is too.

## Project setup

To get ready to code, all you need to do is decide where you want to store the code for the project and create a directory for it. The project should have its own directory somewhere to make sure its code is kept separate from the rest of your file system. (I put my copy of this project in `~/code/fcc/header-parser`, but you can choose anything you like.)

Now, open a terminal program and navigate to your new directory. Once in your directory, run this command:

```bash
dotnet new webapi
```

### What just happened?

The command you just ran scaffolded a new ASP.NET Core web application into the current directory - specifically, a web application meant to function as an API. There is no HTML or other view-based code in this new project, but there are several `.cs` files, a couple directories, and a few other files. So what exactly was created?

1. `Program.cs` - this is the standard C# entrypoint file. There's nothing special about this file, except it contains the code necessary to start an ASP.NET Core website.
2. `Startup.cs` - this file is where the ASP.NET Core application is configured. We will mainly be working with this file in this project, so we'll come back to it later.
3. `your-directory-name.csproj` - this is the standard C# project file, which will be familiar if you've worked with .NET Core in the past. By default, this file is named after the directory containing the C# project.
4. `appsettings.json` and `appsettings.Development.json` - these contain app runtime configurations, settings, database connections, and any arbitrary data you want to pass into your application. `appsettings.json` is the default configuration file, but you can override its configuration on a per-environment basis by adding settings into `appsettings.{Environment}.json`. ASP.NET Core will load the global `appsettings` file first, then overwrite its settings with the proper environment-specific `appsettings` file. ASP.NET Core decides which environment it is in by the value of the `ASPNETCORE_ENVIRONMENT` environment variable. If you're coming from .NET Framework, be aware that these files replace `app.config`.
5. `WeatherForecast.cs` - This is a data model provided by the ASP.NET Core team as a reference. In the reference application that has been scaffolded for us, `WeatherForecast` represents the object that would be returned by the API if we were to run it.
6. `/Controllers` - this directory contains a single C# class file, `WeatherForecastController.cs`. This is just a reference, like the `WeatherForecast.cs` file.
7. `/Properties` - this directory contains application launch profiles and other information. If you have C# experience, you've probably seen this before.

### What do I do with these files?

Some of it we can keep, but some of it we should delete. For now, delete the `WeatherForecast.cs` file, the `appsettings.Development.json` file, and the `Controllers` directory - and if you don't know what to do with it, delete the `Properties` directory (I don't personally use `Properties`, but if you know what it does and want to use it, that's fine).

## Project requirements

The microservice should be hosted at `/api/whoami` on whatever server you host your code on. There are a few different ways to achieve this, and which way you choose will likely depend on how you host your app.

There are four requirements for the Request Header Parser microservice project:

1. You should provide your own project, not the example URL.
2. A request to `/api/whoami` should return a JSON object with your IP address in the `ipaddress` key.
3. A request to `/api/whoami` should return a JSON object with your preferred language in the `language` key.
4. A request to `/api/whoami` should return a JSON object with your software in the `software` key.

Let's go over these one at a time.

### You should provide your own project, not the example URL.

FCC provides example projects for each of their projects. This requirement appears in each of their microservices projects, and it simply means that in the URL input on the project page, you use your own project URL instead of the URL to the example project.

### A request to `/api/whoami` should return a JSON object with your IP address in the `ipaddress` key

Any request that is sent to `/api/whoami` should return a JSON object. This requirement expects the user's IP address to be included in that JSON object in a field called `ipaddress`. So if the user's IP address is `12.34.56.78`, their response would be:

```json
{
    "ipaddress": "12.34.56.78"
}
```

There are several ways to determine the user's IP address, depending on how your application is hosted.

### A request to `/api/whoami` should return a JSON object with your preferred language in the `language` key

The JSON object returned from `/api/whoami` needs to have a second field called `language`. There is an HTTP request header called `Accept-Language`, and the value of this header should be returned in the `language` field. If the user's `Accept-Language` header is `en-US`, their response would further be:

```json
{
    "ipaddress": "12.34.56.78",
    "language": "en-US"
}
```

### A request to `/api/whoami` should return a JSON object with your software in the `software` key

The JSON object returned from `/api/whoami` needs to have a third field called `software`. There is an HTTP request header called `User-Agent`, which identifies what software you're using to access a website. The value of this header should be returned in the `software` field. If the user's `User-Agent` header is `Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0`, their response would further be:

```json
{
    "ipaddress": "12.34.56.78",
    "language": "en-US",
    "software": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0"
}
```

All of this will be done at the same time. All our microservice needs to do is accept an incoming request, copy the values of those three headers, and inject those values into the response as a JSON object.

Now that we know what we need to do, let's get started writing some code!