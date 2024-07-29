import GD from 'new-gd.js'
import * as gdboom from 'gj-boomlings-api'
import { HfInference } from "@huggingface/inference"
import * as util from 'util'
const gd = new GD()
const hfInference = new HfInference(process.env.HF_TOKEN)
const prompts = {
    // some prompts for ai for different outputs
    // name, author, desc, songname
    dumb: // Prompt used for vustur/GDNerd (2023), NerdNine on gd
    "You are going to comment geometry dash (game) level! You should write a very funny and ORIGINAL (it should not look like your other comments!) joke or comment about the level with name %s created by %s with description '%s' and song %s like you are beginner player. REMEMBER: your joke or comment should be not longer than 100 characters, so it should be very short (geometry dash limit)! Your joke or comment also should be funny, include something about level name, description or song and not look like it was written by chat gpt. You can use some of this words (NOT ALL IN ONE joke or comment): ship, ball, cube, wave, ufo, hardest part, straightfly, spikes, blockdesign, deco, GD (short name of game), other players, robtop(gd developer), rate(process when gd level get stars by moderators), touch grass, vsc (hardest wave level), stereo madness(first main geometry dash level), back on track(second main geometry dash level). Example: 'Actually good level! Ball part was so cool' REMEMBER: your joke or comment should be not longer than 100 chars, so it should be very short (geometry dash limit), include something about name, description or song and it should be original(not like 'wild ride' or 'rollercoaster')! MOST IMPORTANT RULE: YOU SHOULD JUST RETURN A joke or comment WITHOUT CONTEXT",
}

const selectedPrompt = 'dumb'

const getRecentLevel = async () => {
    const level = await gd.levels.search({orderBy: 'recent'})
    return {name: level.name, desc: level.description, songname: level.song.name, author: level.creator.username, id: level.id}
}

const askAi = async (level) => {
    const prompt = util.format(prompts[selectedPrompt], level.name, level.author, level.desc, level.songname)
    const output = await hfInference.chatCompletion({
        // model: "meta-llama/Meta-Llama-3-8B-Instruct",
        model: "mistralai/Mistral-7B-Instruct-v0.3",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        max_tokens: 100,
        seed: Math.floor(100000 + Math.random() * 900000)
    })
    let content = output.choices[0].message.content.replace(/"/g, "")
    return content
}

console.log("----- Fetching level...")
const level = await getRecentLevel()
console.log(`Got level 
    Name:       ${level.name}
    Author:     ${level.author}
    Desc:       ${level.desc}
    Songname:   ${level.songname}
    Id:         ${level.id}`
)
let resp = await askAi(level)
console.log(`AI resp:       ${resp} /// Length = ${resp.length}`)
resp = resp.slice(0, 99)
resp = resp.replace(/[^a-zA-Z0-9\*\(\)\ \.\,\!\?\/]/g, '')
console.log(`Fixed resp:    ${resp}`)
