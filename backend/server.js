const express = require('express');
const path = require('path');
const xml2js = require('xml2js');
const fs = require('fs-extra');

const app = express();
const port = 5000;

async function parseXml(id) {
  let xml = '';
  const file = path.resolve(__dirname, 'tunes', `${id}.msq`);

  try {
    xml = fs.readFileSync(file);
  } catch (error) {
    console.error('error', error);
  }

  return xml2js.parseStringPromise(xml, (err, result) => result);
}

app.disable('x-powered-by');
app.get('/api/tune/:id', (req, res) => {
  const parsed = parseXml(req.params.id);

  parsed.then((data) => res.send(data));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
