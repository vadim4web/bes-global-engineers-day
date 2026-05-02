import { buildForGhPages } from './ghPagesUtils.js'

async function main() {
  const { repoName, basePath } = await buildForGhPages()

  console.log(`Built GitHub Pages bundle for ${repoName}.`)
  console.log(`GitHub Pages base path: ${basePath}`)
}

main().catch((error) => {
  console.error('GitHub Pages build failed.')
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
