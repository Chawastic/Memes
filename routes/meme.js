const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const { ensureAuthenticated } = require('../public/js/authMiddleware');
const { saveMemesToFile } = require('../public/js/memesData');


const configPath = path.join(__dirname, '../data', 'config.json');
const rawConfig = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(rawConfig);
const apiURL = config.apiURL;

let cachedMemes = null;

async function fetchMemes() {
  try {
    const { data } = await axios.get(apiURL);
    cachedMemes = data.memes;
  } catch (error) {
    console.error('Error fetching memes:', error);
    cachedMemes = [];
  }
}
fetchMemes();


router.get('/memes', (req, res) => {
  if (cachedMemes === null) {
    fetchMemes();
  }
  saveMemesToFile(cachedMemes);
  res.render('memeOverview', { memes: cachedMemes, user: req.user });
});

router.get('/search-memes', (req, res) => {
  const searchTerm = req.query.q.toLowerCase();
  const matchingMemes = cachedMemes.filter((meme) => meme.name.toLowerCase().includes(searchTerm));

  res.render('memeOverview', { memes: matchingMemes, user: req.user });
});

router.get('/meme/:memeId', ensureAuthenticated, (req, res) => {
  const memeId = req.params.memeId;
  const memeDetails = cachedMemes.find((meme) => meme.id === parseInt(memeId));
  if (memeDetails) {
    res.render('memeDetails', { memeDetails, user: req.user });
  } else {
    res.status(404).send('Meme not found');
  }
});


router.post('/highlight-row', (req, res) => {
  res.json({ success: true });
});


module.exports = router;
