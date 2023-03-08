import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

export default () => {
  const promptsDirectory = path.join(process.cwd(), 'app/prompts')
  const prompts = {}
  const files = fs.readdirSync(promptsDirectory)

  files.forEach((file) => {
    const name = file.replace(/\.md$/, '')
    const content = fs.readFileSync(path.join(promptsDirectory, file), 'utf8')
    prompts[name] = {}

    const lines = content.split('\n')
    let frontmatter = ''
    let markdown = ''
    let inFrontmatter = false
    lines.forEach((line) => {
      if (line.startsWith('---')) {
        inFrontmatter = !inFrontmatter
      } else if (inFrontmatter) {
        frontmatter += line + '\n'
      } else {
        markdown += line + '\n'
      }
    })

    const frontmatterObject = yaml.load(frontmatter)
    prompts[name] = frontmatterObject
    prompts[name].systemMessage = markdown
  })

  return prompts
}
