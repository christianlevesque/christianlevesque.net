---
pageTitle: Introduction to FreeCodeCamp Microservices Certification in ASP.NET Core
tags:
    - courses
    - fcc
    - fcc_preliminary
    - aspnetcore
category: fcc_courses
date: 2020-10-01
---
[FreeCodeCamp](https://www.freecodecamp.org) is a great learning resource. When I first started taking Javascript seriously, FreeCodeCamp was the single greatest resource in my journey - but the biggest problem I have with FreeCodeCamp is that their curriculum is based almost entirely on JavaScript. They are adding more and more non-JavaScript material, but the lion's share of their coursework is JS-centric.

## It's not all Javascript, though

The great thing about their [APIs and Microservices Certification](https://www.freecodecamp.org/learn/apis-and-microservices/) is that you can complete it in whatever language you choose. When submitting your project, FreeCodeCamp uses the URL you provide and tests your API using AJAX - meaning they never even see your code, only the end result of your API.

Because of this, the APIs and Microservices Certification is a great opportunity to learn whatever backend language you want. Any server-side web language and runtime can be used, from PHP to NodeJS to Ruby to ASP.NET. In this series, I will show you how to build ASP.NET applications while completing the requirements for the APIs and Microservices Certification. I'll walk you through the entire process from beginning to end, making no assumptions about your knowledge of ASP.NET Core. I assume that you have some experience in programming C#, but for those of you who don't, there are many great resources for learning C# online for free on [the Microsoft website](https://dotnet.microsoft.com/learn/csharp). This series doesn't use a specific text editor, terminal, or OS, so feel free to follow along with whatever setup you like.

## What the certification requires

The APIs and Microservices Certification currently has 5 projects you need to complete to claim the certificate. I will go over the projects one at a time, but not in the order they appear on the FreeCodeCamp website - I will order the projects from simplest to most complex so we can cover topics in a logical order.

When you complete your own version of the project (don't just use the code we write together - use that as a starting place to come up with your own solution), you can submit a working URL to your project in the FreeCodeCamp project portal. If your solution is working properly, you will receive credit for completing that project. When you have completed all 5 projects, you can go into your dashboard and claim the certification.

## Notice about plagiarism

Before we get started, I want to point out real quick that it's a violation of the FreeCodeCamp policies to follow this tutorial, copy the code, and then use this code to get the certificate for yourself. The code you use to get the certificate has to be original. I will take a slightly different approach to each project in the certification so you can see different ways to solve a problem in ASP.NET Core. I recommend that you take the approach you like the best and use it to solve each of the projects for yourself.

Now that that's out of the way, let's make sure we're all set up and ready for the projects.