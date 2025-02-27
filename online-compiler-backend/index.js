require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const API_KEY = process.env.RAPIDAPI_KEY;

// POST endpoint to run code
app.post('/api/run', async (req, res) => {
  const { language_id, source_code, stdin } = req.body;

  try {
    const submissionResponse = await axios.post(
      `${JUDGE0_API_URL}/submissions`,
      { language_id, source_code, stdin },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      }
    );

    const token = submissionResponse.data.token;
    
    let result;
    while (true) {
      const resultResponse = await axios.get(
        `${JUDGE0_API_URL}/submissions/${token}`,
        {
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          },
          params: { base64_encoded: false, fields: '*' },
        }
      );
      result = resultResponse.data;

      if (result.status.id >= 3) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
