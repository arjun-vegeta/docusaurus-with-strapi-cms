const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.post('/reload-docs', (req, res) => {
  console.log('Webhook received from Strapi:', req.body);

  exec('npm run fetch-docs', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error fetching docs: ${error.message}`);
      return res.status(500).send('Failed to fetch docs.');
    }
    console.log(`Docs fetched successfully: ${stdout}`);
    res.status(200).send('Docs updated.');
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
