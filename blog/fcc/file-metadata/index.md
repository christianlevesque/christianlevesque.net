---
pageTitle: File Metadata Microservice
tags:
- fcc
- fcc_file_metadata
- fcc_courses
category: fcc_file_metadata
date: 2020-10-13
headerImage: /images/fcc/fcc-orange.png
blurb: Complete the FreeCodeCamp File Metadata Microservice in ASP.NET Core
---

In this project, we're going to take a much different direction - we'll start using Controllers for the first time!

This microservice is actually really simple, so it makes a great first project for Controllers. All that happens is FreeCodeCamp uploads a file to your microservice, and your microservice sends back information about the file, like its name and size.

## Project setup

Since we're going to be using a whole new method of writing ASP.NET Core web apps, we're going to start basically from scratch. I have another GitHub repository ready, so grab the project [from GitHub](https://github.com/christianlevesque/fcc-file-metadata-microservice/tree/v0.1.0), or you can clone it directly from your command line.

### Git via SSH

If you use SSH for your Git operations, run:

```bash
git clone -b v0.1.0 --single-branch git@github.com:/christianlevesque/fcc-file-metadata-microservice.git
cd fcc-file-metadata-microservice # or wherever you cloned the repo to
git switch -c master
```

If you clone my repository, don't forget to change your remote repository! Set up your own GitHub repository, then run:

```bash
git remote set-url origin git@github.com:/your_git_username/your_repo_name.git
```

### Git via HTTPS

If you use HTTPS for your Git operations, run:

```bash
git clone -b v0.1.0 --single-branch https://github.com/christianlevesque/fcc-file-metadata-microservice.git
cd fcc-file-metadata-microservice # or wherever you cloned the repo to
git switch -c master
```

If you clone my repository, don't forget to change your remote repository! Set up your own GitHub repository, then run:

```bash
git remote set-url origin https://github.com/your_git_username/your_repo_name.git
```

## Project requirements

The File Metadata Microservice will be hosted at `/api` this time. Requests will actually be sent to `/api/fileanalyse`, but this app will handle the `/fileanalyse` portion of the URI because we'll be using Controllers in our routing.

Additionally, the microservice must meet these 4 requirements:

1. You should provide your own project, not the example URL.
2. You can submit a form that includes a file upload.
3. The form file input field has the `name` attribute set to "upfile".
4. When you submit a file, you receive the file `name`, `type`, and `size` in bytes within the JSON response.

Once again, let's cover each of these.

### You should provide your own project, not the example URL.

Just like the last project, you need to provide a URL to a live example of your code running on the internet. You can't pass in their example application URL.

### You can submit a form that includes a file upload.

This one threw me for a loop when I did the challenge because I didn't understand what they meant. As it turns out, this test actually requires you to have an HTML file in your site! We can just edit the default Nginx HTML file to include the snipped they need.

### The form file input field has the `name` attribute set to "upfile".

The name of the file in the upload data will be "upfile". This matters on the backend because we need to know what form parameter to read.

### When you submit a file, you receive the file `name`, `type`, and `size` in bytes within the JSON response.

The JSON response should have fields `name`, `type`, and `size`. For a 1,234-byte JPEG named "vacation.jpg", the response should be:

```json
{
    "name": "vacation.jpg",
    "type": "image/jpeg",
    "size": 1234
}
```

This microservice is a lot simpler than the other two, but it's a big jump from using `app.Run()` to using Controllers to accept file uploads, so we have a lot of work to do before we can actually build this microservice. Let's get started!

## Note: Incomplete

This microservice is not yet complete. Due to time constraints, I'm writing my writeup of the microservice itself first, and then I'll come back and publish the ASP.NET Core educational articles later.