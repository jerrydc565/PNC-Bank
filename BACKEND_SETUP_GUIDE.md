# Complete Backend Setup Guide for Admin System

## How to Access Admin Dashboard

### Frontend Access:

1. Start your React app: `npm run dev`
2. Go to: **`http://localhost:5173/admin/login`**
3. Login with credentials you'll create in backend (e.g., username: `admin`, password: `admin123`)
4. After login, you'll be redirected to: **`http://localhost:5173/admin/dashboard`**

---

## Backend Setup - Step by Step

### Step 1: Update Database Schema

#### A. Add Status Column to Transactions Table

Run this SQL in your SQL Server database:

```sql
-- Add status column to existing transactions table
ALTER TABLE transactions
ADD status VARCHAR(20) DEFAULT 'APPROVED',
    approved_at DATETIME2 NULL,
    rejected_at DATETIME2 NULL,
    approved_by BIGINT NULL;
```

#### B. Create Admin Table

```sql
-- Create admin table
CREATE TABLE admins (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Insert default admin (password: admin123, you should hash this!)
-- For now, using plain text for testing - CHANGE IN PRODUCTION!
INSERT INTO admins (username, password_hash)
VALUES ('admin', 'admin123');
```

---

### Step 2: Create Java Entities

#### A. Create `TransactionStatus.java` (Enum)

**Location:** `src/main/java/com/signup/fnc_bank/model/TransactionStatus.java`

```java
package com.signup.fnc_bank.model;

public enum TransactionStatus {
    PENDING,
    APPROVED,
    REJECTED
}
```

#### B. Update `Transaction.java` Entity

**Location:** `src/main/java/com/signup/fnc_bank/model/Transaction.java`

**Add these new fields to your existing Transaction.java:**

```java
package com.signup.fnc_bank.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    @Column(nullable = false)
    private Double amount;

    private String description;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private Double balanceAfter;

    // NEW FIELDS FOR ADMIN APPROVAL SYSTEM
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TransactionStatus status = TransactionStatus.APPROVED;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;

    @Column(name = "approved_by")
    private Long approvedBy;

    // Existing Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Double getBalanceAfter() { return balanceAfter; }
    public void setBalanceAfter(Double balanceAfter) { this.balanceAfter = balanceAfter; }

    // NEW GETTERS AND SETTERS
    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { this.status = status; }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

    public LocalDateTime getRejectedAt() { return rejectedAt; }
    public void setRejectedAt(LocalDateTime rejectedAt) { this.rejectedAt = rejectedAt; }

    public Long getApprovedBy() { return approvedBy; }
    public void setApprovedBy(Long approvedBy) { this.approvedBy = approvedBy; }
}
```

#### C. Create `Admin.java` Entity

**Location:** `src/main/java/com/signup/fnc_bank/model/Admin.java`

```java
package com.signup.fnc_bank.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters and Setters
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

### Step 3: Create Repositories

#### A. Create `AdminRepository.java`

**Location:** `src/main/java/com/signup/fnc_bank/repository/AdminRepository.java`

```java
package com.signup.fnc_bank.repository;

import com.signup.fnc_bank.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByUsername(String username);
}
```

#### B. Update `TransactionRepository.java`

**Location:** `src/main/java/com/signup/fnc_bank/repository/TransactionRepository.java`

**Add these methods to your existing repository:**

```java
package com.signup.fnc_bank.repository;

import com.signup.fnc_bank.model.Transaction;
import com.signup.fnc_bank.model.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Existing method
    Transaction findByUserIdOrderByTimestampDesc(Long userId);

    // NEW METHODS FOR ADMIN SYSTEM
    List<Transaction> findByUserId(Long userId);
    List<Transaction> findByStatus(TransactionStatus status);
    List<Transaction> findTop50ByOrderByTimestampDesc();
}
```

---

### Step 4: Create DTOs (Data Transfer Objects)

#### A. Create `AdminLoginRequest.java`

**Location:** `src/main/java/com/signup/fnc_bank/dto/AdminLoginRequest.java`

```java
package com.signup.fnc_bank.dto;

public class AdminLoginRequest {
    private String username;
    private String password;

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
```

#### B. Create `AdminLoginResponse.java`

**Location:** `src/main/java/com/signup/fnc_bank/dto/AdminLoginResponse.java`

```java
package com.signup.fnc_bank.dto;

public class AdminLoginResponse {
    private String token;
    private Long adminId;
    private String username;

