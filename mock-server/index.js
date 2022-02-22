import express from 'express'
import { v4 as uuid } from 'uuid'
import projects from './projects.js'
import { computeDependencies } from './dependencies.js'

function pick (keys, obj) {
	const result = {}
	for (const key of keys) {
		result[key] = obj[key]
	}
	return result
}

function serializeProject (project) {
	return {
		id: project.id,
		name: project.name,
		stories: project.stories.map(pick.bind(null, ['id', 'name', 'statements'])),
		statements: project.statements.map(pick.bind(null, ['id', 'name'])),
		nodes: project.nodes.map(pick.bind(null, ['id', 'type', 'name']))
	}
}

export default function () {
	const app = express()

	app.use(express.json())

	app.get('/projects/', (req, res) => {
		res.json(projects.map(pick.bind(null, ['id', 'name'])))
	})

	app.get('/projects/:id', (req, res) => {
		const project = projects.find(p => p.id === req.params.id)
		if (!project) {
			res.status(404).send('Project not found')
			return
		}
		res.json(serializeProject(project))
	})

	app.get('/projects/:id/dependencies', (req, res) => {
		const project = projects.find(p => p.id === req.params.id)
		if (!project) {
			res.status(404).send('Project not found')
			return
		}
		res.json(computeDependencies(project))
	})

	// split project into multiple projects with stories
	app.post('/projects/:id/split', (req, res) => {
		const project = projects.find(p => p.id === req.params.id)
		if (!project) {
			res.status(404).send('Project not found')
			return
		}
		const dependencies = computeDependencies(project)
		const newProjects = []
		for (const newProjectData of req.body) {
			const stories = Array.from(new Set(newProjectData.stories)).map(storyId => project.stories.find(s => s.id === storyId)).filter(s => s)
			const statementIds = new Set()
			const nodeIds = new Set()
			for (const story of stories) {
				story.statements.forEach(statementId => statementIds.add(statementId))
				dependencies.stories[story.id].forEach(nodeId => nodeIds.add(nodeId))
			}
			Object.values(dependencies.always).forEach(nodeId => nodeIds.add(nodeId))
			newProjects.push(serializeProject({
				id: uuid(),
				name: newProjectData.name,
				stories: stories,
				statements: Array.from(statementIds).map(id => project.statements.find(s => s.id === id)).filter(s => s),
				nodes: Array.from(nodeIds).map(id => project.nodes.find(n => n.id === id)).filter(n => n)
			}))
		}
		projects.push(...newProjects)
		res.json(newProjects)
	})

	return {
		name: 'mock-server',
		apply: 'serve',
		configureServer: (server) => {
			server.middlewares.use('/api', (req, res) => {
				app(req, res)
			})
		}
	}
}
