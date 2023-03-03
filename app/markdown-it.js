import MarkdownIt from 'markdown-it'

export default () => {
  return new MarkdownIt({
    breaks: true,
    html: true,
    linkify: true,
    typographer: true
  })
}
