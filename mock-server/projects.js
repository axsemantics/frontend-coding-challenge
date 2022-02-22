import { v4 as uuid } from 'uuid'

function repeat (fn, count) {
	if (count <= 0) return
	fn()
	repeat(fn, --count)
}

function randomRange (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function sample (array) {
	return array[randomRange(0, array.length - 1)]
}

function samples (array, count) {
	if (array.length === 0) return []
	const result = new Set()
	repeat(() => result.add(sample(array)), count)
	return Array.from(result)
}

let _currentProject
let _currentStory
let _currentStatement
let _currentNode

let _lastStoryId = 0
let _lastStatementId = 0
let _lastNodeId = 0

const projects = []

function createProject (name) {
	_currentProject = {
		id: uuid(),
		name,
		stories: [],
		statements: [],
		nodes: []
	}
	_lastStoryId = 0
	_lastStatementId = 0
	_lastNodeId = 0
	projects.push(_currentProject)
}

function createStory (name) {
	const id = ++_lastStoryId
	if (!name) name = `Story ${id}`
	_currentStory = {
		id,
		name,
		statements: []
	}
	_currentProject.stories.push(_currentStory)
	return Object.assign({}, _currentStory, {
		addStatement (name) {
			const statement = createStatement(name)
			this.statements.push(statement.id)
			return statement
		},
		use (statement) {
			if (!statement) return
			if (statement instanceof Array) {
				statement.forEach(s => this.use(s))
				return this
			}
			if (this.statements.includes(statement.id)) return
			this.statements.push(statement.id)
			return this
		}
	})
}

function createStatement (name) {
	const id = ++_lastStatementId
	if (!name) name = `Statement ${id}`
	_currentStatement = {
		id,
		name,
		nodes: []
	}
	_currentProject.statements.push(_currentStatement)
	return Object.assign({}, _currentStatement, {
		addNode (type) {
			if (!type) type = 'variable'
			const node = createNode(type)
			this.nodes.push(node.id)
			return node
		},
		use (node) {
			if (!node) return
			if (node instanceof Array) {
				node.forEach(n => this.use(n))
				return this
			}
			if (this.nodes.includes(node.id)) return
			this.nodes.push(node.id)
			return this
		}
	})
}

function createNode (type) {
	const id = ++_lastNodeId
	if (!type) type = 'comment'
	_currentNode = {
		id,
		name: `${type} ${id}`,
		type,
		nodes: []
	}
	_currentProject.nodes.push(_currentNode)
	return Object.assign({}, _currentNode, {
		addNode (type) {
			if (!type) type = 'mapping'
			const node = createNode(type)
			this.nodes.push(node.id)
			return node
		},
		useIn (node) {
			if (!node) return
			if (node instanceof Array) {
				node.forEach(n => this.useIn(n))
				return this
			}
			if (node.nodes.includes(this.id)) return
			node.nodes.push(this.id)
			return this
		},
		use (node) {
			if (!node) return
			if (node instanceof Array) {
				node.forEach(n => this.use(n))
				return this
			}
			if (this.nodes.includes(node.id)) return
			this.nodes.push(node.id)
			return this
		}
	})
}

let story
let dataNodes

createProject('Empty Project')

createProject('Simple Project')
story = createStory()
repeat(() => {
	story.addStatement()
		.addNode()
		.addNode()
		.addNode('data')
}, 15)

createProject('Distinct Stories')
repeat(() => {
	story = createStory()
	repeat(() => {
		story.addStatement()
			.addNode()
			.addNode()
			.addNode('data')
	}, 10)
}, 10)

createProject('Always + Unused Nodes')
repeat(() => {
	story = createStory()
	repeat(() => {
		story.addStatement()
			.addNode()
			.addNode()
			.addNode('data')
			.useIn(createNode('mapping'))
			.useIn(createNode('error'))
	}, randomRange(9, 14))
}, 2)
repeat(() => {
	createNode('comment')
}, randomRange(2, 6))

createProject('Common Nodes')
const commonNodes = []
repeat(() => {
	const node = createNode('variable')
	node.addNode()
		.addNode('data')
	commonNodes.push(node)
}, randomRange(9, 14))
repeat(() => {
	story = createStory()
	repeat(() => {
		story.addStatement()
			.use(commonNodes)
			.addNode()
			.addNode()
			.addNode('data')
	}, randomRange(9, 14))
}, 4)

createProject('Grouped stories by nodes')
repeat(() => {
	const commonNodes = []
	repeat(() => {
		const node = createNode('variable')
		node.addNode()
			.addNode('data')
		commonNodes.push(node)
	}, randomRange(3, 5))
	repeat(() => {
		story = createStory()
		repeat(() => {
			story.addStatement()
				.use(commonNodes)
				.addNode()
				.addNode()
				.addNode('data')
		}, randomRange(30, 50))
	}, randomRange(1, 4))
}, 3)

createProject('Grouped stories by statements')
repeat(() => {
	const commonStatements = []
	repeat(() => {
		const statement = createStatement()
		statement.addNode()
			.addNode()
			.addNode('data')
		commonStatements.push(statement)
	}, randomRange(3, 5))
	repeat(() => {
		story = createStory()
		story.use(commonStatements)
		repeat(() => {
			story.addStatement()
				.addNode()
				.addNode()
				.addNode('data')
		}, randomRange(30, 50))
	}, randomRange(1, 4))
}, 3)

createProject('Spagetti')
dataNodes = []
repeat(() => {
	dataNodes.push(createNode('data'))
}, randomRange(70, 100))
const mappingNodes = []
repeat(() => {
	mappingNodes.push(
		createNode('mapping')
			.use(samples(dataNodes, randomRange(3, 6)))
	)
}, randomRange(60, 80))
const variables = []
repeat(() => {
	variables.push(
		createNode('variable')
			.use(samples(mappingNodes, randomRange(3, 6)))
	)
}, randomRange(30, 50))
repeat(() => {
	story = createStory()
	repeat(() => {
		story.addStatement()
			.use(samples(variables, randomRange(5, 10)))
	}, randomRange(9, 14))
}, 6)

createProject('Big Project')
dataNodes = []
repeat(() => {
	dataNodes.push(createNode('data'))
}, randomRange(40, 60))
repeat(() => {
	createNode('error').use(samples(dataNodes, randomRange(3, 6)))
}, randomRange(20, 40))
repeat(() => {
	createNode('comment')
}, randomRange(30, 60))

;(() => {
	const commonNodes = []
	repeat(() => {
		const node = createNode('variable')
		node.addNode()
			.addNode('data')
		commonNodes.push(node)
	}, randomRange(10, 15))
	const commonStatements = []
	repeat(() => {
		const statement = createStatement()
		statement.addNode()
			.addNode()
			.addNode('data')
		commonStatements.push(statement)
	}, randomRange(3, 5))
	repeat(() => {
		const clusterNodes = []
		repeat(() => {
			const node = createNode('variable')
			node.addNode()
				.addNode('data')
			clusterNodes.push(node)
		}, randomRange(10, 15))
		const clusterStatements = []
		repeat(() => {
			const statement = createStatement()
			statement.addNode()
				.addNode()
				.addNode('data')
			clusterStatements.push(statement)
		}, randomRange(3, 5))
		repeat(() => {
			story = createStory()
			repeat(() => {
				story.use(samples(commonStatements, randomRange(0, 2)))
				story.use(samples(clusterStatements, randomRange(1, 3)))
				story.addStatement()
					.use(samples(commonNodes, randomRange(0, 1)))
					.use(samples(clusterNodes, randomRange(2, 5)))
					.addNode()
					.addNode()
					.addNode('data')
			}, randomRange(30, 50))
		}, randomRange(9, 15))
	}, randomRange(5, 10))
})()

export default projects
