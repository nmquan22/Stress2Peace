import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import axios from 'axios';  // Use axios to make HTTP requests
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import moment from 'moment';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const emotionToStressLevel = {
  "joy": 1,
  "surprise": 1,
  "Excited": 2,
  "Inspired": 2,
  "calm": 2,
  "neutral": 3,
  "confused": 3,
  "sadness": 4,
  "anger": 7,
  "disgust": 6,
  "fear": 5,
};

// === MongoDB Setup ===
mongoose.connect(process.env.VITE_MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
role: { type: String, enum: ['user', 'admin'], default: 'user' },
});
const User = mongoose.model('User', userSchema);

// === StressEntry Schema ===
const stressEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: String, required: true },
  stressLevel: { type: Number, required: true },
  emotion: { type: String, required: true },
});
const StressEntry = mongoose.model('StressEntry', stressEntrySchema);

// == ChatLog Schema ===
const ChatLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  response: String,
  timestamp: { type: Date, default: Date.now }
});
const ChatLog = mongoose.model('ChatLog', ChatLogSchema);

// === DailyMoodSummary Schema ===
const dailyMoodSummarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: String, required: true }, // e.g., '2025-05-01'
  moods: [String],
  mostFrequentMood: String,
});
const DailyMoodSummary = mongoose.model('DailyMoodSummary', dailyMoodSummarySchema);

// === JWT Middleware ===
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role; 
    next();
  } catch (err) {
    return res.status(403).json({ msg: 'Invalid token' });
  }
};

// Set up Hugging Face API key
const HUGGINGFACE_API_KEY = process.env.VITE_HUGGINGFACE_API_KEY;
const HUGGINGFACE_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';

app.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Make POST request to Hugging Face API
    const response = await axios.post(
      HUGGINGFACE_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        },
        responseType: 'arraybuffer',  // Ensure we get the image as a binary stream
      }
    );

    const imageBuffer = Buffer.from(response.data);
    res.setHeader("Content-Type", "image/png");
    res.send(imageBuffer);
  } catch (err) {
    console.error("Image generation error:", err);
    res.status(500).send("Failed to generate image");
  }
});

// === Auth: Login Endpoint ===
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role }); 
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// === Optional: Register Endpoint ===
app.post('/register', async (req, res) => {
  const { email, password, role } = req.body; // role optional
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role: role || 'user' });
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// === Add Stress Entry (Authenticated) ===
app.post('/api/stress/add', authenticate, async (req, res) => {
  const { date, stressLevel, emotion } = req.body;
  try {
    const entry = new StressEntry({ userId: req.userId, date, stressLevel, emotion });
    await entry.save();
    res.status(201).json({ msg: 'Entry saved' });
  } catch (err) {
    console.error('Add stress error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// === Get Stress History (Authenticated) ===
app.get('/api/stress/history', authenticate, async (req, res) => {
  try {
    const history = await StressEntry.find({ userId: req.userId });
    res.json(history);
  } catch (err) {
    console.error('Fetch stress history error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// === Chatbot RAG Route (Authenticated) ===
app.post('/api/chat', authenticate, async (req, res) => {
  const { message } = req.body;
  const userId = req.userId;

  try {
    // const response = await axios.post('http://localhost:5001/rag/chat', {
    //   query,
    //   userId
    // });
    const response = await axios.post('http://127.0.0.1:5001/rag_chat', {
      message,
      userId
    });

    res.json(response.data);
  } catch (err) {
    console.error('Error calling RAG backend:', err.message);
    res.status(500).json({ error: 'RAG backend error' });
  }
});

app.post('/api/emotion/log', authenticate, async (req, res) => {
  const { message, emotion } = req.body;
  const userId = req.userId;

  // Check if emotion is provided
  if (!emotion) {
    return res.status(400).json({ error: 'Emotion is required' });
  }
  const normalized = emotion.toLowerCase();
  const stressLevel = emotionToStressLevel[normalized] || 3;
  try {
    const today = moment().format('YYYY-MM-DD');

    // === Update DailyMoodSummary ===
    const summary = await DailyMoodSummary.findOneAndUpdate(
      { userId, date: today },
      { $push: { moods: emotion } },
      { new: true, upsert: true }
    );

    // Recalculate most frequent mood
    if (summary && summary.moods.length > 0) {
      const freqMap = {};
      summary.moods.forEach((m) => (freqMap[m] = (freqMap[m] || 0) + 1));
      summary.mostFrequentMood = Object.entries(freqMap).sort((a, b) => b[1] - a[1])[0][0];
      await summary.save();
    }

    // === Update StressEntry ===
    await StressEntry.findOneAndUpdate(
      { userId, date: today },
      {
        $set: { emotion, stressLevel },
        $setOnInsert: { createdAt: new Date() }
      },
      { new: true, upsert: true }
    );

    // Log successful update
    console.log(`Successfully logged emotion: ${emotion} for userId: ${userId} on ${today}`);

    // Send response with updated summary
    res.json({ status: 'ok', emotion, updatedSummary: summary });
  } catch (err) {
    console.error('Emotion logging error:', err);
    res.status(500).json({ error: 'Emotion detection failed' });
  }
});

// === Get Current Mood ===
app.get('/api/mood/current', authenticate, async (req, res) => {
  try {
    const today = moment().format('YYYY-MM-DD');
    const summary = await DailyMoodSummary.findOne({ userId: req.userId, date: today });

    if (!summary || !summary.mostFrequentMood) {
      return res.status(404).json({ message: "No mood recorded for today" });
    }

    res.json({ mood: summary.mostFrequentMood });
  } catch (err) {
    console.error("Error fetching current mood:", err);
    res.status(500).json({ message: "Server error fetching mood" });
  }
});

// === Community Post Schema ===
const communityPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  tags: [String],
  anonymous: { type: Boolean, default: false }
});
const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);

// create a new post
app.post('/api/community/post', authenticate, async (req, res) => {
  const { content, tags, anonymous } = req.body;

  try {
    const post = new CommunityPost({
      userId: req.userId,
      content,
      tags,
      anonymous: !!anonymous
    });
    await post.save();
    res.status(201).json({ msg: 'Post created successfully' });
  } catch (err) {
    console.error('Community post error:', err);
    res.status(500).json({ msg: 'Server error creating post' });
  }
});

app.get('/api/community/posts', async (req, res) => {
  try {
    const posts = await CommunityPost.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'email'); // You could limit what you show
    res.json(posts);
  } catch (err) {
    console.error('Fetch community posts error:', err);
    res.status(500).json({ msg: 'Server error fetching posts' });
  }
});

app.get('/api/community/myposts', authenticate, async (req, res) => {
  try {
    const posts = await CommunityPost.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Fetch user posts error:', err);
    res.status(500).json({ msg: 'Server error fetching user posts' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
