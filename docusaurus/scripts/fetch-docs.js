const fs = require('fs');
const path = require('path');
const axios = require('axios');

const fetchDocs = async () => {
  try {
    const categoriesResponse = await axios.get('http://localhost:1337/api/categories');
    const categories = categoriesResponse.data.data;

    const docsResponse = await axios.get('http://localhost:1337/api/docs?populate=Folder');
    const docs = docsResponse.data.data;

    const docsDir = path.join(__dirname, '../docs');

    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    const categoryMap = {};
    const existingFiles = new Set();

    categories.forEach(category => {
      const { id, Name, Slug } = category;
      const categoryDir = path.join(docsDir, Slug);

      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
        console.log(`Created folder for category: ${Slug}`);
      }

      categoryMap[id] = categoryDir;

      const categoryFilePath = path.join(categoryDir, 'category.json');
      const categoryData = {
        label: Name,
        position: 1,
        collapsed: false,
        link: {
          type: 'generated-index',
          title: Name,
          description: `List of documents in ${Name}`,
          slug: `/${Slug}`,
          keywords: [Name, 'category']
        }
      };
      fs.writeFileSync(categoryFilePath, JSON.stringify(categoryData, null, 2), 'utf8');
      console.log(`Created category.json for category: ${Slug}`);

      existingFiles.add(categoryFilePath);
    });

    docs.forEach(doc => {
      const { Title, Content, Slug, Folder } = doc;
      const targetDir = Folder && Folder.id ? categoryMap[Folder.id] : docsDir;
      const filePath = path.join(targetDir, `${Slug}.md`);

      const markdownContent = `# ${Title}\n\n${Content}`;
      fs.writeFileSync(filePath, markdownContent, 'utf8');
      console.log(`Created or updated: ${filePath}`);

      existingFiles.add(filePath);
    });

    const removeDeletedFiles = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          removeDeletedFiles(filePath);
        } else if (!existingFiles.has(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted: ${filePath}`);
        }
      });
    };

    removeDeletedFiles(docsDir);

  } catch (error) {
    console.error('Error fetching docs or categories:', error);
  }
};

fetchDocs();
