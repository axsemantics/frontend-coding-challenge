export function computeDependencies (project) {
	const dependencies = {
		stories: {},
		always: {
			errorNodes: project.nodes.filter(node => node.type === 'error').map(node => node.id),
			commentNodes: project.nodes.filter(node => node.type === 'comment').map(node => node.id)
		},
		unused: new Set(project.nodes.filter(node => !['error', 'comment'].includes(node.type)).map(node => node.id))
	}

	const statementsMap = new Map(project.statements.map(statement => [statement.id, statement]))
	const nodesMap = new Map(project.nodes.map(node => [node.id, node]))

	for (const story of project.stories) {
		const storyDependencies = new Set()

		function traverseNode (nodeId) {
			const node = nodesMap.get(nodeId)
			dependencies.unused.delete(nodeId)
			storyDependencies.add(nodeId)
			node.nodes?.forEach(traverseNode)
		}

		for (const statementId of story.statements) {
			const statement = statementsMap.get(statementId)
			statement.nodes?.forEach(traverseNode)
		}

		dependencies.stories[story.id] = Array.from(storyDependencies)
	}

	dependencies.unused = Array.from(dependencies.unused)
	return dependencies
}
