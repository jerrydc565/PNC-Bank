# Complete Backend Deployment Guide

## How to Deploy Your Spring Boot Backend to Production

---

## Table of Contents

1. [Push Backend to GitHub](#part-1-push-backend-to-github)
2. [Deploy to Render (Free)](#part-2-deploy-to-render)
3. [Connect to Supabase Database](#part-3-configure-database)
4. [Update Frontend URLs](#part-4-update-frontend)
5. [Troubleshooting](#troubleshooting)

---

## Part 1: Push Backend to GitHub

### Step 1: Prepare Your Backend Project

First, make sure your backend is ready:

**Location:** `C:\fnc-bank\fnc-bank\`

**Required files:**

- ✅ `pom.xml` (Maven build file)
- ✅ `src/main/java/` (your Java code)
- ✅ `src/main/resources/application.properties`

---

### Step 2: Create `.gitignore` File

**Navigate to your backend folder:**

```powershell
cd C:\fnc-bank\fnc-bank
```

**Create `.gitignore` file to exclude sensitive/unnecessary files:**

Create a file named `.gitignore` with this content:

```gitignore
# Maven
target/
!.mvn/wrapper/maven-wrapper.jar
.mvn/

# IDE
.idea/
.vscode/
*.iml
*.ipr
*.iws
.project
.classpath
.settings/

# Sensitive files
application-local.properties
application-prod.properties
*.env
.env

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Build
*.class
*.jar
*.war
*.ear

# Temporary files
*.tmp
*.bak
*.swp
*~

# Node (if you have any frontend in same repo)
node_modules/
package-lock.json
```

---

### Step 3: Update `application.properties` for Production

**IMPORTANT:** Don't commit your database password directly!

**Option A: Use Environment Variables (Recommended)**

Edit `src/main/resources/application.properties`:

```properties
# Database Configuration (uses environment variables)
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Hibernate settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Server settings
server.port=${PORT:8080}

# CORS settings (important for production)
spring.web.cors.allowed-origins=https://your-frontend-domain.netlify.app,http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

**Option B: Keep it simple for now (we'll set env vars in Render)**

Just make sure you have:

```properties
spring.datasource.url=jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=your-password-here
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

---

### Step 4: Initialize Git Repository

```powershell
# Navigate to your backend folder
cd C:\fnc-bank\fnc-bank

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Spring Boot backend with PostgreSQL"
```

---

### Step 5: Create GitHub Repository

**Method 1: Using GitHub Website (Easiest)**

1. Go to https://github.com
2. Click the **"+"** icon (top-right) → **"New repository"**
3. Fill in:
   - **Repository name:** `pnc-bank-backend` (or `fnc-bank-backend`)
   - **Description:** "Spring Boot backend for PNC Bank application"
   - **Visibility:**
     - ✅ **Private** (recommended for production apps)
     - ⚠️ Public (only if you want others to see your code)
   - **DON'T** check "Add README" or ".gitignore" (we already have them)
4. Click **"Create repository"**

**After creating, you'll see this screen with commands. Copy the commands under "push an existing repository"**

---

### Step 6: Connect Local Repo to GitHub

**Copy the commands from GitHub (they'll look like this):**

```powershell
# Set the main branch
git branch -M main

# Add GitHub as remote origin
git remote add origin https://github.com/YOUR-USERNAME/pnc-bank-backend.git

# Push to GitHub
git push -u origin main
```

**Replace `YOUR-USERNAME` with your actual GitHub username!**

**Example:**

```powershell
git remote add origin https://github.com/jerrydc565/pnc-bank-backend.git
git push -u origin main
```

**If it asks for credentials:**

- Username: Your GitHub username
- Password: Use a **Personal Access Token** (NOT your GitHub password)

---

### Step 7: Create GitHub Personal Access Token (If Needed)

If you don't have a token:

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Fill in:
   - **Note:** "Backend Deployment"
   - **Expiration:** 90 days (or No expiration)
   - **Select scopes:**
     - ✅ `repo` (all)
     - ✅ `workflow`
4. Click **"Generate token"**
5. **COPY THE TOKEN** (you won't see it again!)
6. Use this token as your password when pushing to GitHub

---

### Step 8: Verify Upload

Go to your GitHub repository URL:

```
https://github.com/YOUR-USERNAME/pnc-bank-backend
```

You should see:

- ✅ `pom.xml`
- ✅ `src/` folder
- ✅ `.gitignore`
- ✅ Other backend files

❌ `target/` folder (should be ignored)
❌ `.idea/` or `.vscode/` (should be ignored)

---

## Part 2: Deploy to Render

### Step 1: Create Render Account

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with:
   - **GitHub** (easiest - recommended)
   - Google
   - Email

---

### Step 2: Create New Web Service

1. Click **"New +"** (top-right)
2. Select **"Web Service"**
3. Click **"Build and deploy from a Git repository"** → **"Next"**

---

### Step 3: Connect GitHub Repository

**If first time:**

1. Click **"Connect account"** under GitHub
2. Authorize Render to access your GitHub
3. Choose:
   - **All repositories**, OR
   - **Only select repositories** → Choose `pnc-bank-backend`

**Select your repository:**

1. Find `pnc-bank-backend` in the list
2. Click **"Connect"**

---

### Step 4: Configure Web Service

**Fill in these settings:**

| Field              | Value                                        |
| ------------------ | -------------------------------------------- |
| **Name**           | `pnc-bank-api` (or any name, must be unique) |
| **Region**         | Choose closest to you (e.g., Oregon USA)     |
| **Branch**         | `main`                                       |
| **Root Directory** | (leave blank)                                |
| **Runtime**        | `Docker` or `Java`                           |
| **Build Command**  | `./mvnw clean install -DskipTests`           |
| **Start Command**  | `java -jar target/signup-0.0.1-SNAPSHOT.jar` |

**⚠️ Important:** Your `.jar` file name might be different. Check your `pom.xml`:

```xml
<artifactId>signup</artifactId>
<version>0.0.1-SNAPSHOT</version>
```

So the jar will be: `target/signup-0.0.1-SNAPSHOT.jar`

**If your artifactId is different, update the start command accordingly!**

---

### Step 5: Configure Environment Variables

**Scroll down to "Environment Variables" section**

Click **"Add Environment Variable"** and add these:

| Key                 | Value                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------- |
| `DATABASE_URL`      | `jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require` |
| `DATABASE_USERNAME` | `postgres`                                                                            |
| `DATABASE_PASSWORD` | `your-supabase-password`                                                              |
| `JAVA_TOOL_OPTIONS` | `-Xmx512m`                                                                            |

**Get your Supabase connection details:**

1. Go to Supabase → Project Settings → Database
2. Copy:
   - **Host** (e.g., `aws-0-us-east-1.pooler.supabase.com`)
   - **Database** (usually `postgres`)
   - **Port** (use `5432` for Session mode)
   - **Password** (the one you created)

**Full DATABASE_URL format:**

```
jdbc:postgresql://[HOST]:5432/postgres?sslmode=require
```

**Example:**

```
jdbc:postgresql://db.gcrnyfousqsdtytptqav.supabase.co:5432/postgres?sslmode=require
```

**⚠️ CRITICAL: Use Port 5432 (Session mode)**

If you use port 6543 (Transaction mode), you'll get "prepared statement already exists" errors!

---

### Step 6: Choose Plan

**Free Plan (Perfect for development):**

- ✅ 750 hours/month (basically free forever for 1 app)
- ✅ Auto-sleep after 15 minutes of inactivity
- ✅ 512 MB RAM
- ⚠️ Spins down after inactivity (first request takes ~30 seconds to wake up)

Click **"Create Web Service"**

---

### Step 7: Monitor Deployment

**Watch the deploy logs:**

You'll see:

1. ⏳ Building... (downloading dependencies)
2. ⏳ `./mvnw clean install` (building your app)
3. ⏳ Starting service...
4. ✅ **"Your service is live 🎉"**

**Common build messages:**

```
[INFO] Building signup 0.0.1-SNAPSHOT
[INFO] Downloading dependencies...
[INFO] Compiling Java files...
[INFO] BUILD SUCCESS
Starting Java application...
Tomcat started on port(s): 8080
Started Application in 12.345 seconds
```

---

### Step 8: Get Your Backend URL

After successful deployment:

**Your backend URL will be:**

```
https://pnc-bank-api.onrender.com
```

**Or whatever name you chose:**

```
https://[your-service-name].onrender.com
```

**Test it in browser:**

```
https://pnc-bank-api.onrender.com/
```

You might see: "Whitelabel Error Page" (this is normal - means backend is running!)

---

## Part 3: Configure Database

### Update Supabase Connection Pooling

**IMPORTANT: Use Session Mode (Port 5432)**

1. Go to Supabase → Project Settings → Database
2. Under "Connection string", look for **Connection pooling**
3. Change mode to **Session** (port 5432)
4. Use this URL in Render environment variables:

```
jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
```

**Why?**

- Port 6543 (Transaction mode) = ❌ Causes prepared statement errors
- Port 5432 (Session mode) = ✅ Works perfectly with Hibernate

---

### Verify Database Tables

1. Go to Supabase → Table Editor
2. Make sure you have these tables:
   - ✅ `users`
   - ✅ `transactions`
   - ✅ `admins`
   - ✅ `chat_messages` (if using chat)
   - ✅ `chat_sessions` (if using chat)

If tables don't exist, run the SQL from `POSTGRESQL_MIGRATION_GUIDE.md`

---

## Part 4: Update Frontend

### Step 1: Create Environment Configuration

**Create a config file for API URLs:**

**File:** `src/config/api.js`

```javascript
// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/api/login`,
  signup: `${API_BASE_URL}/api/signup`,
  transactions: `${API_BASE_URL}/api/transactions`,
  transfer: `${API_BASE_URL}/api/transfer`,
  deposit: `${API_BASE_URL}/api/deposit`,
  // Add other endpoints...
};

export default API_BASE_URL;
```

---

### Step 2: Update All API Calls

**Find all files with API calls:**

```powershell
# Search for localhost:8080 in your frontend
cd "C:\Users\legit\OneDrive\Desktop\FC Bank\PNC-Bank"
Get-ChildItem -Recurse -Filter "*.jsx" | Select-String "localhost:8080"
```

**Files to update:**

- `src/pages/Login.jsx`
- `src/pages/Signup.jsx`
- `src/pages/Dashboard.jsx` (or UserHome.jsx)
- `src/pages/Payment.jsx`
- `src/Components/ChatWidget.jsx`
- Any other files with `fetch()` calls

---

### Step 3: Update Each File

**Option A: Direct URL replacement**

**Before (local):**

```javascript
const response = await fetch("http://localhost:8080/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
```

**After (production):**

```javascript
const response = await fetch("https://pnc-bank-api.onrender.com/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
```

**Option B: Use environment variables (Better)**

**Create `.env` file in frontend root:**

```env
VITE_API_URL=https://pnc-bank-api.onrender.com
```

**Update code:**

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const response = await fetch(`${API_URL}/api/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
```

---

### Step 4: Update CORS in Backend

**If you get CORS errors, add this to your Spring Boot backend:**

**Create:** `src/main/java/com/signup/config/CorsConfig.java`

```java
package com.signup.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(
                        "http://localhost:5173",
                        "http://localhost:3000",
                        "https://your-frontend.netlify.app",
                        "https://your-frontend.vercel.app"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

**Then redeploy:**

```powershell
cd C:\fnc-bank\fnc-bank
git add .
git commit -m "Add CORS configuration"
git push origin main
```

Render will automatically redeploy!

---

### Step 5: Deploy Frontend

**Option 1: Netlify (Easiest)**

1. Push frontend to GitHub (separate repo)
2. Go to https://netlify.com
3. Click "Add new site" → "Import from Git"
4. Choose your frontend repo
5. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Environment variables:
   - `VITE_API_URL` = `https://pnc-bank-api.onrender.com`
7. Click "Deploy"

**Option 2: Vercel**

1. Go to https://vercel.com
2. Import Git repository
3. Framework: Vite
4. Add environment variable: `VITE_API_URL`
5. Deploy

---

## Part 5: Testing Production

### Test Checklist

**1. Test Backend Directly**

```bash
# Health check
curl https://pnc-bank-api.onrender.com/

# Test login endpoint
curl -X POST https://pnc-bank-api.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'
```

**2. Test Frontend → Backend**

- ✅ Signup new user
- ✅ Login with user
- ✅ Make a deposit
- ✅ Transfer money
- ✅ View transaction history

**3. Check Logs**

- Render dashboard → Logs tab
- Look for errors

**4. Monitor Performance**

- First request might be slow (30s) if app was sleeping
- Subsequent requests should be fast

---

## Part 6: Continuous Deployment

### Auto-deploy on Git Push

**Render automatically redeploys when you push to GitHub!**

**Workflow:**

```powershell
# Make changes to your code
# Test locally
mvn spring-boot:run

# Commit and push
git add .
git commit -m "Add new feature"
git push origin main
```

**Render will:**

1. Detect the push
2. Automatically trigger a new build
3. Deploy the new version
4. Zero downtime deployment!

---

## Troubleshooting

### Error: "Port already in use"

**Solution:** Render assigns the port automatically. Make sure your code uses:

```properties
server.port=${PORT:8080}
```

Or in Java:

```java
@Value("${PORT:8080}")
private int port;
```

---

### Error: "Application failed to respond"

**Check Render logs:**

1. Go to Render dashboard
2. Click on your service
3. Click "Logs" tab
4. Look for errors

**Common issues:**

- ❌ Wrong database URL
- ❌ Wrong jar file name in start command
- ❌ Missing environment variables

---

### Error: "Prepared statement already exists"

**Solution:** Change database port from 6543 to 5432

```
# Wrong (Transaction mode):
jdbc:postgresql://host:6543/postgres

# Correct (Session mode):
jdbc:postgresql://host:5432/postgres
```

Update environment variable in Render and redeploy.

---

### Error: "CORS policy blocked"

**Solution:** Add CORS configuration (see Part 4, Step 4)

Or add this annotation to your controllers:

```java
@CrossOrigin(origins = {"http://localhost:5173", "https://your-frontend.com"})
@RestController
public class YourController {
    // ...
}
```

---

### App is sleeping (takes 30s to wake up)

**This is normal on Render free tier!**

**Solutions:**

1. Keep app alive with a ping service:
   - https://cron-job.org (free)
   - Ping your app every 14 minutes
2. Upgrade to paid plan ($7/month) - never sleeps

3. Use UptimeRobot (free):
   - https://uptimerobot.com
   - Monitor your app every 5 minutes

---

### Database connection refused

**Check:**

1. ✅ Supabase database is not paused
2. ✅ Connection string is correct
3. ✅ Password is correct
4. ✅ Using `?sslmode=require` in URL

---

### Frontend can't connect to backend

**Check:**

1. ✅ Backend URL is correct in frontend code
2. ✅ CORS is configured
3. ✅ Backend is running (not sleeping)
4. ✅ Network requests in browser DevTools

**Test backend directly:**

```
https://your-backend.onrender.com/api/login
```

---

## Summary Checklist

### Backend Deployment:

- [ ] Create `.gitignore` file
- [ ] Update `application.properties` for production
- [ ] Push to GitHub
- [ ] Create Render account
- [ ] Create web service on Render
- [ ] Set environment variables (DATABASE_URL, etc.)
- [ ] Wait for deployment to complete
- [ ] Test backend URL

### Database Setup:

- [ ] Supabase database created
- [ ] Tables created
- [ ] Using Session mode pooler (port 5432)
- [ ] Connection string correct

### Frontend Update:

- [ ] Replace all `localhost:8080` with production URL
- [ ] Add CORS configuration to backend
- [ ] Deploy frontend to Netlify/Vercel
- [ ] Set environment variables

### Testing:

- [ ] Signup works
- [ ] Login works
- [ ] Transactions work
- [ ] No CORS errors
- [ ] No database errors

---

## Useful Commands

### Git Commands

```powershell
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main

# Check remote
git remote -v

# View commit history
git log --oneline
```

### Maven Commands

```powershell
# Clean build
mvn clean install

# Run locally
mvn spring-boot:run

# Skip tests
mvn clean install -DskipTests

# Package jar
mvn package
```

---

## Next Steps

1. **Monitor your app** - Check Render logs regularly
2. **Set up monitoring** - Use UptimeRobot to keep app awake
3. **Secure your app** - Add authentication, rate limiting
4. **Add error tracking** - Use Sentry or similar
5. **Set up CI/CD** - GitHub Actions for automated testing

---

## Important URLs

- **Render Dashboard:** https://dashboard.render.com
- **Supabase Dashboard:** https://app.supabase.com
- **Your Backend:** `https://[your-service].onrender.com`
- **GitHub Repo:** `https://github.com/[username]/pnc-bank-backend`

---

## Need More Help?

Common issues and solutions are in the Troubleshooting section above.

Remember:

1. **Always test locally first** before pushing to GitHub
2. **Check Render logs** when something doesn't work
3. **Use environment variables** for sensitive data
4. **Keep your database password secure** - never commit it to GitHub

**Your backend is now deployed! 🚀**
