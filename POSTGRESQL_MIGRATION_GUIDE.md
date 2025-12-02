# PostgreSQL Migration Guide for PNC Bank

## Complete step-by-step guide to migrate from SQL Server to PostgreSQL

---

## Part 1: Database Migration

### Step 1: Export Your Current SQL Server Data

```sql
-- In SQL Server Management Studio, run these queries to get your data:

-- Export users table
SELECT * FROM users;

-- Export transactions table
SELECT * FROM transactions;

-- Export chat_messages table (if exists)
SELECT * FROM chat_messages;

-- Export chat_sessions table (if exists)
SELECT * FROM chat_sessions;

-- Export admin table (if exists)
SELECT * FROM admin;
```

**Save the results as CSV files or copy to Excel**

---

### Step 2: Create PostgreSQL Database

#### Option A: Using Supabase (Free - Recommended)

1. Go to https://supabase.com
2. Click "Start your project"
3. Create account (no credit card needed)
4. Click "New project"
5. Fill in:
   - **Name**: PNC-Bank
   - **Database Password**: (create a strong password - SAVE THIS!)
   - **Region**: Choose closest to you
6. Click "Create new project" (wait 2-3 minutes)

#### Option B: Using Neon (Free Alternative)

1. Go to https://neon.tech
2. Sign up with GitHub/Google
3. Create new project: "PNC-Bank"
4. Save connection string

---

### Step 3: Create PostgreSQL Tables

After your database is created, go to **SQL Editor** in Supabase/Neon and run:

```sql
-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    second_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    account_number VARCHAR(16) UNIQUE,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    balance_after DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'APPROVED',
    approved_at TIMESTAMP NULL,
    rejected_at TIMESTAMP NULL,
    approved_by BIGINT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create chat_messages table (if you use chat)
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    sender VARCHAR(20) NOT NULL, -- 'user' or 'admin'
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create chat_sessions table (if you use chat)
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    last_message TEXT,
    last_message_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unread_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create admins table
CREATE TABLE admins (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp DESC);
CREATE INDEX idx_chat_sessions_last_message_time ON chat_sessions(last_message_time DESC);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_account_number ON users(account_number);
CREATE INDEX idx_admins_username ON admins(username);
```

---

### Step 4: Import Your Data

**Method 1: Using Supabase Table Editor**

1. Go to Table Editor
2. Click on "users" table
3. Click "Insert" → "Insert row"
4. Add your users manually (or use CSV import if available)

**Method 2: Using SQL INSERT (Faster)**

````sql
-- Example: Insert your existing users
INSERT INTO users (first_name, second_name, email, password, account_number, balance)
VALUES
    ('John', 'Doe', 'john@example.com', 'hashed_password', '2025120012345678', 5000.00),
    ('Jane', 'Smith', 'jane@example.com', 'hashed_password', '2025120087654321', 3000.00);
-- Add all your users...

-- Example: Insert transactions
INSERT INTO transactions (user_id, transaction_type, amount, description, balance_after, status)
VALUES
    (1, 'DEPOSIT', 1000.00, 'Initial deposit', 1000.00, 'APPROVED'),
    (1, 'WITHDRAWAL', 500.00, 'ATM withdrawal', 500.00, 'APPROVED');
-- Add all your transactions...-- Example: Insert admin users (from your SQL Server)
INSERT INTO admins (username, password_hash)
VALUES
    ('admin', 'admin123');
-- Add all your admin users...
```---

## Part 2: Backend Code Changes

### Step 1: Update `pom.xml`

Remove SQL Server dependency and add PostgreSQL:

```xml
<dependencies>
    <!-- Remove this -->
    <!-- <dependency>
        <groupId>com.microsoft.sqlserver</groupId>
        <artifactId>mssql-jdbc</artifactId>
        <scope>runtime</scope>
    </dependency> -->

    <!-- Add PostgreSQL -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Keep all other dependencies the same -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
````

---

### Step 2: Update `application.properties`

**Get your connection details from Supabase:**

1. Go to Project Settings → Database
2. Copy the connection string

**Replace your entire database configuration:**

```properties
# FROM (SQL Server) - DELETE THIS:
# spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=SignupDB;encrypt=true;trustServerCertificate=true
# spring.datasource.username=sa
# spring.datasource.password=your-password
# spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
# spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect

# TO (PostgreSQL) - USE THIS:
spring.datasource.url=jdbc:postgresql://[YOUR-SUPABASE-HOST]:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=[YOUR-DATABASE-PASSWORD]
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Hibernate settings (keep these)
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Server settings (keep these)
server.port=8080
```

**Example with real Supabase connection:**

```properties
spring.datasource.url=jdbc:postgresql://db.abc123xyz.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=YourStrongPassword123!
```

---

### Step 3: Update Entity Classes (If Needed)

**User.java** - Change column names to match PostgreSQL conventions:

```java
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Works for both
    @Column(name = "user_id")  // Match PostgreSQL table
    private Long userId;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "second_name", nullable = false)
    private String secondName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "account_number", unique = true, length = 16)
    private String accountNumber;

    @Column(precision = 15, scale = 2)
    private Double balance = 0.0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and setters...
}
```

**Transaction.java:**

````java
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "transaction_type", nullable = false, length = 50)
    private String transactionType; // "DEPOSIT", "WITHDRAWAL", etc.

    @Column(nullable = false, precision = 10, scale = 2)
    private Double amount;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "balance_after", precision = 10, scale = 2)
    private Double balanceAfter;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(length = 20)
    private String status = "APPROVED";

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;

    @Column(name = "approved_by")
    private Long approvedBy;

    // Getters and setters...
}
```

**Admin.java:**

```java
@Entity
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "username", unique = true, nullable = false, length = 50)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
```

---

### Step 4: Minor Code Changes (If Any)

**Most of your code will work unchanged**, but watch for:

#### A. Date Functions

```java
// SQL Server:
// query.setDate(1, new Date(System.currentTimeMillis()));

