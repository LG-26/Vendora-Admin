# Setup Guide - Vendora Admin Dashboard

## Next Steps to Run Your Application

### 1. Create Environment Variables File

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/e-commerce
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/e-commerce

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here-generate-a-random-string
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials (for login)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Quick Setup Tips:**
- **NEXTAUTH_SECRET**: Generate a random string (you can use: `openssl rand -base64 32` or any random string generator)
- **MONGODB_URI**: Use MongoDB Atlas (free tier) or local MongoDB instance
- **Cloudinary**: Sign up at https://cloudinary.com (free tier available) to get your credentials

### 2. Install Dependencies (if not already done)

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

### 4. Access the Application

- **Home Page**: http://localhost:3000
- **Login Page**: http://localhost:3000/login
- **Admin Dashboard**: http://localhost:3000/admin (requires login)

### 5. Login Credentials

Use the credentials you set in `.env.local`:
- Email: Value of `ADMIN_EMAIL`
- Password: Value of `ADMIN_PASSWORD`

## Features Available

✅ **Frontend Updates Completed:**
- Modern landing page
- Styled login page
- Enhanced admin dashboard with sidebar navigation
- Product management (list, add, edit, delete)
- Stock tracking and charts
- Image uploads via Cloudinary
- Responsive design with Tailwind CSS

## Troubleshooting

**Tailwind CSS not working?**
- Make sure `postcss.config.mjs` exists
- Restart the dev server after configuration changes

**MongoDB connection error?**
- Check your `MONGODB_URI` is correct
- Make sure MongoDB is running (if using local)
- For Atlas: Check your IP is whitelisted

**Image uploads not working?**
- Verify Cloudinary credentials are correct
- Check Cloudinary dashboard for upload settings

**Authentication issues?**
- Make sure `NEXTAUTH_SECRET` is set
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` match your login attempt

