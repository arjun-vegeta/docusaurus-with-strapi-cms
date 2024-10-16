const fs = require('fs');
const path = require('path');
const axios = require('axios');

const fetchDocs = async () => {
  try {
    // Fetch categories
    const categoriesResponse = await axios.get('http://localhost:1337/api/categories');
    const categories = categoriesResponse.data.data;

    // Fetch docs
    const docsResponse = await axios.get('http://localhost:1337/api/docs?populate=Folder');
    const docs = docsResponse.data.data;

    const docsDir = path.join(__dirname, '../docs'); // Path to the docs folder

    // Ensure the docs directory exists
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // Create a map for categories based on their ID
    const categoryMap = {};
    categories.forEach(category => {
      const { id, Name, Slug } = category;

      const categoryDir = path.join(docsDir, Slug);

      // Ensure the category directory exists
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
        console.log(`Created folder for category: ${Slug}`);
      }

      categoryMap[id] = categoryDir;
    });

    // Track existing files before the update (to handle deletions)
    const existingFiles = new Set();

    // Iterate over each document and place it in the respective category folder
    docs.forEach(doc => {
      const { id, Title, Content, Slug, Folder } = doc;

      // Determine the target directory based on the Folder relation (category)
      const targetDir = Folder && Folder.id ? categoryMap[Folder.id] : docsDir;

      // Create the Markdown file path
      const filePath = path.join(targetDir, `${Slug}.md`);

      // Prepare the Markdown content
      const markdownContent = `# ${Title}\n\n${Content}`;

      // Write the content to the file
      fs.writeFileSync(filePath, markdownContent, 'utf8');
      console.log(`Created or updated: ${filePath}`);

      // Add the file to the set of existing files (for later comparison)
      existingFiles.add(filePath);
    });

    // Now, remove any files that are no longer in the docs fetched from Strapi
    const removeDeletedFiles = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          // Recursively check subdirectories (categories)
          removeDeletedFiles(filePath);
        } else if (!existingFiles.has(filePath)) {
          // If the file is not part of the existing docs, delete it
          fs.unlinkSync(filePath);
          console.log(`Deleted: ${filePath}`);
        }
      });
    };

    // Check for deletions in all category folders and the docs root
    removeDeletedFiles(docsDir);

  } catch (error) {
    console.error('Error fetching docs or categories:', error);
  }
};

fetchDocs();
