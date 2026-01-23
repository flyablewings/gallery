# Model Europa Portfolio & CMS Guide

This project features a integrated CMS backend and Docker configuration for professional deployment.

## 🛠️ CMS Backend (Admin Dashboard)

You can now manage your portfolio through a dedicated UI:

1.  Navigate to `/admin`.
2.  Add new projects with titles, images, categories, and descriptions.
3.  Delete existing projects.
4.  The changes are saved to a PostgreSQL database and reflected instantly on the site.

## 🐳 Docker Deployment

The project is fully containerized for easy deployment:

### Prerequisites
- Docker and Docker Compose installed.

### Quick Start
1.  Run the following command to start the app and database:
    ```bash
    docker-compose up -d --build
    ```
2.  The application will be available at `http://localhost:3000`.
3.  To initialize the database schema and seed data (first time only):
    ```bash
    docker-compose exec app npx prisma db push
    docker-compose exec app npx prisma db seed
    ```

## 🚀 Development Setup (Local)

1.  **Database**: Ensure you have PostgreSQL running or use the docker database:
    ```bash
    docker-compose up -d db
    ```
2.  **Environment Variables**: Create a `.env` file based on `env.example`.
3.  **Setup**:
    ```bash
    npm install
    npx prisma generate
    npx prisma db push
    npx prisma db seed
    npm run dev
    ```

## 🐳 Production Deployment (Docker)

The application is fully containerized and ready for production deployment:

### Quick Start
```bash
# Build and start all services
docker-compose up -d --build

# The application will be available at http://localhost:3003
```

### Database Management
- **Automatic Setup**: The Docker setup automatically creates the database schema on first run
- **Admin Interface**: Use `/admin` to add, edit, and manage your portfolio projects
- **Data Persistence**: Database data is stored in a Docker volume (`postgres_data`)
- **File Storage**: Uploaded images are stored in a Docker volume (`uploads_data`)

### Services
- **PostgreSQL Database**: Runs on port 6432 (external), 5432 (internal)
- **Next.js Application**: Runs on port 3003 with automatic database initialization

## 📸 **Complete CRUD with Image Upload**

### Admin Features
- **Create Projects**: Add new projects with multiple image uploads
- **Read Projects**: View all projects with image galleries
- **Update Projects**: Edit project details and manage images
- **Delete Projects**: Remove projects and associated images

### Image Management
- **Multiple Image Upload**: Upload multiple images per project (JPG, PNG, GIF, max 5MB each)
- **Primary Image Selection**: Set one image as the primary display image
- **Image Reordering**: Control the display order of images
- **Automatic File Management**: Images are stored securely and served efficiently
- **Image Deletion**: Remove individual images or entire projects

### File Storage
- **Docker Volumes**: Images are persisted in Docker volumes for production use
- **Secure Uploads**: Server-side validation and file type checking
- **Optimized Serving**: Images are served directly from the Next.js application

## 🎨 Customizing the Look
... (rest of the content)

- **Colors**: You can change the primary highlight color in `tailwind.config.ts` under `theme.extend.colors.accent`.
- **Fonts**: The project uses Google's Inter font. You can change this in `src/app/layout.tsx`.

## ♿ Accessibility & Performance

- **Images**: All images are optimized using the `Next/Image` component with responsive sizes.
- **Animations**: Uses `framer-motion` for smooth, hardware-accelerated transitions.
- **Contrast**: The design follows modern accessibility standards for readability.
- **SEO**: Meta tags and structured data are pre-configured in `src/app/layout.tsx`.