// PostgreSQL (same - no change needed):
query.setDate(1, new Date(System.currentTimeMillis()));
````

#### B. String Concatenation in Queries

```java
// Both work the same - no changes needed
String query = "SELECT * FROM users WHERE email = ?";
```

#### C. Account Number Generation

```java
// Your existing method works unchanged:
public String generateAccountNumber() {
    LocalDateTime now = LocalDateTime.now();
    String yearMonth = String.format("%04d%02d",
        now.getYear(), now.getMonthValue());

    Random random = new Random();
    String randomDigits = String.format("%08d",
        random.nextInt(100000000));

    String baseNumber = yearMonth + randomDigits;
    int checksum = calculateChecksum(baseNumber);

    return baseNumber + String.format("%02d", checksum);
}
```

---

### Step 5: Update Frontend API URLs (If Hosting Backend)

If you deploy backend to a platform, update these files:

**Current (local):**

```javascript
const response = await fetch("http://localhost:8080/api/login", {
```

**After deployment (example with Render):**

```javascript
const response = await fetch("https://your-backend.onrender.com/api/login", {
```

**Files to update:**

- `src/pages/Login.jsx`
- `src/pages/Signup.jsx`
- `src/pages/Dashboard.jsx`
- `src/services/api.js` (if exists)
- `src/Components/ChatWidget.jsx`

---

## Part 3: Testing the Migration

### Step 1: Clean Build

```bash
# In your backend project folder:
mvn clean install
```

### Step 2: Run Backend

```bash
mvn spring-boot:run
```

**Check console for:**

- ✅ "Hikari Pool started" (database connection)
- ✅ "Started Application in X seconds"
- ❌ No "SQLException" or connection errors

### Step 3: Test Endpoints

**Test 1: Create new user (Signup)**

```bash
POST http://localhost:8080/api/signup
{
  "firstName": "Test",
  "secondName": "User",
  "email": "test@example.com",
  "password": "Test@123"
}
```

**Test 2: Login**

```bash
POST http://localhost:8080/api/login
{
  "email": "test@example.com",
  "password": "Test@123"
}
```

**Test 3: Check database**
Go to Supabase → Table Editor → users table

- Should see the new test user with account number

---

## Part 4: Deployment (Free Hosting)

### Option 1: Backend on Render + Database on Supabase (100% Free)

**1. Push your backend to GitHub**

```bash
cd your-backend-folder
git init
git add .
git commit -m "Migrate to PostgreSQL"
git branch -M main
git remote add origin https://github.com/yourusername/pnc-backend.git
git push -u origin main
```

**2. Deploy to Render**

1. Go to https://render.com
2. Sign up/login
3. Click "New +" → "Web Service"
4. Connect GitHub repository
5. Configure:
   - **Name**: pnc-bank-backend
   - **Environment**: Java
   - **Build Command**: `./mvnw clean install`
   - **Start Command**: `java -jar target/your-app-name.jar`
6. Add Environment Variables:
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://db.abc.supabase.co:5432/postgres
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=YourPassword123!
   ```
7. Click "Create Web Service"

**3. Update Frontend URLs**
Replace all `http://localhost:8080` with `https://your-backend.onrender.com`

---

## Quick Reference: Key Differences

| Feature            | SQL Server          | PostgreSQL                     |
| ------------------ | ------------------- | ------------------------------ |
| **Auto Increment** | `IDENTITY`          | `SERIAL` or `IDENTITY`         |
| **Current Time**   | `GETDATE()`         | `NOW()` or `CURRENT_TIMESTAMP` |
| **Strings**        | `NVARCHAR(MAX)`     | `TEXT`                         |
| **Dialect**        | `SQLServerDialect`  | `PostgreSQLDialect`            |
| **Driver**         | `mssql-jdbc`        | `postgresql`                   |
| **Port**           | 1433                | 5432                           |
| **Cost**           | $5-10/month minimum | **FREE**                       |

---

## Troubleshooting

### Error: "org.postgresql.Driver not found"

**Solution:** Run `mvn clean install` to download PostgreSQL driver

### Error: "Connection refused"

**Solution:**

1. Check your Supabase connection string is correct
2. Ensure database is not paused (free tier pauses after inactivity)
3. Check firewall/network settings

### Error: "password authentication failed"

**Solution:** Double-check your database password in application.properties

### Error: "relation 'users' does not exist"

**Solution:**

1. Change `spring.jpa.hibernate.ddl-auto=update` to `create` (first run only)
2. Or manually create tables using SQL in Step 3

---

## Summary: What You Need to Do

### Backend Changes:

1. ✅ Update `pom.xml` - remove SQL Server, add PostgreSQL
2. ✅ Update `application.properties` - new connection string
3. ✅ Run `mvn clean install`
4. ✅ Test locally

### Database Changes:

1. ✅ Create free PostgreSQL database on Supabase
2. ✅ Run table creation scripts
3. ✅ Import your existing data (users, transactions, etc.)

### Deployment (Optional):

1. ✅ Push backend to GitHub
2. ✅ Deploy to Render (free)
3. ✅ Update frontend API URLs

---

## Need Help?

The main changes are in 2 files:

1. **pom.xml** - Change dependency
2. **application.properties** - Change connection string

Everything else in your Java code stays the same! 🎉
