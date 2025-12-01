# Backend API Requirements for Admin System

## Required Backend Endpoints

### 1. Admin Authentication

#### POST `/api/admin/login`

**Description:** Admin login endpoint
**Request Body:**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK):**

```json
{
  "token": "jwt_token_here",
  "adminId": 1,
  "username": "admin"
}
```

---

### 2. Admin Statistics

#### GET `/api/admin/stats`

**Description:** Get dashboard statistics
**Headers:** `Authorization: Bearer {token}`
**Response (200 OK):**

```json
{
  "totalUsers": 150,
  "totalTransactions": 2345,
  "activeAccounts": 145,
  "pendingTransactions": 12
}
```

---

### 3. User Management

#### GET `/api/admin/users`

**Description:** Get all users
**Headers:** `Authorization: Bearer {token}`
**Response (200 OK):**

```json
[
  {
    "id": 1,
    "firstName": "John",
    "secondName": "Doe",
    "email": "john@example.com",
    "balance": 1500.0,
    "createdAt": "2025-01-01T10:00:00"
  }
]
```

---

### 4. Transaction Management

#### GET `/api/admin/transactions/pending`

**Description:** Get all pending transactions awaiting approval
**Headers:** `Authorization: Bearer {token}`
**Response (200 OK):**

```json
[
  {
    "id": 123,
    "userId": 5,
    "transactionType": "WITHDRAW",
    "amount": 500.0,
    "description": "Transfer to John Doe",
    "status": "PENDING",
    "timestamp": "2025-11-29T14:30:00"
  }
]
```

#### GET `/api/admin/transactions/recent`

**Description:** Get recent transactions (all statuses)
**Headers:** `Authorization: Bearer {token}`
**Response (200 OK):**

```json
[
  {
    "id": 122,
    "userId": 3,
    "transactionType": "DEPOSIT",
    "amount": 1000.0,
    "description": "Salary deposit",
    "status": "APPROVED",
    "timestamp": "2025-11-29T10:00:00"
  }
]
```

#### POST `/api/admin/transactions/{id}/approve`

**Description:** Approve a pending transaction
**Headers:** `Authorization: Bearer {token}`
**Response (200 OK):**

```json
{
  "message": "Transaction approved successfully",
  "transaction": {
    "id": 123,
    "status": "APPROVED",
    "approvedAt": "2025-11-29T15:00:00"
  }
}
```

**Backend Logic:**

- Update transaction status to "APPROVED"
- Execute the transaction (update user balance)
- Create a notification for the user

#### POST `/api/admin/transactions/{id}/reject`

**Description:** Reject a pending transaction
**Headers:** `Authorization: Bearer {token}`
**Response (200 OK):**

```json
{
  "message": "Transaction rejected",
  "transaction": {
    "id": 123,
    "status": "REJECTED",
    "rejectedAt": "2025-11-29T15:00:00"
  }
}
```

**Backend Logic:**

- Update transaction status to "REJECTED"
- Do NOT update user balance
- Create a notification for the user

---

### 5. Pending Transaction Creation (User Side)

#### POST `/api/transactions/pending`

**Description:** Create a transaction that requires admin approval
**Request Body:**

```json
{
  "userId": 5,
  "transactionType": "WITHDRAW",
  "amount": 500.0,
  "description": "Transfer to John Doe",
  "status": "PENDING"
}
```

**Response (201 Created):**

```json
{
  "id": 123,
  "userId": 5,
  "transactionType": "WITHDRAW",
  "amount": 500.0,
  "description": "Transfer to John Doe",
  "status": "PENDING",
  "timestamp": "2025-11-29T14:30:00"
}
```

---

## Database Schema Updates

### Transaction Table

Add a new column:

```sql
ALTER TABLE transactions ADD COLUMN status VARCHAR(20) DEFAULT 'APPROVED';
ALTER TABLE transactions ADD COLUMN approved_at TIMESTAMP NULL;
ALTER TABLE transactions ADD COLUMN rejected_at TIMESTAMP NULL;
ALTER TABLE transactions ADD COLUMN approved_by INT NULL;
```

### Admin Table (Create New)

```sql
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password should be hashed in production)
INSERT INTO admins (username, password_hash) VALUES ('admin', 'hashed_password_here');
```

---

## Java Backend Implementation Guide

### 1. Create Transaction Status Enum

```java
public enum TransactionStatus {
    PENDING,
    APPROVED,
    REJECTED
}
```

### 2. Update Transaction Entity

