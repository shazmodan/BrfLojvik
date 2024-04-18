const contentful = require('contentful')

const client = contentful.createClient({
    accessToken: process.env.ACCESS_TOKEN,
    space: process.env.SPACE,
})

const getAllContent = async () => {
    console.log("Getting all contents from contentful...")
    const entries = await client.getEntries({ 
        limit: 999,
        resolveLinks: false
    })
    console.log("Items returned from Contentful: ", entries.items.length)
    
    const stringified = JSON.stringify(entries)
    return stringified
}

module.exports = {
    getAllContent
}