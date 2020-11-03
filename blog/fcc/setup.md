---
pageTitle: FCC Project Setup
---
I'm assuming that you are familiar with C# and .NET Core. That being said, I also assume that you have the `dotnet` compiler, runtime, and CLI tool, although if you don't, you can follow Microsoft's instructions to [download dotnet](https://dotnet.microsoft.com/download) for your OS.

As a C# developer, you probably already have a text editor or IDE of choice. If not, I recommend you start with [Visual Studio Code](https://code.visualstudio.com/download) for its ease of use (and its free-ness). I personally can't stand Visual Studio, so I use the [Jetbrains](https://www.jetbrains.com) family of IDEs. They're not free, but they're performant and packed with features.

For the final project in the certification, you will need a relational database service such as [PostgreSQL](https://www.postgresql.org) or [MySQL](https://www.mysql.com/). ASP.NET applications can be built with NoSQL solutions like MongoDB, but our app will be using the ASP.NET standard Entity Framework, which is a SQL-based ORM.