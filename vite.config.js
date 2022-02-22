import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import MockServerPlugin from './mock-server'

export default defineConfig({
	plugins: [
		vue(),
		MockServerPlugin()
	]
})
