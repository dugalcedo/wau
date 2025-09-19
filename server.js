import express from 'express'
import fs from 'fs'
import blocks from './blocks.js'

const app = express()

app.use(express.json({ type: '*/*' }))
app.use(express.static('public'))

app.get("/state", (req, res) => {  
    const waublockFiles = fs.readdirSync('public/waublocks')
    const waublocksDrawn = waublockFiles.map(file => {
        let block = file.replace('.svg', '')
        return block.split("_").map(n => String.fromCharCode(Number(n))).join('')
    })

    res.json({
        waublockFiles,
        waublocksDrawn,
        blocks 
    })
})

app.post("/submitBlock/:block", (req, res) => {
    let block = req.params.block.split('').map(char => char.charCodeAt(0)).join('_')

    fs.writeFileSync(`public/waublocks/${block}.svg`, req.body.svg)
    fs.writeFileSync(`public/waublocks_bold/${block}.svg`, req.body.svg_bold)
    res.json({})
})

app.get("/delete/:charcodes", (req, res) => {
    try {
        fs.unlinkSync(`public/waublocks/${req.params.charcodes}.svg`)
        res.json({})
    } catch  {
        res.status(500)
        res.json({})
    }
})

app.listen(666, () => {
    console.log(`http://localhost:666`)
})