    public AdminLoginResponse(String token, Long adminId, String username) {
        this.token = token;
        this.adminId = adminId;
        this.username = username;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getAdminId() { return adminId; }
    public void setAdminId(Long adminId) { this.adminId = adminId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}
```

#### C. Create `AdminStats.java`

**Location:** `src/main/java/com/signup/fnc_bank/dto/AdminStats.java`

```java
package com.signup.fnc_bank.dto;

public class AdminStats {
    private long totalUsers;
    private long totalTransactions;
    private long activeAccounts;
    private long pendingTransactions;

    public AdminStats(long totalUsers, long totalTransactions,
                     long activeAccounts, long pendingTransactions) {
        this.totalUsers = totalUsers;
        this.totalTransactions = totalTransactions;
        this.activeAccounts = activeAccounts;
        this.pendingTransactions = pendingTransactions;
    }

    // Getters and Setters
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public long getActiveAccounts() { return activeAccounts; }
    public void setActiveAccounts(long activeAccounts) {
        this.activeAccounts = activeAccounts;
    }

    public long getPendingTransactions() { return pendingTransactions; }
    public void setPendingTransactions(long pendingTransactions) {
        this.pendingTransactions = pendingTransactions;
    }
}
```

---

### Step 5: Create Admin Service

**Location:** `src/main/java/com/signup/fnc_bank/service/AdminService.java`

```java
package com.signup.fnc_bank.service;

import com.signup.fnc_bank.dto.AdminStats;
import com.signup.fnc_bank.model.Admin;
import com.signup.fnc_bank.model.Transaction;
import com.signup.fnc_bank.model.User;
import com.signup.fnc_bank.model.TransactionStatus;
import com.signup.fnc_bank.model.TransactionType;
import com.signup.fnc_bank.repository.AdminRepository;
import com.signup.fnc_bank.repository.TransactionRepository;
import com.signup.fnc_bank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    public Optional<Admin> authenticateAdmin(String username, String password) {
        Optional<Admin> admin = adminRepository.findByUsername(username);
        if (admin.isPresent() && admin.get().getPasswordHash().equals(password)) {
            return admin;
        }
        return Optional.empty();
    }

    public AdminStats getStats() {
        long totalUsers = userRepository.count();
        long totalTransactions = transactionRepository.count();
        long activeAccounts = userRepository.count(); // All users are active for now
        long pendingTransactions = transactionRepository
            .findByStatus(TransactionStatus.PENDING).size();

        return new AdminStats(totalUsers, totalTransactions,
                            activeAccounts, pendingTransactions);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Transaction> getPendingTransactions() {
        return transactionRepository.findByStatus(TransactionStatus.PENDING);
    }

    public List<Transaction> getRecentTransactions() {
        return transactionRepository.findTop50ByOrderByTimestampDesc();
    }

    @Transactional
    public Transaction approveTransaction(Long transactionId, Long adminId) {
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (transaction.getStatus() != TransactionStatus.PENDING) {
            throw new RuntimeException("Transaction is not pending");
        }

        // Get user and update balance
        // Convert Long to Integer if your User ID is Integer type
        User user = userRepository.findById(transaction.getUserId().intValue())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (transaction.getTransactionType() == TransactionType.DEPOSIT) {
            user.setBalance(user.getBalance() + transaction.getAmount());
        } else if (transaction.getTransactionType() == TransactionType.WITHDRAW ||
                   transaction.getTransactionType() == TransactionType.TRANSFER) {
            if (user.getBalance() < transaction.getAmount()) {
                throw new RuntimeException("Insufficient funds");
            }
            user.setBalance(user.getBalance() - transaction.getAmount());
        }

        userRepository.save(user);

        // Update transaction status
        transaction.setStatus(TransactionStatus.APPROVED);
        transaction.setApprovedAt(LocalDateTime.now());
        transaction.setApprovedBy(adminId);

        // Also update balanceAfter field
        transaction.setBalanceAfter(user.getBalance());

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction rejectTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (transaction.getStatus() != TransactionStatus.PENDING) {
            throw new RuntimeException("Transaction is not pending");
        }

        transaction.setStatus(TransactionStatus.REJECTED);
        transaction.setRejectedAt(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }
}
```

---

### Step 6: Create Admin Controller

**Location:** `src/main/java/com/signup/fnc_bank/controller/AdminController.java`

```java
package com.signup.fnc_bank.controller;

import com.signup.fnc_bank.dto.AdminLoginRequest;
import com.signup.fnc_bank.dto.AdminLoginResponse;
import com.signup.fnc_bank.dto.AdminStats;
import com.signup.fnc_bank.model.Admin;
import com.signup.fnc_bank.model.Transaction;
import com.signup.fnc_bank.model.User;
import com.signup.fnc_bank.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
        Optional<Admin> admin = adminService.authenticateAdmin(
            request.getUsername(),
            request.getPassword()
        );

        if (admin.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials");
        }

        // Generate a simple token (use JWT in production!)
        String token = "admin-" + UUID.randomUUID().toString();

        AdminLoginResponse response = new AdminLoginResponse(
            token,
            admin.get().getId(),
            admin.get().getUsername()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStats> getStats(
            @RequestHeader(value = "Authorization", required = false) String token) {
        // In production, validate token here
        AdminStats stats = adminService.getStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(
            @RequestHeader(value = "Authorization", required = false) String token) {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/transactions/pending")
    public ResponseEntity<List<Transaction>> getPendingTransactions(
            @RequestHeader(value = "Authorization", required = false) String token) {
        List<Transaction> transactions = adminService.getPendingTransactions();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/transactions/recent")
    public ResponseEntity<List<Transaction>> getRecentTransactions(
            @RequestHeader(value = "Authorization", required = false) String token) {
        List<Transaction> transactions = adminService.getRecentTransactions();
        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/transactions/{id}/approve")
    public ResponseEntity<?> approveTransaction(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            // Extract adminId from token (simplified - use JWT in production)
            Long adminId = 1L; // Default admin

            Transaction transaction = adminService.approveTransaction(id, adminId);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/transactions/{id}/reject")
    public ResponseEntity<?> rejectTransaction(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            Transaction transaction = adminService.rejectTransaction(id);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
```

---

### Step 7: Update Transaction Controller

**Location:** `src/main/java/com/signup/fnc_bank/controller/TransactionController.java`

**Add this new endpoint to your existing TransactionController:**

```java
@PostMapping("/transactions/pending")
public ResponseEntity<?> createPendingTransaction(@RequestBody TransactionRequest request) {
    try {
        Transaction transaction = new Transaction();
        transaction.setUserId(request.getUserId());
        transaction.setTransactionType(request.getTransactionType());
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setStatus(TransactionStatus.PENDING); // Set as pending for admin approval
        transaction.setTimestamp(LocalDateTime.now());

        // Don't update balance yet - wait for admin approval
        Transaction saved = transactionRepository.save(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
```

**Also add these imports at the top of your TransactionController:**

```java
import com.signup.fnc_bank.model.TransactionStatus;
import com.signup.fnc_bank.repository.TransactionRepository;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
```

**And inject TransactionRepository in your TransactionController class:**

```java
@Autowired
private TransactionRepository transactionRepository;
```

**Your complete TransactionController should now have these autowired services:**

```java
@Autowired
private TransactionService transactionService;

@Autowired
private TransactionRepository transactionRepository;  // ADD THIS LINE
```

---

### Step 8: Your application.properties (Already Correct)

**Location:** `src/main/resources/application.properties`

Your existing configuration is correct! No changes needed:

```properties
spring.application.name=fnc-bank
server.port=8080

## Database configuration
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=SignupDB;encrypt=false;trustServerCertificate=true
spring.datasource.username=jerry
spring.datasource.password=jerry@12345
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

# JPA configuration
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl

# CORS configuration
spring.web.cors.allowed-origins=http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
```

✅ Your database is **SignupDB** - make sure to run SQL scripts on this database!

---

## Quick Start Checklist

- [ ] 1. Run SQL scripts to update database (Step 1)
- [ ] 2. Create `TransactionStatus` enum in model package
- [ ] 3. Update `Transaction` entity with new fields in model package
- [ ] 4. Create `Admin` entity in model package
- [ ] 5. Create `AdminRepository`
- [ ] 6. Update `TransactionRepository` with new methods
- [ ] 7. Create DTOs (AdminLoginRequest, AdminLoginResponse, AdminStats)
- [ ] 8. Create `AdminService`
- [ ] 9. Create `AdminController`
- [ ] 10. Update `TransactionController` with pending endpoint
- [ ] 11. Restart Spring Boot application
- [ ] 12. Test admin login at `http://localhost:5173/admin/login`

---

## Testing the System

### 1. Start Backend

```bash
cd your-spring-boot-project
./mvnw spring-boot:run
```

### 2. Start Frontend

```bash
cd PNC-Bank
npm run dev
```

### 3. Access Admin Dashboard

- URL: `http://localhost:5173/admin/login`
- Username: `admin`
- Password: `admin123`

### 4. Test Transaction Approval Flow

1. Login as regular user
2. Go to Payment page
3. Make a transfer
4. You'll see "Transaction submitted for approval"
5. Login to admin dashboard
6. See the pending transaction
7. Click "Approve" or "Reject"
8. User's balance will update if approved

---

## Important Notes

⚠️ **Security Warning:** This implementation uses basic authentication for simplicity. For production:

- Use BCrypt to hash passwords
- Implement proper JWT tokens
- Add role-based access control
- Validate all inputs
- Add rate limiting

🎯 **No Need for New Database:** You're using your existing SQL Server database, just adding new tables and columns.

📝 **File Structure:**

```
src/main/java/com/signup/fnc_bank/
├── model/
│   ├── Admin.java (NEW)
│   ├── Transaction.java (UPDATE)
│   ├── TransactionStatus.java (NEW ENUM)
│   └── TransactionType.java (EXISTING)
├── repository/
│   ├── AdminRepository.java (NEW)
│   └── TransactionRepository.java (UPDATE)
├── dto/
│   ├── AdminLoginRequest.java (NEW)
│   ├── AdminLoginResponse.java (NEW)
│   └── AdminStats.java (NEW)
├── service/
│   └── AdminService.java (NEW)
└── controller/
    ├── AdminController.java (NEW)
    └── TransactionController.java (UPDATE)
```

Everything is ready on the frontend. Just follow these backend steps and you'll have a fully functional admin dashboard! 🚀
