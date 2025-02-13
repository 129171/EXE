const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Sound = require('../models/Sound');
const fs = require('fs')
dotenv.config()
const genAI = new GoogleGenerativeAI(process.env.API_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
exports.searchInDatabase = async (req, res) => {
    try {
        const { msg } = req.body;
        if (!msg) return res.status(400).render('errors', { message: "Invalid keyword" });


        const sounds = await Sound.find();

        const prompt = `
        You are given a JSON array of sound effects. 
        Search for sounds that match the keyword "${msg}" in their description or tags.
        Return an array of matching objects.
        JSON Data:
        ${JSON.stringify(sounds)}
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;

        // Check if the response is valid before proceeding
        if (!response || !response.text) {
            return res.status(200).render('airesult', { sounds: [] }); // No data, show empty results
        }

        // Handle parsing the response safely
        let filteredSounds = [];
        try {
            filteredSounds = JSON.parse(await response.text());
        } catch (parseError) {
            console.error("Error parsing response text:", parseError);
            return res.status(200).render('airesult', { sounds: [] }); // In case of parsing error, show empty results
        }

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
         return res.status(400).render('errors', { message: "Internal Server Error" });

    }
};
