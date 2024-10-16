# Strapi & Docusaurus Documentation Site

This project combines a Strapi backend with a Docusaurus frontend to create a documentation site. The Strapi CMS manages categories and documents, while Docusaurus provides a static site for rendering the documentation.

## Project Structure

```
/docusaurus with strapi cms
├── strapi backend        # Strapi backend
└── docusaurus frontend    # Docusaurus frontend
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- MongoDB or another database supported by Strapi (if using MongoDB, ensure you have it installed and running)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/arjun-vegeta/docusaurus-with-strapi-cms.git
   cd your docusaurus-with-strapi-cms
   ```

2. **Set Up Strapi**
   - Navigate to the Strapi directory:
     ```bash
     cd strapi 
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run Strapi:
     ```bash
     npm run develop
     ```
   - The Strapi admin panel will be available at `http://localhost:1337/admin`.

3. **Set Up Docusaurus**
   - Open a new terminal window or tab, then navigate to the Docusaurus directory:
     ```bash
     cd docusaurus
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run Docusaurus:
     ```bash
     npm start
     ```
   - Docusaurus will be available at `http://localhost:3000`.

## Strapi Configuration

### Content Types

This project includes two main content types:

1. **Category**
   - **Name**: Text
   - **Slug**: UID
   - **Number**: Number

2. **Doc**
   - **Title**: Text
   - **Slug**: UID
   - **Content**: Rich Text
   - **Folder**: Relation with Category (Many-to-One)

### Role Permissions

1. In the Strapi admin panel, navigate to `Settings` > `Roles` > `Public`.
2. Grant the following permissions:
   - **Categories**: Find and Find One
   - **Docs**: Find and Find One

This setup allows the public to read the categories and documents.

### Webhook Configuration

Set up a webhook to trigger updates in Docusaurus whenever a document or category is created, updated, or deleted. You can do this under:
- **Settings** > **Webhooks** in the Strapi admin panel.
Webhook Url - `http://localhost:3001/reload-docs`.

### Additional Notes

- Ensure your database is correctly set up and connected in `config/database.js` (or `.env` for environment variables).
- For any further customization, refer to the Strapi and Docusaurus documentation.



