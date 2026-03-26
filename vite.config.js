import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    try {
      if (entry.isDirectory()) {
        copyRecursive(srcPath, destPath)
      } else {
        fs.copyFileSync(srcPath, destPath)
      }
    } catch (_) {}
  }
}

export default defineConfig({
  plugins: [
    {
      name: 'safe-public-copy',
      closeBundle() {
        copyRecursive(path.join(__dirname, 'public'), path.join(__dirname, 'dist'))
      }
    }
  ],
  build: {
    copyPublicDir: false,
  },
})
