# Wedding Photo Sharing App

A mobile-friendly, wedding-themed photo sharing application where guests can upload images directly from their device camera or gallery, tagging each photo with their name.

## Features

- Take photos using device camera (front or back)
- Upload images from gallery
- Photo tagging with guest names
- Public gallery with search by uploader name
- Admin panel for content moderation
- Secure photo storage with Cloudinary

## Tech Stack

### Frontend
- React with TypeScript
- Zustand for state management
- React Router for navigation
- TailwindCSS for styling
- Vite as the build tool

### Backend
- Node.js and Express
- MongoDB for metadata storage
- Cloudinary for image storage
- Express Session for admin authentication
- Multer for file uploads

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas account
- Cloudinary account

### Backend Setup
1. Navigate to the server directory:
   ```
   cd server
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file (based on `.env.example`) with your credentials:
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ADMIN_PASSWORD=admin@123
   SESSION_SECRET=your_session_secret
   FRONTEND_URL=http://localhost:3000
   ```
4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup
1. From the root directory, install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file with the API URL:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. Start the frontend development server:
   ```
   npm run dev
   ```

### Running Both Together
To run both frontend and backend concurrently:
```
npm run dev:all
```

## Usage

- On first visit, you'll be prompted to enter a name
- You can choose to take photos with your camera or upload from gallery
- The gallery page shows all uploaded photos with search functionality
- Admin panel is accessible at `/admin` with password `admin@123`

## Photo Upload Flow

1. Enter guest name (stored in localStorage)
2. Choose camera or upload option
3. Take a photo or select from gallery
4. Review and upload
5. Photo is uploaded to Cloudinary and metadata to MongoDB

## Admin Features

- Password-protected admin panel
- View all uploaded photos
- Delete inappropriate content
- Photos deleted from both Cloudinary and MongoDB

This project is a Node.js backend for a mobile-friendly, wedding-themed photo sharing application. Guests can upload images directly from their device camera or gallery, tagging each photo with their name. The system uses Cloudinary for storing image files and MongoDB for storing metadata like uploader name, image URL, and timestamp. Guests are required to input a name before uploading, and each image is tied to the submitted name. Multiple guests can use the same name, and names are not required to be unique. Once uploaded, images cannot be deleted by guests. An admin panel is included for managing content, allowing authorized users to view and delete images.

The backend is built with Node.js and Express, and supports file uploads through multipart form data. The images are uploaded to Cloudinary, and metadata is saved in a MongoDB database. Admin access is protected via a simple password authentication (defined in environment variables). Guests can also browse all uploaded images through a public gallery endpoint, with a search feature that allows filtering by uploader name.

The project is organized with clean separation between routes, controllers, models, and configuration files. A .env file is used to securely store sensitive information like MongoDB URI, Cloudinary credentials, and the admin password. To run the backend locally, you need to clone the repository, install dependencies with npm install, and start the server using npm run dev. The default server runs on port 5000.

Environment variables required in the .env file include:

PORT: (e.g., 5000)

MONGO_URI: your MongoDB connection string

CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET: credentials from your Cloudinary account

ADMIN_PASSWORD: a password for admin login

API endpoints include:

POST /api/upload – uploads an image and stores metadata.

GET /api/gallery – returns all uploaded images.

POST /api/admin/login – logs into the admin panel.

GET /api/admin/uploads – returns all uploads (admin only).

DELETE /api/admin/delete/:id – deletes a specific image and its metadata.

This backend integrates smoothly with a React frontend and includes CORS configuration to support cross-origin requests. You can customize the allowed origin in the server.js file. Cloudinary is used to manage media files, and MongoDB stores upload records.

This backend is designed for scalability and ease of use, and is perfect for capturing and managing wedding memories in a beautiful, accessible way.








