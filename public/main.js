import linePointsToSVGPath from "./linePointsToSVGPath.js"

const LINE_PLOT_INTERVAL = 50

// --- STATE ---

let state
let canvasXY = [null, null]
let linePoints = []
const blockSpan = document.querySelector('.studio > .block > span')
const progressSpan = document.querySelector('.progress')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const svg = document.querySelector('svg')
const submitBtn = document.querySelector('.submit-btn')
const charCodeInput = document.querySelector('.char-code-converter')
const charCodeBtn = document.querySelector('.char-code-btn')
const showSvgBtn = document.querySelector('.show-svg-btn')
const delSvgBtn = document.querySelector('.del-svg-btn')
const showSvgDiv = document.querySelector('.show-svg')

let linePlotterInteval; // interval


// --- EXECUTION ---

main()

canvas.addEventListener('mousedown', handleCanvasMousedown)
document.addEventListener('mouseup', handleCanvasMouseup)
document.querySelector('.clr-btn').addEventListener('click', () => {
    clearCanvas()
    clearSVG()
})
submitBtn.addEventListener('click', submitBlock)
charCodeBtn.addEventListener('click', () => {
    alert(charCodeInput.value.split('').map(ch => ch.charCodeAt(0)).join('_'))
})
showSvgBtn.addEventListener('click', () => {
    showSvgDiv.innerHTML = `<img src="/waublocks/${charCodeInput.value.split('').map(ch => ch.charCodeAt(0)).join('_')}.svg"/>`
})
delSvgBtn.addEventListener('click', async () => {
    const res = await fetch(`/delete/${charCodeInput.value.split('').map(ch => ch.charCodeAt(0)).join('_')}`)
    if (!res.ok) {
        alert('failed')
    } else {
        window.location.reload()
    }
})
document.addEventListener('keypress', e => {
    if (e.key !== 'Enter') return;
    submitBlock()
})

// --- FUNCTIONS ---

async function main() {
    state = await loadState()
    state.nextBlock = getFirstUndrawnBlock()
    state.progressPercent = getProgressPercent()
    console.log(state)
    reflectState()
}

async function loadState() {
    return await (await fetch("/state")).json()
}

function getFirstUndrawnBlock() {
    return state.blocks.find(bl => !state.waublocksDrawn.includes(bl))
}

function getProgressPercent() {
    return ((state.waublocksDrawn.length) / (state.blocks.length) * 100).toFixed(1)
}

function reflectState() {
    blockSpan.innerText = `${state.nextBlock} [${state.nextBlock.split('').map(char => char.charCodeAt(0)).join('_')}]`
    progressSpan.innerText = `${state.progressPercent}% [${state.waublocksDrawn.length} of ${state.blocks.length}]`
}

function handleCanvasMousedown(e) {
    document.addEventListener('mousemove', handleCanvasMouseMove)
    linePlotterInteval = setInterval(() => {
        const [x, y] = canvasXY
        if (x === null || y === null) return;
        linePoints.push([x, y])
        drawLinePoints()
    }, LINE_PLOT_INTERVAL);
}

function handleCanvasMouseMove(e) {
    const [ x, y ] = getCanvasXY(e)
    canvasXY = [x, y]
}

function handleCanvasMouseup() {
    console.log("MOUSEUP", Math.random())
    document.removeEventListener('mousemove', handleCanvasMouseMove)
    clearInterval(linePlotterInteval)
    const svgPath = linePointsToSVGPath(linePoints, canvas, svg)
    appendSVGPath(svgPath)
    // console.log(svgPath?.outerHTML)
    linePoints = []
    canvasXY = [null, null]
}

function getCanvasXY(e) {
    const { left, top } = canvas.getBoundingClientRect()
    return [ Math.round(e.clientX - left), Math.round(e.clientY - top) ]
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function clearSVG() {
    svg.innerHTML = ""
}

function drawLinePoints() {
    clearCanvas()

    const firstIndex = linePoints.findIndex(lp => lp[0] !== null && lp[1] !== null)
    const first = linePoints[firstIndex]

    if (!first) {
        console.log("No points to draw")
        return
    }

    ctx.beginPath()
    ctx.moveTo(first[0], first[1])

    for (let i = firstIndex+1; i < linePoints.length; i++) {
        const [x, y] = linePoints[i]
        ctx.lineTo(x, y)
    }

    ctx.strokeStyle = 'yellow'
    ctx.lineWidth = 1
    ctx.stroke()
}


function appendSVGPath(path) {
    if (!path) {
        console.log("No path to append")
        return
    }

    svg.appendChild(path)
}

async function submitBlock() {
    if (svg.children.length < 1) {
        alert(`No paths`)
        return
    }
    
    submitBtn.disabled = true


    const svgBold = svg.cloneNode(true)
    svgBold.childNodes.forEach(path => {
        path.setAttribute('stroke-width', '5')
    })

    await fetch(`/submitBlock/${state.nextBlock}`, {
        method: 'POST',
        body: JSON.stringify({
            svg: svg.outerHTML,
            svg_bold: svgBold.outerHTML
        })
    })

    window.location.reload()
}