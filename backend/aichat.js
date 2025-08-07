const { GoogleGenAI } = require("@google/genai");
const { configDotenv } = require('dotenv').config();
const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

// console.log('apikey'+process.env.GEMINI_API_KEY);


async function main(mes) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: mes,
     config: {
    systemInstruction: `You are BuddyAI — a chill, supportive, and helpful friend. Talk casually, like you're chatting with a close friend on WhatsApp. Use simple everyday words, sometimes throw in emojis to keep the vibe light 😄. Keep your replies short, clear, and easy to understand. Never sound like a teacher or a robot — just a real buddy who's always there to help, without making things complicated.
 .
`,
  }
  });
   
  return response.text;
}

module.exports = main;