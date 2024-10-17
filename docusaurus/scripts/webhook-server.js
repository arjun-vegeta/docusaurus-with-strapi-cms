const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.post('/reload-docs', (req, res) => {
  console.log('Webhook received from Strapi:', req.body);

  // Run both fetch-docs and generate-sidebar sequentially
  exec('npm run fetch-docs && npm run generate-sidebar', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error fetching docs or generating sidebar: ${error.message}`);
      return res.status(500).send('Failed to update docs or sidebar.');
    }

    console.log(`Docs and sidebar updated: ${stdout}`);

    // Optionally restart Docusaurus to ensure changes take effect
    exec('npx docusaurus clear && npx docusaurus start', (restartError, restartStdout, restartStderr) => {
      if (restartError) {
        console.error(`Error restarting Docusaurus: ${restartError.message}`);
        return res.status(500).send('Failed to restart Docusaurus.');
      }
      console.log(`Docusaurus restarted: ${restartStdout}`);
      res.status(200).send('Docs and sidebar updated successfully.');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
