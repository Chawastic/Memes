const path = require('path');
const fs = require('fs');

function saveMemesToFile(memes) {
  const filePath = path.join(__dirname, '../../data/memes.json');
  const memesData = JSON.stringify(memes, null, 2);
  fs.writeFileSync(filePath, memesData);
}

module.exports = { saveMemesToFile };