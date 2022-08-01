In order to write software on your computer, you'll need several tools. We'll go over the most important tools you'll need here.

## Software Development Kit (SDK)

Probably the single most important tool you need is called a Software Development Kit. Each programming language has its own SDK, so even if you already have SDKs for other languages like Java or C++, you will still need to download the special SDK for .NET programs. (.NET, pronounced "dotnet", is the term for the platform used to run C# applications - you can't have C# apps without .NET!)

You can find the .NET SDK on the [Microsoft .NET downloads page](https://dotnet.microsoft.com/download/dotnet/6.0). There, you can find all the downloads associated with .NET 6, which is the most current version of .NET as of this writing. There are two sets of downloads on the downloads page - one set is for the SDK, and one is for the "runtime". The runtime is used to run .NET apps, but doesn't include the tools necessary to build .NET apps, so make sure you get the SDK version for your OS. Most people should download the installer, not the binary.

### Choosing the correct architecture

You need to make sure to choose the correct processor architecture. If you select the wrong architecture, the SDK won't run (and probably won't even install properly).

#### macOS

If you're on macOS, you have two choices: x64 and Arm64. Apple recently released a new processor architecture that they call the M1 processor. Sometimes it's also called Apple Silicon. If you have M1/Apple Silicon, you need to download the Arm64 version of the SDK. Otherwise, you need to download the x64 version. If you have an older Mac that runs on PowerPC or x32, you won't be able to develop .NET apps with the modern toolkit.

#### Windows

If you're on Windows, you have several choices. Most likely, you need the x64 option, but if you're not sure, you can find out what architecture you need on Windows 10 by going to Settings, then selecting System, then finally selecting About at the bottom of the list on the left. The correct architecture will be shown on the System Type line, as below.

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

### Which text editor should I use?

The short answer is, it doesn't matter. Just pick one. In this course, I recommend you start by using [Visual Studio Code](https://code.visualstudio.com), which is free.

Later on, you may decide to go with a more advanced tool, such as [Visual Studio](https://www.visualstudio.com) or [Rider](https://www.jetbrains.com/rider/). But for now, these tools aren't necessary.

### Installing Visual Studio Code

Download the installer by going to the [Visual Studio Code website](https://code.visualstudio.com) and clicking the download button. Once the installer is downloaded, double-click it to run.

1. Accept the license agreement and click Next.
2. You can change the installation location if you want, but the default location is probably best. Leave this unchanged and click Next.
3. You can change the name of the Start Menu folder if you want. You can also tick the box at the bottom of the installer if you want to skip creating a Start Menu folder altogether. Click Next.
4. Under "Additional Icons", tick the box next to "Create a desktop icon" if you want to create a shortcut to Visual Studio Code on your desktop. Under "Other", tick both boxes that start with "Add 'Open with Code'..." because these options are very useful. Click Next.
5. Click Install.
6. Once the installer has finished running, make sure the "Launch Visual Studio Code" box is ticked, then click Finish.

### Installing Visual Studio Code C# extension

Visual Studio Code is used to write code in many different programming languages. It has support for a few out of the box, but C# isn't one of them, so we need to download an extension that lets us write C# more easily.

To install the C# extension, start by running Visual Studio Code, if you haven't already. Click the Extensions tab on the left-hand side of the window:

![VS Code Extensions tab](/images/programming/csharp/vs-code-extensions-tab.jpg)

Enter "C#" in the search bar at the top of the Extensions tab and hit "Enter", then find the "C#" extension by Microsoft and click the install button:

![VS Code Extensions tab](/images/programming/csharp/vs-code-csharp-extension.jpg)