```java
@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    private Double amount;
    private String description;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status = TransactionStatus.APPROVED; // Default for backward compatibility

    private LocalDateTime timestamp;
    private LocalDateTime approvedAt;
    private LocalDateTime rejectedAt;
    private Long approvedBy;

    // Getters and setters
}
```

### 3. Create Admin Entity

```java
@Entity
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String passwordHash;
    private LocalDateTime createdAt;

    // Getters and setters
}
```

### 4. Create AdminController

```java
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
        // Authenticate admin
        // Generate JWT token
        // Return token and admin info
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStats> getStats(@RequestHeader("Authorization") String token) {
        // Verify admin token
        // Return statistics
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String token) {
        // Verify admin token
        // Return all users
    }

    @GetMapping("/transactions/pending")
    public ResponseEntity<List<Transaction>> getPendingTransactions(@RequestHeader("Authorization") String token) {
        // Verify admin token
        // Return transactions where status = PENDING
    }

    @GetMapping("/transactions/recent")
    public ResponseEntity<List<Transaction>> getRecentTransactions(@RequestHeader("Authorization") String token) {
        // Verify admin token
        // Return recent transactions (limit 50)
    }

    @PostMapping("/transactions/{id}/approve")
    public ResponseEntity<?> approveTransaction(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        // Verify admin token
        // Get transaction
        // Update status to APPROVED
        // Execute transaction (update user balance)
        // Set approvedAt and approvedBy
        // Return success
    }

    @PostMapping("/transactions/{id}/reject")
    public ResponseEntity<?> rejectTransaction(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        // Verify admin token
        // Get transaction
        // Update status to REJECTED
        // Set rejectedAt
        // Return success
    }
}
```

### 5. Update TransactionController

```java
@PostMapping("/transactions/pending")
public ResponseEntity<Transaction> createPendingTransaction(@RequestBody TransactionRequest request) {
    Transaction transaction = new Transaction();
    transaction.setUserId(request.getUserId());
    transaction.setTransactionType(request.getTransactionType());
    transaction.setAmount(request.getAmount());
    transaction.setDescription(request.getDescription());
    transaction.setStatus(TransactionStatus.PENDING); // Set as PENDING
    transaction.setTimestamp(LocalDateTime.now());

    Transaction saved = transactionRepository.save(transaction);
    return ResponseEntity.status(201).body(saved);
}
```

### 6. Update Transaction Service

```java
public void approveTransaction(Long transactionId, Long adminId) {
    Transaction transaction = transactionRepository.findById(transactionId)
        .orElseThrow(() -> new RuntimeException("Transaction not found"));

    if (transaction.getStatus() != TransactionStatus.PENDING) {
        throw new RuntimeException("Transaction is not pending");
    }

    // Update user balance
    User user = userRepository.findById(transaction.getUserId())
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

    // Update transaction
    transaction.setStatus(TransactionStatus.APPROVED);
    transaction.setApprovedAt(LocalDateTime.now());
    transaction.setApprovedBy(adminId);
    transactionRepository.save(transaction);
}

public void rejectTransaction(Long transactionId) {
    Transaction transaction = transactionRepository.findById(transactionId)
        .orElseThrow(() -> new RuntimeException("Transaction not found"));

    if (transaction.getStatus() != TransactionStatus.PENDING) {
        throw new RuntimeException("Transaction is not pending");
    }

    transaction.setStatus(TransactionStatus.REJECTED);
    transaction.setRejectedAt(LocalDateTime.now());
    transactionRepository.save(transaction);
}
```

---

## Security Considerations

1. **Password Hashing:** Use BCrypt to hash admin passwords
2. **JWT Tokens:** Implement JWT for admin authentication
3. **Token Validation:** Validate admin token on all admin endpoints
4. **CORS:** Configure CORS to allow requests from frontend
5. **SQL Injection:** Use parameterized queries
6. **Input Validation:** Validate all input data

---

## Testing

### Test Admin Login

```bash
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test Get Stats (with token)

```bash
curl http://localhost:8080/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Approve Transaction

```bash
curl -X POST http://localhost:8080/api/admin/transactions/123/approve \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Frontend-Backend Integration

The frontend is already configured to:

1. Send login requests to `/api/admin/login`
2. Store admin token in localStorage
3. Send Authorization header with all admin requests
4. Poll for updates every 5 seconds
5. Submit transactions with PENDING status
6. Display notifications when transactions are approved/rejected

Make sure your backend returns the exact JSON structure shown in this document for seamless integration.
