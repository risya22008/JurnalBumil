const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const summarizeText = async (inputText) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192', // Ini nama model LLaMA 3.3 70B Versatile
        messages: [
          {
            role: 'system',
            content: 'Berikan ringkasan singkat tanpa basah-basi dari teks berikut, tapi jika teks ini terdiri dari 1 kata saja maka cukup tulis ulang saja "kondisi ibu hamil adalah" + (teksnya).',
          },
          {
            role: 'user',
            content: `Ringkas informasi berikut:\n\n${inputText}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 512,
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

module.exports = { summarizeText };
