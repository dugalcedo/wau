import { cropSVG } from '/util.js'

main()

async function main() {
    const res = await fetch('/state')
    const state = await res.json()
    console.log(state)
    
    for (let i = 0; i < state.waublockFiles.length; i++) {

        // break
        const file = state.waublockFiles[i]
        if (!['36.svg', '163.svg'].includes(file)) continue;
        console.log(file)

        if (i % 1000 === 0) {
            console.log(`processing ${i} of 7201`)
        }

        const svgRes = await fetch(`/waublocks/${file}`)
        const svgText = await svgRes.text()

        const container = document.createElement('div')
        container.innerHTML = svgText
        const svg = container.children[0]

        const newSvg = cropSVG(svg)

        console.log(newSvg.outerHTML)

        const svgBold = newSvg.cloneNode(true)
        svgBold.childNodes.forEach(path => {
            path.setAttribute('stroke-width', '5')
        })
        
        const newRes = await fetch(`/addCropped/${file}`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                svg: newSvg.outerHTML,
                bold: svgBold.outerHTML
            })
        })

        if (!newRes.ok) {
            console.error("FAILED")
            return
        }
    }

    console.log('done')
}