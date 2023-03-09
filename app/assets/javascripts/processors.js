const svg = (container) => {
  const code = container.querySelector('code')
  if (code && code.innerHTML.indexOf('svg') !== -1) {
    const svgContainer = document.createElement('div')
    svgContainer.classList.add('svg-container')
    svgContainer.innerHTML = decodeHtml(code.innerHTML)
    container.appendChild(svgContainer)
  }
}

const decodeHtml = (html) => {
  const tempElement = document.createElement('div')
  tempElement.innerHTML = html
  return tempElement.innerText
}

export default {
  svg
}
