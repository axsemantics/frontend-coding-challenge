![ax semantics logo](https://raw.githubusercontent.com/axsemantics/hiring/main/website/public/logo.svg)

# AX Semantics Frontend Coding Challenge

This coding challenge is part of our [hiring process](https://hiring.ax-semantics.com/process.html). If you found this repository by chance, why not head over to https://hiring.ax-semantics.com/ and apply for a job in our product team?

We want to learn how you approach problems, how you handle incomplete information, how you design UIs and of course, about your coding skills.

You will be invited to a slack channel where we will answer any questions you'll have.

Please don't work any longer than 4 hours in total on this challenge, there is no requirement to finish everything you set out to do.
In the technical interview that follows we will go through your solution together and talk about the direction you would take the code if it were a bigger project.

To approximate how you'll work at AX Semantics, we won't give you a complete specification to implement, but a problem description. We've chosen a real problem that's already solved in our product and removed some complexity not relevant for this challenge to give you an approximation of a problem you'll realistically encounter at AX Semantics.

The goal of this challenge is to build a UI and write code to solve the following problem:


# Problem Description

Most functionality in the AX Semantics platform is structured inside "projects", which customers use to organize their different use cases. For our coding challenge, projects only contain the structures stories, statements and nodes. These are created by our users to tell our text engine what text should be generated for data they provide. For this coding challenge we're not concerned with how text is actually defined and produced, only that structures reference each other.

### Stories

A **story** has a name and references multiple **statements**.
Each generated text is based on exactly one story, with each referenced **statement** adding to the final text in the order they are referenced.

### Statements

A **statement** has a name, belongs to one or multiple **stories** and references multiple **nodes**.
In our actual platform, **statements** define how data from **nodes** is combined into a linear text.

### Nodes

A **node** has a name and can reference other **nodes**.
**Nodes** are referenced by **statements** or other **nodes**.
A **node** can import data or transform it and provides users with functions to clean up their data before inserting it into their text via **statements**. We're not showing this functionality in the coding challenge.

## Warm-up: project list

Use the provided API to show a list of projects linking to a project details view showing at least:

- the name of the project.
- the number of stories, statements and nodes of the project.

(Your list and details view doesn't need to look anything like the AX Semantics platform.)

## Split Project UI

The amount of stories, statements, and nodes can grow quite large inside a project, which is why users need to sometimes **split** existing projects into multiple new ones. Of course, copy-pasting lots of things from one project into another is quite boring and prone to errors, so we decided to help our users by adding a feature which splits projects along specific **stories**.

To help users decide how and where to split exactly, we want to show them clusters of stories, statements and nodes. The actual computation of dependencies and the split operation itself is done by the API (see the API docs for details).

Create a UI for users to:

- Start a "split project" operation from inside a project.
- Add and name any number of new projects to split to.
- Assign one or multiple stories to new projects.
- Find strongly connected stories to group them together.
- Get a preview of how many nodes will be duplicated.


## API

We're providing you with a mock API that's running locally, which looks like this:

### GET `/api/projects/`

List projects.

Returns:
```
[{
	id: String,
	name: String
}]
```

### GET `/api/projects/:id`

Get the project with `:id`.

Returns:
```
{
	id: String,
	name: String,
	stories: [{
		id: Number,
		name: String,
		statements: [Number]
	}],
	statements: [{
		id: Number,
		name: String,
	}],
	nodes: [{
		id: Number,
		name: String,
		type: String
	}]
}
```

### GET `/api/projects/:id/dependencies`

Get node dependencies per story inside a project, as lists of node ids.

Returns:
```
{
	stories: {[story_id]: [Number]},
	always: {
		errorNodes: [Number]
		commentNodes: [Number]
	},
	unused: [Number]
}
```

### POST `/api/projects/:id/split`

Splits the project with `:id` alongside specified new projects and story ids.

Request body:
```
[{name: String, stories: [Number]}]
```

Returns an array of newly created projects just like from `/api/projects/:id`. 

> The mock server does not persist any data, so any created,deleted, or changed datasets will be lost when you restart the dev server. Some server output is also randomly generated and will change every time you restart.


# Coding Guidelines

You can use any technology or dependencies you want to solve the problem, but we prefer Vue and have already setup a skeleton for you. Choose any preprocessors, component/css frameworks, and other tools that feel most familiar to you.

We prepared a build chain (vite) for you, which exposes the mock API in one simple cli call. If you change the build chain, please document any commands needed to start the project.

We already installed a linter for javascript. Your final code should not contain any linter errors, but feel free to change any of the rules.

The code and resulting UI should of course compile and run.

Apply any industry best practices you feel are fitting. Try to structure your code for a project that is actually larger and more long-term. We want to learn how you ensure maintainability.


# Setup

1. Fork this repository
2. Run `npm ci` to install dependencies
3. Run `npm start` to start the dev server and the mock API
4. Run `npm run lint` to lint your code
