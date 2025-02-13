const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Sound = require('../models/Sound');
const fs = require('fs')
dotenv.config()
const genAI = new GoogleGenerativeAI(process.env.API_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
exports.searchInDatabase = async (req, res) => {
    try {
        const { keyword } = req.body
        if (!keyword) return res.status(400).json({ error: "Invalid keyword" })

        const sounds = await Sound.find()

        const prompt = `
        You are given a JSON array of sound effects. 
        Search for sounds that match the keyword "${keyword}" in their description or tags.
        Return an array of matching objects.
        JSON Data:
        ${JSON.stringify(sounds)}
        `;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const filteredSounds = JSON.parse(await response.text());
        // AI-processed JSON

        const mappedResults = filteredSounds.map(sound => new Sound({
            name: sound.name,
            is_premium: sound.is_premium || false,
            file_sound_url: sound.file_sound_url,
            file_images_url: sound.file_images_url,
            duration: sound.duration,
            tag: sound.tag,
            describtion: sound.describtion
        }));
        console.log({ sounds: mappedResults });
        res.render('airesult', { sounds: mappedResults });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.chatbox = async (req, res) => {
    const userInput = req.body.msg;
    const file = req.file;
    try {
        let prompt = [userInput]
        if (file) {
            const fileData = fs.readFileSync(file.path)
            const image = {
                inlineData: {
                    data: fileData.toString('base64'),
                    mimeType: file.mimeType,
                }
            }
            prompt.push(image)
        }
        const response = await model.generateContent(prompt)
        res.send(response.response.text())
    } catch (error) {
        console.error("Error generating response: ",error);
        res.status(error.status || 500).send("An error occurred while generating the response")
    }finally { 
        if(file) {
            fs.unlinkSync(file.path)
        }
         
        }
}