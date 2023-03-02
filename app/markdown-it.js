import MarkdownIt from 'markdown-it'

export default () => {
  const opts = {
    breaks: true,
    html: true,
    linkify: true,
    typographer: true,
    quotes: '“”‘’'
  }

  const md = new MarkdownIt(opts)
  return md
}
