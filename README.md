# Traffic Violation Management System

A comprehensive full-stack web application for managing traffic violations, tickets, payments, and disputes. Built with **Spring Boot 3.3.5**, **React 18**, **Tailwind CSS**, and **MySQL**.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Key Features](#key-features)
4. [Technology Stack](#technology-stack)
5. [Database Schema](#database-schema)
6. [Role-Based Access Control](#role-based-access-control)
7. [Project Structure](#project-structure)
8. [Setup & Installation](#setup--installation)
9. [API Endpoints](#api-endpoints)
10. [Business Rules](#business-rules)
11. [User Workflows](#user-workflows)

---

## 🎯 Project Overview

The Traffic Violation Management System is a sophisticated platform designed to streamline traffic law enforcement operations. It enables:

- **Citizens** to register vehicles, view tickets, make payments, and dispute violations
- **Traffic Officers** to issue tickets and manage violation types
- **Review Officers** to review and resolve disputes
- **Admins** to manage users, view analytics, and oversee system operations

The system enforces business rules, maintains audit trails, and provides real-time analytics dashboards.

---

## 🏗️ Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite (fast dev server and build)
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3.4
- **HTTP Client**: Axios with JWT token interceptors
- **Notifications**: React Toastify

### Backend Architecture
- **Framework**: Spring Boot 3.3.5 (Java 17)
- **Security**: JWT-based authentication + Spring Security
- **Database**: JPA/Hibernate with MySQL
- **Validation**: Jakarta Bean Validation
- **Dependency Injection**: Spring's built-in DI

### Communication
- **Protocol**: REST API with JSON payloads
- **Authentication**: JWT tokens (Bearer scheme)
- **CORS**: Enabled for frontend (localhost:5173)

---

## ✨ Key Features

### 1. **Citizen Dashboard**
- 🚗 **Vehicle Management**
  - Register vehicles (vehicle number, model)
  - View all registered vehicles
  - Manage multiple vehicles
  
- 🎫 **Ticket Management**
  - View issued tickets with complete details
  - Real-time status tracking (ISSUED, PENDING_PAYMENT, PAID, OVERDUE, DISPUTED, CANCELLED)
  - Filter and search tickets
  
- 💳 **Payment System**
  - Pay fines online for pending tickets
  - **CRITICAL BUSINESS RULE**: Pay button disabled for DISPUTED/CANCELLED tickets
  - View payment history with transaction details
  - Track payment status (INITIATED, SUCCESS, FAILED)
  
- ⚖️ **Dispute System**
  - Raise disputes against tickets with detailed reasons
  - Track dispute status lifecycle
  - Modal form for professional dispute submission

### 2. **Traffic Officer Dashboard**
- 🎫 **Ticket Issuance**
  - Issue tickets by selecting pre-registered vehicle and violation type
  - Specify violation location
  - Automatic fine calculation based on violation type
  
- 📋 **Violation Type Management**
  - Create new violation types (shared with Admin)
  - Define base fine amounts
  - Manage violation catalog
  
- 📊 **Ticket History**
  - View all issued tickets
  - Filter by status
  - Search by vehicle number or ticket number
  - Sort by date (newest/oldest)

### 3. **Review Officer Dashboard**
- ⚖️ **Dispute Review Panel**
  - View all raised disputes
  - Filter by dispute status (OPEN, UNDER_REVIEW, APPROVED, REJECTED, CLOSED)
  - Display complete ticket context
  
- 🔍 **Dispute Resolution**
  - Review dispute reason and ticket details
  - Approve disputes → Ticket automatically CANCELLED
  - Reject disputes → Ticket remains PENDING_PAYMENT
  - Mandatory resolution remarks field
  - Status lifecycle badges with color coding

### 4. **Admin Dashboard**
- 👥 **User Management**
  - View all system users
  - Filter by role (ADMIN, CITIZEN, TRAFFIC_OFFICER, REVIEW_OFFICER)
  - Create new users with role assignment
  - Email and role visibility
  
- 📊 **Analytics Dashboard**
  - Total fines collected (key metric)
  - Unpaid tickets count
  - Most common violation type
  - Ticket status summary breakdown
  - Revenue by violation type analysis
  
- 🎫 **Global Data Views**
  - All tickets (system-wide)
  - All payments (with citizen info)
  - All disputes (with tracking)
  - All violation types
  
- 📋 **Violation Type Management**
  - Create and manage violation types
  - View complete violation catalog

---

## 💻 Technology Stack

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot 3.3.5
- **Security**: Spring Security + JWT (jjwt 0.11.5)
- **ORM**: Hibernate/JPA
- **Database**: MySQL 8+
- **Build Tool**: Maven
- **Others**: Lombok, Validation

### Frontend
- **Language**: JavaScript (React)
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.4
- **HTTP**: Axios 1.4
- **Routing**: React Router 6.14
- **UI**: React Toastify, Lucide React icons
- **Utilities**: classnames, jwt-decode

### Infrastructure
- **Server**: Apache Tomcat (embedded in Spring Boot)
- **Port**: Backend (8080), Frontend (5173)
- **CORS**: Enabled for cross-origin requests

---

## 🗄️ Database Schema

### Key Entities

#### **User**
- Stores user information with role-based access
- Fields: id, firstName, lastName, email, password, role, phoneNumber, createdAt

#### **Vehicle**
- Registered vehicles with owner information
- Fields: id, vehicleNumber, vehicleType, owner (FK to User), registrationDate

#### **ViolationType**
- Catalog of violation types with base fines
- Fields: id, violationName, description, baseFineAmount, createdAt

#### **ViolationTicket**
- Issued tickets to vehicles
- Fields: id, ticketNumber, vehicle (FK), violationType (FK), violationLocation, fineAmount, ticketStatus, issuedBy (FK to User), createdAt

#### **PaymentTransaction**
- Payment records for fines
- Fields: id, ticket (FK), amount, paymentStatus, createdAt

#### **Dispute**
- Dispute records with resolution tracking
- Fields: id, violationTicket (FK), raisedBy (FK), disputeStatus, disputeReason, resolutionRemark, resolvedBy (FK), createdAt, resolvedAt

---

## 🔐 Role-Based Access Control

### **CITIZEN**
| Resource | GET | POST | PUT | DELETE |
|----------|-----|------|-----|--------|
| /api/vehicles/my | ✅ | ✅ | ❌ | ❌ |
| /api/tickets/my | ✅ | ❌ | ❌ | ❌ |
| /api/payments/my | ✅ | ✅ | ❌ | ❌ |
| /api/disputes | ✅ | ✅ | ❌ | ❌ |

### **TRAFFIC_OFFICER**
| Resource | GET | POST | PUT | DELETE |
|----------|-----|------|-----|--------|
| /api/violations | ✅ | ✅ | ❌ | ❌ |
| /api/tickets | ✅ | ✅ | ❌ | ❌ |
| /api/vehicles | ✅ | ❌ | ❌ | ❌ |

### **REVIEW_OFFICER**
| Resource | GET | POST | PUT | DELETE |
|----------|-----|------|-----|--------|
| /api/disputes | ✅ | ❌ | ✅ | ❌ |

### **ADMIN**
| Resource | GET | POST | PUT | DELETE |
|----------|-----|------|-----|--------|
| /api/users | ✅ | ✅ | ❌ | ❌ |
| /api/violations | ✅ | ✅ | ❌ | ❌ |
| /api/tickets | ✅ | ❌ | ❌ | ❌ |
| /api/payments | ✅ | ❌ | ❌ | ❌ |
| /api/disputes | ✅ | ❌ | ❌ | ❌ |
| /api/analytics/* | ✅ | ❌ | ❌ | ❌ |

---

## 📁 Project Structure

```
traffic_backend/
├── backend/                                    # Spring Boot Application
│   ├── src/main/java/com/example/traffic_backend/
│   │   ├── config/                            # Configuration classes
│   │   │   ├── SecurityConfig.java           # JWT & CORS config
│   │   │   └── CorsConfig.java               # CORS settings
│   │   ├── controller/                        # REST Controllers
│   │   │   ├── AuthController.java           # Login/Register
│   │   │   ├── UserController.java           # User management
│   │   │   ├── VehicleController.java        # Vehicle CRUD
│   │   │   ├── ViolationController.java      # Violation types
│   │   │   ├── TicketController.java         # Ticket issuance
│   │   │   ├── PaymentController.java        # Payment processing
│   │   │   ├── DisputeController.java        # Dispute management
│   │   │   └── AnalyticsController.java      # Analytics endpoints
│   │   ├── entity/                            # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Vehicle.java
│   │   │   ├── ViolationType.java
│   │   │   ├── ViolationTicket.java
│   │   │   ├── PaymentTransaction.java
│   │   │   └── Dispute.java
│   │   ├── enums/                             # Enumerations
│   │   │   ├── Role.java                     # ADMIN, CITIZEN, TRAFFIC_OFFICER, REVIEW_OFFICER
│   │   │   ├── TicketStatus.java             # Ticket lifecycle
│   │   │   ├── PaymentStatus.java            # Payment states
│   │   │   └── DisputeStatus.java            # Dispute states
│   │   ├── dto/                               # Data Transfer Objects
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── TicketRequest.java
│   │   │   ├── DisputeRequest.java
│   │   │   └── ResolveDisputeRequest.java
│   │   ├── repository/                        # JPA Repositories
│   │   ├── service/                           # Business Logic
│   │   │   ├── UserService.java
│   │   │   ├── AuthService.java
│   │   │   ├── TicketService.java
│   │   │   ├── DisputeService.java
│   │   │   ├── PaymentService.java
│   │   │   └── AnalyticsService.java
│   │   ├── security/                          # Security utilities
│   │   │   └── JwtFilter.java               # JWT validation filter
│   │   ├── exception/                         # Custom exceptions
│   │   └── TrafficBackendApplication.java    # Main entry point
│   ├── src/main/resources/
│   │   └── application.properties             # Database & JWT config
│   └── pom.xml                                # Maven dependencies
│
├── frontend/                                   # React + Vite Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx                    # Main layout wrapper
│   │   │   ├── StatusBadge.jsx               # Status display component
│   │   │   └── CreateViolationForm.jsx       # Shared violation form
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── citizen/
│   │   │   │   └── CitizenDashboard.jsx      # Vehicle, Tickets, Payments, Disputes
│   │   │   ├── officer/
│   │   │   │   └── OfficerDashboard.jsx      # Issue tickets, manage violations
│   │   │   ├── review/
│   │   │   │   └── ReviewDashboard.jsx       # Dispute review panel
│   │   │   └── admin/
│   │   │       └── AdminDashboard.jsx        # Analytics, users, global views
│   │   ├── services/                          # API service functions
│   │   │   ├── users.js
│   │   │   ├── vehicles.js
│   │   │   ├── violations.js
│   │   │   ├── tickets.js
│   │   │   ├── payments.js
│   │   │   ├── disputes.js
│   │   │   └── analytics.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx               # Global auth state
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx            # Role-based route protection
│   │   ├── constants/
│   │   │   └── statuses.js                   # Status constants
│   │   ├── api.js                            # Axios instance & interceptors
│   │   ├── App.jsx                           # Main app with routing
│   │   ├── main.jsx                          # React entry point
│   │   └── index.css                         # Tailwind styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.cjs
│   └── postcss.config.cjs
│
└── README.md                                   # This file
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Java 17+**
- **Node.js 18+**
- **MySQL 8+**
- **Maven 3.6+**

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Configure Database** (Edit `src/main/resources/application.properties`)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/traffic_violation_system?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password

jwt.secret=your_secret_key_here
jwt.expiration=86400000
```

3. **Build the project**
```bash
mvn clean install
```

4. **Run the application**
```bash
mvn spring-boot:run
```

Server will be available at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API URL** (if needed in `src/api.js`)
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
```

4. **Run development server**
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

5. **Build for production**
```bash
npm run build
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/register` | Register new user |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (with optional role filter) |
| POST | `/api/users` | Create new user (ADMIN only) |

### Vehicles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles` | Get all vehicles |
| GET | `/api/vehicles/my` | Get my vehicles (CITIZEN) |
| POST | `/api/vehicles` | Register new vehicle |

### Violations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/violations` | Get all violation types |
| POST | `/api/violations` | Create violation type (ADMIN/TRAFFIC_OFFICER) |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | Get all tickets (ADMIN) |
| GET | `/api/tickets/my` | Get my tickets (CITIZEN) |
| GET | `/api/tickets/{id}` | Get ticket details |
| POST | `/api/tickets` | Issue ticket (TRAFFIC_OFFICER) |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payments` | Get all payments (ADMIN) |
| GET | `/api/payments/my` | Get my payments (CITIZEN) |
| POST | `/api/payments` | Create payment (CITIZEN) |

### Disputes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/disputes` | Get all disputes (ADMIN/REVIEW_OFFICER) |
| POST | `/api/disputes` | Raise dispute (CITIZEN) |
| PUT | `/api/disputes/{id}/resolve` | Resolve dispute (REVIEW_OFFICER) |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/total-fines` | Total fines collected |
| GET | `/api/analytics/unpaid-tickets` | Unpaid tickets count |
| GET | `/api/analytics/most-common-violation` | Most common violation |
| GET | `/api/analytics/ticket-status-summary` | Ticket status breakdown |
| GET | `/api/analytics/revenue-by-violation` | Revenue by violation type |

---

## 📋 Business Rules

1. **Payment Rules**
   - Citizens can only pay for PENDING_PAYMENT tickets
   - Pay button is **disabled** for DISPUTED or CANCELLED tickets
   - Citizens see only their own tickets via `/api/tickets/my`

2. **Dispute Rules**
   - Only CITIZEN role can raise disputes
   - Disputes must include a reason
   - When approved → Ticket status changes to CANCELLED
   - When rejected → Ticket status remains PENDING_PAYMENT

3. **Ticket Rules**
   - Only TRAFFIC_OFFICER can issue tickets
   - Ticket status lifecycle: ISSUED → PENDING_PAYMENT → PAID/DISPUTED
   - Fine amount is automatically calculated from violation type's base fine

4. **Violation Type Rules**
   - Can be created by ADMIN or TRAFFIC_OFFICER
   - Must include name, description, and base fine amount
   - Used as catalog for ticket issuance

5. **User Management Rules**
   - Only ADMIN can create users
   - Four roles available: ADMIN, CITIZEN, TRAFFIC_OFFICER, REVIEW_OFFICER
   - Each role has specific permissions

6. **Analytics Rules**
   - Only ADMIN can access analytics dashboard
   - Metrics include total fines, unpaid tickets, violation trends
   - Revenue tracking by violation type

---

## 👥 User Workflows

### Citizen Workflow
```
1. Register Account → 2. Register Vehicle → 3. Receive Ticket
   ↓
4. View Ticket → 5. Pay Fine OR Raise Dispute
   ↓
6. View Payment History / Dispute Status
```

### Traffic Officer Workflow
```
1. Login → 2. Create Violation Types (optional)
   ↓
3. Issue Ticket (select vehicle + violation type + location)
   ↓
4. View Issued Tickets & History
```

### Review Officer Workflow
```
1. Login → 2. View Raised Disputes
   ↓
3. Review Dispute Details (ticket info, reason, citizen)
   ↓
4. Approve (cancel ticket) OR Reject (keep payment pending)
   ↓
5. Add Resolution Remarks
```

### Admin Workflow
```
1. Login → 2. View Analytics Dashboard (fines, unpaid tickets, etc.)
   ↓
3. Manage Users (create, view, filter by role)
   ↓
4. View Global Data (all tickets, payments, disputes)
   ↓
5. Manage Violation Types Catalog
```

---

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Color-Coded Status Badges**: Quick visual status identification
- **Tab Navigation**: Organized sections in admin dashboard
- **Professional Modals**: For disputes, user creation, and error handling
- **Loading States**: Loading indicators for all async operations
- **Form Validation**: Client-side and server-side validation
- **Toast Notifications**: Success/error feedback messages
- **Tailwind CSS**: Modern, clean, professional styling
- **Gradient Headers**: Visual hierarchy with gradient colors

---

## 🔍 Security Features

- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Role-Based Access Control**: Fine-grained permissions
- ✅ **Password Encryption**: BCrypt password hashing
- ✅ **CORS Protection**: Configured for frontend origin
- ✅ **SQL Injection Prevention**: Parameterized queries (JPA)
- ✅ **Request Validation**: Server-side validation on all inputs
- ✅ **Stateless Sessions**: No session data storage (JWT only)

---

## 📝 Notes

- Database tables are auto-created via Hibernate DDL (ddl-auto=update)
- JWT tokens expire after 24 hours (86400000ms)
- Frontend uses React Router for client-side routing
- API responses follow RESTful conventions
- All timestamps use LocalDateTime (ISO-8601 format)
- Email addresses are unique across the system
- Ticket numbers are unique for audit trail

---

## 🤝 Contributing

To contribute to this project:
1. Create a feature branch
2. Commit changes with clear messages
3. Push to the branch
4. Create a Pull Request

---

## 📄 License

This project is part of HCL Practice - Traffic Violation Management System.

---

## 📞 Support

For issues, questions, or feedback, please contact the development team.

---

**Last Updated**: May 19, 2026
**Version**: 1.0.0
**Status**: Production Ready
