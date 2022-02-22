![ax semantics logo](https://raw.githubusercontent.com/axsemantics/hiring/main/website/public/logo.svg)

# AX Semantics Frontend Coding Challenge

This coding challenge is part of our [hiring process](https://hiring.ax-semantics.com/process.html). If you found this repository by chance, why not head over to https://hiring.ax-semantics.com/ and apply for a job in our product team?

We want to learn how you approach problems, how you handle incomplete information, how you design UIs and of course, about your coding skills.

You will be invited to a slack channel where we will answer any questions you'll have.

Please don't work any longer than 4 hours in total on this challenge, there is no requirement to finish everything you set out to do.
In the technical interview that follows we will go through your solution together and talk about the direction you would take the code if it were a bigger project.

To approximate how you'll work at AX Semantics, we won't give you a complete specification to implement, but a problem description. We've chosen a real problem that's already solved in our product and removed some complexity not relevant for this challenge – giving you an idea of a problem you'll realistically encounter at AX Semantics. This repository contains a simplified REST API you run locally and build your code against. It contains example data covering some interesting use cases relevant for this challenge.

The goal of this challenge is to build a UI and write code to solve the following problem:


# Problem Description

Most functionality in the AX Semantics platform is structured inside "projects", which customers use to organize their different use cases. For our coding challenge, projects only contain three structures: stories, statements and nodes. These are created by our users to tell our text engine what text should be generated for data they provide. For this coding challenge we're not concerned with how text is actually defined and produced, only that structures reference each other.

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

(Your list and details views don't need to look anything like the AX Semantics platform.)

## Splitting projects

The amount of stories, statements, and nodes can grow quite large inside a project, which is why users need to sometimes **split** existing projects into multiple new ones. Of course, copy-pasting lots of things from one project into another is quite boring and prone to errors, so we decided to help our users by adding a feature which splits projects along defined **stories**.

Create a UI for users to:

- Start a "split project" operation from inside a project.
- Add and name any number of new projects to split to.
- Assign one or multiple stories to new projects.
- Execute the split with an API call.

## Creative Challenge: Informed decision making

Right now, a user wanting to split a project needs to already know which stories to split into what projects.
However, many users do not know their projects by heart and need our help with making an informed decision.
Users might have the following (and more) questions:

- Which stories are strongly connected and should stay together, based on their dependend nodes?
- How many nodes will be duplicated?

Try to find and build ways to show users how to best split their projects. The server provides you with an API to fetch information on which stories depend on which nodes.

## API

We're providing you with a mock API that's running locally and does not need any authentication. The only header you might need to set is `Content-Type: application/json` for POST requests.

The API has the following endpoints:

### GET `/api/projects/`

List projects.

Returns:
```
[{
	id: String,
	name: String
}]
```

<details>
<summary>Example request & response</summary>

```json
GET /api/projects/


200 OK
[
	{
		"id": "0d944c60-f8dc-4b9c-b89e-fbdbbc58e2f3",
		"name": "Empty Project"
	},
	{
		"id": "7cbe6b8d-187f-41b4-900a-04efa8194751",
		"name": "Simple Project"
	},
	{
		"id": "73349aaa-490d-4959-a9f1-5ea6a0a3d380",
		"name": "Distinct Stories"
	},
	{
		"id": "1b9ab29a-5742-4cfc-80ca-2d286b60b4cf",
		"name": "Always + Unused Nodes"
	},
	{
		"id": "da1d45ff-94dd-43e6-aca0-f054c220bed1",
		"name": "Common Nodes"
	},
	{
		"id": "4a2d2081-74d8-4c0a-a25b-98a098cd5962",
		"name": "Grouped stories by nodes"
	},
	{
		"id": "558b4bed-53dc-4940-8ce1-3112273af5e9",
		"name": "Grouped stories by statements"
	},
	{
		"id": "b987975e-61e1-4a41-8f78-66b6f5947b38",
		"name": "Spagetti"
	},
	{
		"id": "152cfeb1-1df1-4810-9d56-71155c53413e",
		"name": "Big Project"
	}
]
```
</details>



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

<details>
<summary>Example request & response</summary>

```json
GET /api/projects/7cbe6b8d-187f-41b4-900a-04efa8194751


200 OK
{
	"id": "7cbe6b8d-187f-41b4-900a-04efa8194751",
	"name": "Simple Project",
	"stories": [
		{
			"id": 1,
			"name": "Story 1",
			"statements": [1, 2, 3]
		}
	],
	"statements": [
		{
			"id": 1,
			"name": "Statement 1"
		},
		{
			"id": 2,
			"name": "Statement 2"
		},
		{
			"id": 3,
			"name": "Statement 3"
		}
	],
	"nodes": [
		{
			"id": 1,
			"type": "variable",
			"name": "variable 1"
		},
		{
			"id": 2,
			"type": "mapping",
			"name": "mapping 2"
		},
		{
			"id": 3,
			"type": "data",
			"name": "data 3"
		},
		{
			"id": 4,
			"type": "variable",
			"name": "variable 4"
		},
		{
			"id": 5,
			"type": "mapping",
			"name": "mapping 5"
		}
	]
}
```
</details>

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

<details>
<summary>Example request & response</summary>

```json
GET /api/projects/73349aaa-490d-4959-a9f1-5ea6a0a3d380/dependencies


200 OK
{
	"stories": {
		"1": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
		"2": [31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60],
		"3": [61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90],
		"4": [91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120],
		"5": [121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150],
		"6": [151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180],
		"7": [181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210],
		"8": [211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240],
		"9": [241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270],
		"10": [271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300]
	},
	"always": {
		"errorNodes": [],
		"commentNodes": []
	},
	"unused": []
}
```
</details>

### POST `/api/projects/:id/split`

Splits the project with `:id` alongside specified new projects and story ids.

Request body as json:
```
[{name: String, stories: [Number]}]
```

Returns an array of newly created projects just like from `/api/projects/:id`. 

<details>
<summary>Example request & response</summary>

```json
POST /api/projects/73349aaa-490d-4959-a9f1-5ea6a0a3d380/split
[
	{
		"name": "new project 1",
		"stories": [1,2,3]
	},
	{
		"name": "new project 2",
		"stories": [4,5,6]
	},
	{
		"name": "new project 3",
		"stories": [7,8,9]
	}
]


200 OK
[
	{
		"id": "14b5aeaa-e13a-4f47-939c-5bed180fd6fb",
		"name": "new project 1",
		"stories": [
			{
				"id": 1,
				"name": "Story 1",
				"statements": [1,2,3,4,5,6,7,8,9,10]
			},
			{
				"id": 2,
				"name": "Story 2",
				"statements": [11,12,13,14,15,16,17,18,19,20]
			},
			{
				"id": 3,
				"name": "Story 3",
				"statements": [21,22,23,24,25,26,27,28,29,30]
			}
		],
		"statements": [
			{
				"id": 1,
				"name": "Statement 1"
			},
			{
				"id": 2,
				"name": "Statement 2"
			},
			…
		],
		"nodes": [
			{
				"id": 1,
				"type": "variable",
				"name": "variable 1"
			},
			{
				"id": 2,
				"type": "mapping",
				"name": "mapping 2"
			},
			…
		]
	},
	{
		"id": "504ae88e-c1a8-47d8-8183-ad2aac0b7f44",
		"name": "new project 2",
		"stories": [
			{
				"id": 4,
				"name": "Story 4",
				"statements": [31,32,33,34,35,36,37,38,39,40	]
			},
			{
				"id": 5,
				"name": "Story 5",
				"statements": [41,42,43,44,45,46,47,48,49,50]
			},
			{
				"id": 6,
				"name": "Story 6",
				"statements": [51,52,53,54,55,56,57,58,59,60]
			}
		],
		"statements": [
			{
				"id": 31,
				"name": "Statement 31"
			},
			{
				"id": 32,
				"name": "Statement 32"
			},
			…
		],
		"nodes": [
			{
				"id": 91,
				"type": "variable",
				"name": "variable 91"
			},
			{
				"id": 92,
				"type": "mapping",
				"name": "mapping 92"
			},
			…
		]
	},
	{
		"id": "36627149-f835-456f-a0fc-053c6c0c0e41",
		"name": "new project 3",
		"stories": [
			{
				"id": 7,
				"name": "Story 7",
				"statements": [61,62,63,64,65,66,67,68,69,70]
			},
			{
				"id": 8,
				"name": "Story 8",
				"statements": [71,72,73,74,75,76,77,78,79,80]
			},
			{
				"id": 9,
				"name": "Story 9",
				"statements": [81,82,83,84,85,86,87,88,89,90]
			}
		],
		"statements": [
			{
				"id": 61,
				"name": "Statement 61"
			},
			{
				"id": 62,
				"name": "Statement 62"
			},
			…
		],
		"nodes": [
			{
				"id": 181,
				"type": "variable",
				"name": "variable 181"
			},
			{
				"id": 182,
				"type": "mapping",
				"name": "mapping 182"
			}
			…
		]
	}
]
```
</details>

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

# Copyright

The code you write and designs you create for this challenge are yours and we will not use them anywhere beyond evaluating them for the purposes of your technical interview. 
