# Progress Capture
Progress Capture is a web app built on ASP.NET. It provides a simple way of tracking progress towards goals with a clear criteria for completion.

![Screenshot of Progress Capture weekly calendar view](/docs/images/progress_capture_demo_screenshot.png)

## Build
Progress Capture uses .Net 9. Build the app with `dotnet build`.

Front end components make use of [webpack](https://webpack.js.org/) for compiling. Build the front end assets with `npx webpack build`

## Goals
Goals are the entity used to define what you're tracking an how to measure. When defining a goal, you also define the types of progress that make up those goals and their units of measure. For example, a therapist working toward licensure might track clinical hours whereas someone training for a marathon would track miles run in training.

## Progress
Progress is entered either via a simple list view or through a monthly/weekly calendar view.
