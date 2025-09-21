import { alphabetize } from "./util.js"
const blocksContainer = document.querySelector('.blocks')
const pagination = document.querySelector('.pagination')
const PERPAGE = 200


let state

main()

async function main() {

    const res = await fetch("/state")
    state = await res.json()
    state.page = 1
    state.desc = false
    state.waublocksDrawn.sort((bl1, bl2) => {
        return alphabetize(bl1, bl2, state.desc)
    })
    console.log(state)
    renderPage()

}

function toCharCode(str) {
    return str.split('').map(ch => ch.charCodeAt(0)).join('_')
}

function renderPage() {
    const start = (state.page-1) * PERPAGE
    const end = state.page * PERPAGE
    const shownBlocks = state.waublocksDrawn.slice(start, end)

    blocksContainer.innerHTML = ""
    pagination.innerHTML = ""


    shownBlocks.forEach(bl => {
        blocksContainer.insertAdjacentHTML('beforeend', `
            <div class="block">
                <p>${bl}</p>
                <img class="regular" src="/waublocks/${toCharCode(bl)}.svg" />
                <img class="bold" src="/waublocks_bold/${toCharCode(bl)}.svg" />
            </div>
        `)
    })

    const totalPages = Math.ceil(state.waublocksDrawn.length/PERPAGE)

    pagination.innerHTML = `<p>Page ${state.page} of ${totalPages}</p>`
    
    if ((state.page-1) > 0) {
        const prevBtn = document.createElement('button')
        prevBtn.innerHTML = "&larr;"
        prevBtn.addEventListener('click', () => {
            state.page--
            renderPage()
        })
        pagination.appendChild(prevBtn)
    }

    if (state.page < totalPages) {
        const nextBtn = document.createElement('button')
        nextBtn.innerHTML = "&rarr;"
        nextBtn.addEventListener('click', () => {
            state.page++
            renderPage()
        })
        pagination.appendChild(nextBtn)
    }
}