This project is a little more involved than the last one, but it's still pretty simple on the ASP.NET Core front.

This microservice involves reading the URL string and making decisions based on what you find in it. As before, the result of your microservice should return JSON - and we will be using the same technique as we did in the last course to generate that JSON.

## Project setup

To get ready to code this time, I generated a starter project for you with all the basic work done already - no more tedious line-by-line deleting and pruning. You can find this project [on GitHub](https://github.com/christianlevesque/fcc-timestamp-microservice/tree/v0.1.0), or you can clone it directly from your command line.

### Git via SSH

If you use SSH for your Git operations, run:

```bash
git clone -b v0.1.0 --single-branch git@github.com:/christianlevesque/fcc-timestamp-microservice.git
cd fcc-timestamp-microservice # or wherever you cloned the repo to
git switch -c master
```

If you clone my repository, don't forget to change your remote repository! Set up your own GitHub repository, then run:

```bash
git remote set-url origin git@github.com:/your_git_username/your_repo_name.git
```

### Git via HTTPS

If you use HTTPS for your Git operations, run:

```bash
git clone -b v0.1.0 --single-branch https://github.com/christianlevesque/fcc-timestamp-microservice.git
cd fcc-timestamp-microservice # or wherever you cloned the repo to
git switch -c master
```

If you clone my repository, don't forget to change your remote repository! Set up your own GitHub repository, then run:

```bash
git remote set-url origin https://github.com/your_git_username/your_repo_name.git
```

## Project requirements

The Timestamp Microservice will be hosted at `/api/timestamp`. We will use Nginx to route requests to the microservice the same way we did for the Request Header Parser Microservice.

Additionally, the microservice must meet these seven requirements:

1. You should provide your own project, not the example URL.
2. A request to `/api/timestamp` should return the current time as a UNIX timestamp in a JSON object on the `unix` key
3. A request to `/api/timestamp` should return the current time as a UTC date string in a JSON object on the `utc` key
4. A request to `/api/timestamp/{date}` with a valid date should return that date as a UNIX timestamp in a JSON object on the `unix` key
5. A request to `/api/timestamp/{date}` with a valid date should return that date as a UTC date string in a JSON object on the `utc` key
6. Your project can handle dates that can be successfully parsed by `new Date(date_string)` in JavaScript
7. If the input date is invalid, the API returns an object having the structure `{"error": "Invalid Date"}`

Note: A UNIX timestamp is the number of seconds since the UNIX epoch, which is midnight on `1 Jan 1970`. However, FreeCodeCamp wants the number of *milli*seconds since the UNIX epoch, so we will have to be aware of that when we write our microservice.

Also note: The UTC date string is expected to be in the format: `Thu, 01 Jan 1970 00:00:00 GMT`.

As before, let's go over these requirements one at a time.

### You should provide your own project, not the example URL.

Just like the last project, you need to provide a URL to a live example of your code running on the internet. You can't pass in their example application URL.

### A request to `/api/timestamp` should return the current time as a UNIX timestamp in a JSON object on the `unix` key

If the user doesn't supply a date to convert to a timestamp, you should assume the current time. The current time should be included in the JSON response in a numeric field called `unix`. If the request was made on midnight on Christmas Day, 2015, their response would be:

```json
{
    "unix": 1451001600000
}
```

### A request to `/api/timestamp` should return the current time as a UTC date string in a JSON object on the `utc` key

If the user doesn't supply a date to convert to a timestamp, include the current time in the JSON response in a text field called `utc`. If the request was made on midnight on Christmas Day, 2015, their response would further be:

```json
{
	"unix": 1451001600000,
    "utc": "Fri, 25 Dec 2015 00:00:00 GMT"
}
```

### A request to `/api/timestamp/{date}` with a valid date should return that date as a UNIX timestamp in a JSON object on the `unix` key

The user can optionally supply a date in the URL string. If they do, you should use the supplied date instead of the current time in your timestamp response. The response schema is the same as if you were using the current time.

### A request to `/api/timestamp/{date}` with a valid date should return a JSON object on the `utc` key that is a string of the input date in the format: `Thu, 01 Jan 1970 00:00:00 GMT`

Just like with the `unix` key, if the user supplies a date in the URL string, use that to generate the `utc` key instead of the current time. The schema and format are the same.

### Your project can handle dates that can be successfully parsed by `new Date(date_string)` in JavaScript

Remember how I said that FreeCodeCamp curriculum is mainly JavaScript-based? This is one of the side effects of that. Fortunately, the [JavaScript Date constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date) accepts either a `Number` representing the milliseconds since the UNIX epoch, or a standard UTC date string. .NET Core can parse these date formats without issue

### If the input date is invalid, the API returns an object having the structure `{"error": "Invalid Date"}`

In our last application, we returned an HTML string, `<h1>Bad request</h1>`, if the request didn't meet all the requirements. However, that wasn't a requirement of the first microservice - that was just something we added for our own usage. In this application, a JSON response is expected with an error message if there's a problem.

## A little more work

This microservice is going to be a little more complicated than the last one. As you can see from the project requirements, there are actually two endpoints our app has to respond to: `/api/timestamp` and `/api/timestamp/{date}`. We're going to use this opportunity to learn about middleware in ASP.NET Core.