const express = require('express');
const app = express();
const main = require('./aichat');
const User = require('./modules/user');
const connectDB = require('./database')


app.use(express.json());


const cors = require('cors');
const { configDotenv } = require('dotenv').config();
const PORT=process.env.PORT;
app.use(cors(
  {
    origin:process.env.ORIGIN
  }
));

connectDB();
app.get('/health',(req,res)=>{
  res.status(201).json({
    "success":"true",
    "message":"Server is running"
  })
})
app.post('/chat', async (req, res) => {
  try {
    const { id, mes } = req.body;

    // Find or create user document
    let userDoc = await User.findOne({ userId: id });

    if (!userDoc) {
      userDoc = new User({ userId: id, messages: [] });
    }

    // Prepare prompt from previous messages
    const prompt = [
      ...userDoc.messages.map(msg => ({
        role: msg.role,
        parts: msg.parts
      })),
      {
        role: "user",
        parts: [{ text: mes }]
      }
    ];

    // Generate response
    const ans = await main(prompt);

    // Add user message
    userDoc.messages.push({
      role: "user",
      parts: [{ text: mes }]
    });

    // Add model response
    userDoc.messages.push({
      role: "model",
      parts: [{ text: ans }]
    });

    // Save updated messages
    await userDoc.save();

    res.send(ans);
  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).send("Error: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT} `);
});