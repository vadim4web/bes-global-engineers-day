import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { build } from 'vite'

const execFileAsync = promisify(execFile)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const projectRoot = path.resolve(__dirname, '..')
export const distDir = path.join(projectRoot, 'dist')

function parseRepoName(remoteUrl) {
  if (!remoteUrl) {
    return null
  }

  const cleaned = remoteUrl.trim().replace(/\.git$/, '')
  const match = cleaned.match(/[:/]([^/]+\/[^/]+)$/)

  if (!match) {
    return null
  }

  const repoName = match[1].split('/')[1]
  return repoName || null
}

export async function detectRepoName() {
  if (process.env.GITHUB_PAGES_REPO) {
    return process.env.GITHUB_PAGES_REPO
  }

  try {
    const { stdout } = await execFileAsync('git', ['remote', 'get-url', 'origin'], {
      cwd: projectRoot
    })
    const repoName = parseRepoName(stdout)
    if (repoName) {
      return repoName
    }
  } catch {
    // Fall through to package metadata.
  }

  const packageJson = JSON.parse(
    await fs.readFile(path.join(projectRoot, 'package.json'), 'utf8')
  )

  return packageJson.name || path.basename(projectRoot)
}

export function computeBasePath(repoName) {
  if (!repoName || repoName.endsWith('.github.io')) {
    return '/'
  }

  return `/${repoName}/`
}

export async function buildForGhPages() {
  const repoName = await detectRepoName()
  const basePath = computeBasePath(repoName)

  await build({
    configFile: path.join(projectRoot, 'vite.config.js'),
    root: projectRoot,
    base: basePath
  })

  const indexHtml = await fs.readFile(path.join(distDir, 'index.html'), 'utf8')
  await fs.writeFile(path.join(distDir, '404.html'), indexHtml, 'utf8')
  await fs.writeFile(path.join(distDir, '.nojekyll'), '', 'utf8')

  return {
    repoName,
    basePath
  }
}
