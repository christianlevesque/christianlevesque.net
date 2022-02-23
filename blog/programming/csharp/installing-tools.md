---
pageTitle: Installing the tools you'll need
tags:
    - csharp
category: csharp
date: 2021-05-25
headerImage: /images/backend/wordpress-hosting/wp-logo.png
blurb: Getting your machine ready for C# development
---

In order to write software on your computer, you'll need several tools. We'll go over the most important tools you'll need here.

## Software Development Kit (SDK)

Probably the single most important tool you need is called a Software Development Kit. Each programming language has its own SDK, so even if you already have SDKs for other languages like Java or C++, you will still need to download the special SDK for .NET programs. (.NET, pronounced "dotnet", is the term for the platform used to run C# applications - you can't have C# apps without .NET!)

You can find the .NET SDK on the [Microsoft .NET downloads page](https://dotnet.microsoft.com/download/dotnet/5.0). There, you can find all the downloads associated with .NET 5, which is the most current version of .NET to date. There are two sets of downloads on the downloads page - one set is for the SDK, and one is for the "runtime". The runtime is used to run .NET apps, but doesn't include the tools necessary to build .NET apps, so make sure you get the SDK version for your OS. Most people should download the installer, not the binary.

You also need to make sure to choose the correct processor architecture. If you're on macOS, you only have one choice (x64), but if you're on Windows, you have several. Most likely, you need the x64 option, but if you're not sure, you can find out what architecture you need by going to Settings, then selecting System, then finally selecting About at the bottom of the list on the left. The correct architecture will be shown on the System Type line, as below.

![Windows processor architecture](/images/programming/csharp/processor-arch.jpg)

## Text editor

When you write software, you typically use a special kind of text editor instead of something like Notepad or Microsoft Word. There are a couple reasons for this.

Firstly, text editors like Microsoft Word aren't really suited for writing source code. Most text editors format your text in special ways that make it look better, but this also prevents the SDK from understanding your code. Source code editors leave the files formatted as plain text with no rich formatting, so the SDK will always be able to understand your code.

Secondly, source code editors have many tools built in that help you write code more efficiently. You'll have to take my word for it right now, because these features usually aren't used by absolute beginners.

Thirdly, source code editors apply special formatting to your files so that you can identify different parts of your program at a glance. (This special formatting is visual only - the underlying text is still stored as plain text, so the SDK will still understand your code when you build your program.)

To illustrate the third point, here are two screenshots of the same code, one in Notepad and one in a premium text editor called Rider:

![Unformatted source code](/images/programming/csharp/source-code-unformatted.jpg)

![Formatted source code](/images/programming/csharp/source-code-formatted.jpg)

As you can see, the code in the second image is pretty colorful. The different colors mean different things, and they help you to identify parts of your program quickly. For example, in the standard Rider color scheme:

- dark blue is used for language keywords
- light blue is used for class instances and class properties
- bright green is used for method calls
- dark green is used for code comments
- purple is used for namespaces and class identifiers
- white is used for variables
- orange is used for string literals

You don't need to understand what any of those things are to see how it can be useful to have different parts of your code highlighted differently. If you know you want to change the text in a string of characters, then instead of scanning line by line for the string you want, you can just look for orange areas in the document.