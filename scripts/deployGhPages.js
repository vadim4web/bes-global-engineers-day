import ghpages from 'gh-pages'
import { promisify } from 'node:util'
import { buildForGhPages, distDir } from './ghPagesUtils.js'

const publishAsync = promisify(ghpages.publish.bind(ghpages))

async function main() {
  const { repoName, basePath } = await buildForGhPages()

  await publishAsync(distDir, {
    dotfiles: true,
    message: `Deploy ${repoName} at ${new Date().toISOString()}`
  })

  console.log(`Published dist to gh-pages for ${repoName}.`)
  console.log(`GitHub Pages base path: ${basePath}`)
}

main().catch((error) => {
  console.error('GitHub Pages deploy failed.')
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
