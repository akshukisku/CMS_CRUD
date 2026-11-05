# Category-Based CMS — Class-Based Express + EJS

This version follows the structure and coding style in your uploaded `CMS_crud` project:

- CommonJS (`require` / `module.exports`)
- Class-based models, services and controllers
- `src/views/partials/header.ejs`, `navbar.ejs`, and `footer.ejs`
- Main page at `src/views/home.ejs`
- Category and content EJS pages grouped into their own view folders
- JSON file storage only; no database

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5000`.

## Folder structure

```text
CMS_crud/
├── data/
│   ├── category.json
│   └── content.json
├── public/
│   ├── css/style.css
│   └── js/main.js
├── src/
│   ├── controllers/
│   │   ├── api/
│   │   └── web/
│   ├── models/
│   ├── routes/
│   │   ├── api/
│   │   └── web/
│   ├── services/
│   ├── utils/
│   ├── validation/
│   └── views/
│       ├── partials/
│       ├── category/
│       ├── content/
│       ├── errors/
│       └── home.ejs
├── app.js
├── server.js
└── package.json
```

## EJS routes

| Page | Route |
|---|---|
| Home | `/` |
| Categories | `/category` |
| Create category | `/category/create` |
| Edit category | `/category/:id/edit` |
| Category details | `/category/:id` |
| Content management | `/content` |
| Create content | `/content/create` |
| Edit content | `/content/:id/edit` |
| Published content detail | `/content/:id` |

EJS create/edit forms submit to the web routes. The forms use `method-override` for PATCH and DELETE.

## API routes for Postman

Base URL: `http://localhost:5000`

### Category

- GET `/v1/category`
- GET `/v1/category/:id`
- POST `/v1/category`
- PATCH `/v1/category/:id`
- DELETE `/v1/category/:id`

Category request body:

```json
{
  "name": "Technology",
  "description": "Technology articles",
  "imageurl": "https://example.com/technology.jpg"
}
```

### Content

- GET `/v1/content`
- GET `/v1/content?categoryId=CATEGORY_ID`
- GET `/v1/content?status=published`
- GET `/v1/content/:id`
- POST `/v1/content`
- PATCH `/v1/content/:id`
- DELETE `/v1/content/:id`

Content request body:

```json
{
  "categoryId": "CATEGORY_ID",
  "title": "Getting Started",
  "description": "An introduction",
  "body": "The complete article body goes here.",
  "thumbnail": "https://example.com/thumbnail.jpg",
  "status": "draft"
}
```

Import `postman/Category-CMS.postman_collection.json` into Postman.

## Data rules

- IDs are generated with `crypto.randomUUID()`.
- Category names are unique (case-insensitive).
- Category slugs are generated and made unique.
- Content must reference an existing category.
- Content updates preserve `id` and `createdAt`, and update `updatedAt`.
- A category cannot be deleted while it has content assigned.
- Public pages display published content only; drafts remain in the content management listing.
- JSON is stored in `data/`, outside `public/`.
- File operations use `fs/promises`, with writes queued within one Node.js process.

## Important

The JSON write queue protects writes in one Node.js process only. For a multi-process or production deployment, use a database or implement cross-process file locking. Add authentication/authorization, CSRF protection, rate limiting and backups before exposing the management routes publicly.
