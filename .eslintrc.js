module.exports = {
	env: {
		browser: true,
		es2021: true,
		'vue/setup-compiler-macros': true
	},
	extends: [
		'standard',
		'plugin:vue/vue3-recommended'
	],
	rules: {
		indent: [2, 'tab', { SwitchCase: 1 }],
		'vue/html-indent': [2, 'tab'],
		'no-tabs': 0,
		'comma-dangle': 0,
		'no-console': 'off'
	}
}
