# Deployment Guide

This guide will help you deploy your e-commerce application on:
- **Angular Frontend** → Vercel
- **Spring Boot Backend** → Render
- **MySQL Database** → Railway

---

## Prerequisites

- GitHub account with your repository pushed
- Accounts on Vercel, Render, and Railway
- Application secrets (Razorpay keys, OpenAI API key)

---

## Step 1: Deploy MySQL on Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app) and sign up/login

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo" or "Empty Project"

3. **Add MySQL Database**
   - Click "+ New" → "Database" → "MySQL"
   - Railway will create a MySQL instance

4. **Get Database Connection Details**
   - Click on your MySQL database
   - Go to "Variables" tab
   - Railway automatically provides these environment variables:
     - `MYSQLHOST`
     - `MYSQLPORT`
     - `MYSQLUSER`
     - `MYSQLPASSWORD`
     - `MYSQLDATABASE`
     - `MYSQL_URL` (full connection string)

5. **Update Railway Configuration**
   - Your backend is configured to use these environment variables automatically

---

## Step 2: Deploy Spring Boot Backend on Render

1. **Create Render Account**
   - Go to [render.com](https://render.com) and sign up/login

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder as the root directory

3. **Configure Build Settings**
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/FinalProject-0.0.1-SNAPSHOT.jar`
   - **Runtime**: Java 17

4. **Add Environment Variables**
   Add these environment variables in Render:
   
   ```
   MYSQLHOST=your-railway-mysql-host.railway.app
   MYSQLPORT=3306
   MYSQLUSER=your_railway_username
   MYSQLPASSWORD=your_railway_password
   MYSQLDATABASE=ebdb
   MYSQL_URL=jdbc:mysql://your-railway-mysql-host.railway.app:3306/ebdb
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   OPENAI_API_KEY=your_openai_api_key
   SPRING_PROFILES_ACTIVE=prod
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your Spring Boot app
   - Wait for deployment to complete (green status)

6. **Get Backend URL**
   - Copy the URL from Render (e.g., `https://your-app.onrender.com`)
   - You'll need this for the Angular frontend

---

## Step 3: Deploy Angular Frontend on Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com) and sign up/login

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory

3. **Configure Build Settings**
   - **Framework Preset**: Angular
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   Add this environment variable in Vercel:
   
   ```
   API_URL=https://your-render-app-url.onrender.com/api
   ```

5. **Update Production Environment**
   - Before deploying, update `frontend/src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-actual-render-url.onrender.com/api'
   };
   ```

6. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your Angular app
   - Wait for deployment to complete

7. **Get Frontend URL**
   - Copy the URL from Vercel (e.g., `https://your-app.vercel.app`)

---

## Step 4: Update CORS Configuration

After deployment, update the CORS configuration in your backend to allow the Vercel domain:

1. Go to Render dashboard
2. Add environment variable:
   ```
   SPRING_MVC_CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```
3. Redeploy the backend

---

## Step 5: Update Backend CORS in application.properties

Update `backend/src/main/resources/application.properties`:

```properties
spring.mvc.cors.allowed-origins=https://your-vercel-app.vercel.app,https://your-vercel-app.vercel.app
```

---

## Verification Steps

1. **Test Database Connection**
   - Check Railway dashboard for database status
   - Verify connection string is correct

2. **Test Backend API**
   - Visit `https://your-render-app.onrender.com/api/health` (if you have a health endpoint)
   - Check Render logs for any errors

3. **Test Frontend**
   - Visit `https://your-vercel-app.vercel.app`
   - Test user registration, login, and product browsing
   - Verify API calls are working (check browser console)

---

## Troubleshooting

### Backend Issues
- **Database Connection Error**: Verify Railway database credentials in Render environment variables
- **Port Issues**: Ensure backend uses port 5000 (or the port assigned by Render)
- **Build Failures**: Check Render build logs for dependency issues

### Frontend Issues
- **API Connection Error**: Verify API_URL environment variable in Vercel
- **CORS Error**: Ensure backend CORS allows your Vercel domain
- **Build Failures**: Check Vercel build logs for Angular compilation errors

### Database Issues
- **Connection Timeout**: Check Railway database status
- **Schema Issues**: Ensure `spring.jpa.hibernate.ddl-auto=update` is set in production

---

## Cost Summary

- **Vercel**: Free tier available (sufficient for most projects)
- **Render**: Free tier available (with limited resources)
- **Railway**: Free tier available ($5 free credit/month)

---

## Post-Deployment Checklist

- [ ] Update Razorpay to production mode
- [ ] Set up SSL/HTTPS (automatic on Vercel and Render)
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and logging
- [ ] Test payment integration in production
- [ ] Update CORS settings for production domains
- [ ] Remove sensitive data from code (use environment variables)

---

## Notes

- All platforms provide free tiers suitable for development and small production apps
- Environment variables are critical for security - never commit secrets to Git
- Each platform has automatic SSL/HTTPS
- Consider setting up CI/CD pipelines for automated deployments
