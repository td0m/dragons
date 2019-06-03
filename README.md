# Go API with a Static Frontend on ZEIT Now

**Live Demo**: https://go.now-examples.now.sh/

This example shows a pre-setup project including:
- An `api` directory, containing a single endpoint that retrieves the current time with Golang.
- A `www` directory, containing static files such as `index.html` and `style.css` that show a frontend with information from the API.

## Get Started with This Project

To get started with this project yourself, you can use [Now CLI](https://zeit.co/download) to initialize it.

From your terminal, use the following command to create a directory called `my-go-project` including the files of this example:

```bash
now init go my-go-project
```

Then, `cd` into your new project's directory (with `cd my-go-project`).

You now have a project, ready to go into development, staging, or production with Now. Your next step is up to you. Try one of the following:

#### Local Development

Using Now CLI, as you did to initialize this project, you can use the following command from your terminal to start a development environment locally which replicates the production environment on Now so you can test your new project:

```bash
now dev
```

#### Automatic Deployments with Git

Using either [Now for GitHub](https://zeit.co/github) or [Now for GitLab](https://zeit.co/gitlab), you can push this project to a Git repository and it will deploy automatically.

If on anything other than the default branch, with each push your project will be deployed, automatically, to a unique staging URL.

If pushing or merging to the default branch, your project will be deployed and aliased in a production environment, automatically.

Read more about the ZEIT Now Git Integrations:
- [Now for GitHub](https://zeit.co/docs/v2/integrations/now-for-github/)
- [Now for GitLab](https://zeit.co/docs/v2/integrations/now-for-gitlab/)


#### Deploying from Your Terminal

Using [Now CLI](https://zeit.co/download), you can also deploy to both [staging](https://zeit.co/docs/v2/domains-and-aliases/aliasing-a-deployment#staging) and [production](https://zeit.co/docs/v2/domains-and-aliases/aliasing-a-deployment#production) environments from your terminal.

For a staging deployment, you can use the following one-word command:
```bash
now
```

Then, for production, including automatic aliasing, you can use the following:
```bash
now --target production
```

For more information on deploying, see the [Deployment Basics documentation](https://zeit.co/docs/v2/deployments/basics#introducing-a-build-step).

## Configuration Breakdown

This example contains a `now.json` file which instructs Now how to treat this project when developing locally and deploying. 

```json
{
  "version": 2,
  "name": "my-go-project",
  "builds": [
    { "src": "www/**/*", "use": "@now/static" },
    { "src": "api/**/*.go", "use": "@now/go" }
  ],
  "routes": [
    { "src": "/", "dest": "www/index.html" }
  ]
}
```

The above instructs Now with:

- The [`version` property](https://zeit.co/docs/v2/deployments/configuration#version), specifying the latest Now 2.0 Platform version.
- The [`name` property](https://zeit.co/docs/v2/deployments/configuration#name), setting the name for the deployment.
- The [`builds` property](https://zeit.co/docs/v2/deployments/configuration#builds), allowing Now to use [the @now/go Builder](https://zeit.co/docs/v2/deployments/official-builders/go-now-go) with a specific source target.
- The [`routes` property](https://zeit.co/docs/v2/deployments/configuration#routes), instructing Now to route the user to the `www/index.html` file when requesting the root path.

For more information on configuring Now, see the [Configuration documentation](https://zeit.co/docs/v2/deployments/configuration).

## Resources

Learn more about the ZEIT Now platform from [our documentation](https://zeit.co/docs), including:
- [More information on deploying Go projects](https://zeit.co/docs/v2/deployments/official-builders/go-now-go) and some technical details.
- [More information on the platform itself](https://zeit.co/docs), including [domains and aliasing](https://zeit.co/docs/v2/domains-and-aliases/introduction/) and [local development](https://zeit.co/docs/v2/development/basics/).
