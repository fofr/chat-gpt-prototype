const svg = (container) => {
  const code = getCode(container)
  if (code && code.innerHTML.indexOf('svg') !== -1) {
    const svgContainer = document.createElement('div')
    svgContainer.classList.add('svg-container')
    svgContainer.innerHTML = decodeHtml(code.innerHTML)
    container.appendChild(svgContainer)
  }
}

const canvas = (container) => {
  let canvas = document.getElementById('canvas')
  if (!canvas) {
    const canvasContainer = document.createElement('div')
    canvasContainer.classList.add('canvas-container')
    canvasContainer.innerHTML = '<canvas id="canvas" width="400" height="400"></canvas>'
    container.appendChild(canvasContainer)
    canvas = document.getElementById('canvas')
  }

  const code = getCode(container)
  if (code) {
    // Dangerous
    eval(decodeHtml(code.innerHTML))
  }
}

const p5js = (container) => {
  canvas(container)
}

const abc = (container) => {
  const code = getCode(container)
  if (code) {
    const abcContainer = document.createElement('div')
    const id = `abc-container-${Math.random().toString(36).slice(2, 8)}`
    abcContainer.id = id
    abcContainer.classList.add('abc-container')
    container.appendChild(abcContainer)
    window.ABCJS.renderAbc(id, code.innerHTML)
  }
}

const getCode = (container) => {
  return container.querySelector('code')
}

const decodeHtml = (html) => {
  const tempElement = document.createElement('div')
  tempElement.innerHTML = html
  return tempElement.innerText
}

export default {
  svg,
  canvas,
  p5js,
  abc
}
