const dotenv = require('dotenv');
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config()

const genAI =  new GoogleGenerativeAI(process.env.API_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
exports.searchInDatabase = async (req,res) => {
    
}