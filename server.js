import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/proofread', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Please send a valid text string.' });
  }

  try {
    const messages = [
      {
        role: 'system',
        content:
          'You are a helpful writing assistant. Proofread and improve the user text for grammar, clarity, punctuation, and tone while preserving the original meaning. Provide a polished version and a short list of suggested improvements.',
      },
      {
        role: 'user',
        content: `Please proofread and improve the following text, then return the revised version and a brief summary of changes:\n\n${text}`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.2,
      max_tokens: 1000,
    });

    const result = completion.choices?.[0]?.message?.content || '';
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to call OpenAI API.' });
  }
});

app.listen(port, () => {
  console.log(`Proofreader app running at http://localhost:${port}`);
});
