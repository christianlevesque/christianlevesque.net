---
pageTitle: FCC Project Setup
---

## dotnet

I'm assuming that you are familiar with C# and .NET Core. That being said, I also assume that you have the `dotnet` compiler, runtime, and CLI tool, although if you don't, you can follow Microsoft's instructions to [download dotnet](https://dotnet.microsoft.com/download) for your OS.

## Text editor

As a C# developer, you probably already have a text editor or IDE of choice. If not, I recommend you start with [Visual Studio Code](https://code.visualstudio.com/download) for its ease of use (and its free-ness). I personally can't stand Visual Studio, so I use the [Jetbrains](https://www.jetbrains.com) family of IDEs. They're not free, but they're performant and packed with features.

## API testing software

You can't interact with APIs the way you can interact with regular web pages (well, most of the time - some simple requests will still work). You generally need a special client to manually test your APIs and make sure they work properly. [Postman](https://www.postman.com/) is probably the most popular solution, and it's dead easy to use too. It's free to download and use, but you do have to create an account first.

## Web server

You will need a server that is connected to the internet. There are a few different ways to get this, but one of the easiest (and cheapest) ways is to use a [Vultr VPS instance](https://www.vultr.com/?ref=8506759-6G) (full disclosure: that's an affiliate link).

If your internet modem accepts inbound connections, you can also set up a virtual machine on your home network and add port forwarding rules to your router to host the web application from your home. I don't recommend this option because it opens your home network to requests from the outside world, but if you're careful you can make it work.

In either case, I recommend you install a standard server OS like [Ubuntu](https://ubuntu.com/) (if you install a Linux flavor, be sure to install the server edition and not the desktop edition).

## Web server software
### Reverse Proxy

On your server, you will need to have a reverse proxy installed. I recommend [Nginx](https://www.nginx.com/) because it's fast, secure, and easy to set up.

### ASP.NET runtime

Your server will also need the [ASP.NET Core runtime](https://docs.microsoft.com/en-us/dotnet/core/install/linux-ubuntu#2004-) for your server OS (the link leads to the Ubuntu installation instructions, but you can select other popular OS options from the menu).

### Relational database

For the final project in the certification, you will need a relational database service such as [PostgreSQL](https://www.postgresql.org) or [MySQL](https://www.mysql.com/). ASP.NET applications can be built with NoSQL solutions like MongoDB, but our app will be using the ASP.NET standard Entity Framework, which is a SQL-based ORM. I recommend MySQL for most users, but if you have experience in another relational database then use that. These instructions will assume you're using MySQL so you may have to make changes if you go with a different database.