const svg = (container) => {
  const code = getCode(container)
  if (code && code.innerHTML.indexOf('svg') !== -1) {
    const svgContainer = document.createElement('div')
    svgContainer.classList.add('svg-container')
    svgContainer.innerHTML = decodeHtml(code.innerHTML)
    container.appendChild(svgContainer)
  }
}

const canvas = (container, isWebGL = false) => {
  let canvas = document.getElementById('canvas')
  if (!canvas) {
    const canvasContainer = document.createElement('div')
    canvasContainer.classList.add('canvas-container')
    canvasContainer.innerHTML = '<canvas id="canvas" width="400" height="400"></canvas>'
    container.appendChild(canvasContainer)
    canvas = document.getElementById('canvas')

    if (isWebGL) {
      canvas = canvas.getContext('webgl')
    }
  }

  const code = getCode(container)
  if (code) {
    // Dangerous
    eval(decodeHtml(code.innerHTML))
  }
}

const webgl = (container) => {
  canvas(container, true)
}

const p5js = (container) => {
  // if not already loaded, load p5.js
  if (!window.p5) {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.js'
    document.body.appendChild(script)
  }

  canvas(container, true)
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
  webgl,
  p5js,
  abc
}
