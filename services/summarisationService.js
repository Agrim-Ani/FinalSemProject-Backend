const axios = require('axios');




async function summarizeText(text) {
    try {
        const response = await axios.post(API_URL, {
            prompt: `Summarize this text: ${text}`,
            max_tokens: 150
        }, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error during text summarization:', error);
        throw new Error('Failed to summarize text');
    }
}

module.exports = {summarizeText} ;
const { OpenAI } = require('langchain/llms');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const fs = require('fs');
require('dotenv').config();

const txtFilename = "The_Creative_Act";
const VECTOR_STORE_PATH = `${txtFilename}.index`;

const summarizeText = async (text) => {
    const model = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Here you might want to split the text if it's too large for a single API call
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const chunks = await textSplitter.createDocuments([text]);

    let summary = '';
    for (let chunk of chunks) {
        const response = await model.call({
            prompt: `Summarize the following text: ${chunk.text}`,
            maxTokens: 100, // Adjust as necessary
        });
        summary += response.choices[0].text.trim() + ' ';
    }

    return summary.trim();
};

module.exports = { summarizeText };
