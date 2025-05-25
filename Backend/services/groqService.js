const axios = require('axios');
const { convertSymptoms } = require('../utils/symptomMapping');
const Groq= require('groq-sdk');

require('dotenv').config();
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groq = new Groq({
  apiKey: GROQ_API_KEY, 
});


const summarizeText = async (inputText) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'meta-llama/llama-4-scout-17b-16e-instruct', // Ini nama model LLaMA 3.3 70B Versatile
        messages: [
          {
            role: 'system',
            content: 'Anda adalah asisten medis yang meringkas laporan kondisi kesehatan ibu hamil. Jika hanya satu kata, tambahkan awalan "kondisi ibu hamil adalah ...". Jika lebih panjang, ringkas menjadi satu paragraf yang tetap mencakup kondisi penting.',
          },
          {
            role: 'user',
            content: `Ringkas informasi berikut:\n\n${inputText}`,
          },
        ],
        temperature: 1,
        max_tokens: 2570,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error saat merangkum teks:', error.response?.data || error.message);
    throw new Error('Gagal merangkum teks');
  }
};

async function getAISummary(data) {

    data = JSON.stringify(convertSymptoms(data));

    const prompt = `
    Berdasarkan data kesehatan harian berikut, buatlah ringkasan kondisi kesehatan dalam bentuk satu paragraf saja. Ringkasan harus menyebutkan gejala yang muncul, kecenderungan kondisi pasien (misalnya: membaik, stabil, atau menurun), serta hal penting yang perlu diperhatikan. Jangan sertakan penjelasan tambahan, hanya berikan ringkasan dalam paragraf.
    Data:
    ${data}
    `;


    const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "temperature": 1.5,
        "max_completion_tokens": 2570,
        "top_p": 1,
        "stream": false,
        "stop": null
    });

    
    const result = chatCompletion.choices[0]?.message?.content || "";

    return result;

}


module.exports = { summarizeText, getAISummary };
