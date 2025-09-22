import { cropSVG } from "./util.js"

const uncroppedDiv = document.querySelector('.uncropped')
const croppedDiv = document.querySelector('.cropped')

let state

main()

async function main() {
    const res = await fetch("/state")
    state = await res.json()
    console.log(state)


    const randomFileNames = []
    for (let i = 0; i < 15; i++) {
        randomFileNames.push(state.waublockFiles[Math.floor(Math.random()*state.waublockFiles.length)])
    }

    for (const fileName of randomFileNames) {
        // uncropped
        uncroppedDiv.innerHTML += `<img src="/waublocks/${fileName}">`

        // cropped text
        const svgRes = await fetch(`/waublocks/${fileName}`)
        const svgText = await svgRes.text()
        croppedDiv.innerHTML += svgText
    }

    const svgs = document.querySelectorAll('.cropped svg')
    for (const svg of svgs) {
        const croppedSVG = cropSVG(svg)
        svg.outerHTML = croppedSVG.outerHTML
    }
}