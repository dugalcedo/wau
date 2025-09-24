import { cropSVG } from "./util.js"

const uncroppedDiv = document.querySelector('.uncropped')
const croppedDiv = document.querySelector('.cropped')

let state

main()

async function main() {
    const res = await fetch("/state")
    state = await res.json()
    console.log(state)

    const word = new URL(location.href).searchParams.get('word')
    const fileNames = []

    if (word) {
        const syls = word.split('-')
        for (const syl of syls) {
            fileNames.push(`${syl.split('').map(c => c.charCodeAt(0)).join('_')}.svg`)
        }
    } else {
        for (let i = 0; i < 15; i++) {
            fileNames.push(state.waublockFiles[Math.floor(Math.random()*state.waublockFiles.length)])
        }
    }


    for (const fileName of fileNames) {
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