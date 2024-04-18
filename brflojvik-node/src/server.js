#!/usr/bin/env node

const result = require("dotenv").config()
 
if (result.error) {
  throw result.error
}

const express = require('express')
const path = require('path')
const fs = require('fs')

const contentfulClient = require('./contentfulClient')

const app = express()

let cachedContentfulContents = undefined
let cachedIndexHtml = undefined

const getContentfulDataJson = async () => {
    if (cachedContentfulContents != undefined) {
        console.log("Returning cached Contentful data.")
        return cachedContentfulContents
    } 
    const jsonStr = await contentfulClient.getAllContent()
    cachedContentfulContents = jsonStr
    return cachedContentfulContents
}

const getIndexHtmlWithAppData = async () => {
    if (cachedIndexHtml != undefined) {
        console.log("Returning cached index.html (with APP_DATA).")
        return cachedIndexHtml
    }

    const indexHtml = await fs.promises.readFile(path.join(__dirname + "/wwwroot/index.html"), {encoding: 'utf8'})
    const contentfulAppData = await getContentfulDataJson()

    const insertionString = `<script type='text/javascript'>window.APP_DATA=${contentfulAppData}</script>`
    const insertionIndex = indexHtml.indexOf("<script")
    const htmlWithAppData = indexHtml.substring(0, insertionIndex) + insertionString + indexHtml.substring(insertionIndex);

    cachedIndexHtml = htmlWithAppData
    console.log("Amended index.html with APP_DATA.")
    return cachedIndexHtml
}

app.get('/', async (req, res) => {
    const indexHtmlWithAppData = await getIndexHtmlWithAppData()
    res.set('Content-Type', 'text/html')
    res.send(indexHtmlWithAppData)
})

app.use(express.static(path.join(__dirname + '/wwwroot/')))

app.get('/api/content/', async (req, res) => {
    res.set('Content-Type', 'application/json')
    res.set('Access-Control-Allow-Origin', 'http://localhost:2000')
    const appDataJson = await getContentfulDataJson()
    res.send(appDataJson)
})

app.post('/api/content/webhook/', async (req, res) => {
    // Update contentful data
    const jsonStr = await contentfulClient.getAllContent()
    cachedContentfulContents = jsonStr
    console.log("Updated all content from Contentful by webhook.")
    
    // Update index file
    cachedIndexHtml = undefined
    getIndexHtmlWithAppData()
    console.log("Updated index.html with all content from Contentful by webhook.")

    res.send(true)
})


app.listen(3000, () => {
    console.log("App is listening on port 3000!")
})