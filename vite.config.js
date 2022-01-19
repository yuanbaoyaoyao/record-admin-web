import {
  defineConfig,
} from 'vite'
import vue from '@vitejs/plugin-vue'
import {
  resolve
} from 'path'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig(({
  command,
  mode
}) => {
  let NODE_ENV = process.env.NODE_ENV || 'development';
  let envFiles = [];
  if (command === 'serve') {
    envFiles = [
      `.env`
    ]
  } else {
    envFiles = [
      `.env`,
      `.env.${NODE_ENV}`
    ]
  }
  for (const file of envFiles) {
    const envConfig = dotenv.parse(fs.readFileSync(file))
    for (const i in envConfig) {
      process.env[i] = envConfig[i]
    }
  }
  return defineConfig({
    define: {
      'process.env': {}
    },
    plugins: [vue()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      }
    },
    server: {
      cors: true,
      base: process.env.VITE_BASE_URL,
      proxy: {
        "/testIp": {
          target: "http://localhost:8081",
          changeOrgin: true,
          rewrite: (path) => path.replace(/^\/testIp/, '')
        }
      }
    }
  })
})