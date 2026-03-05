# MarketNest - Mini Fashion Marketplace

A full-stack MERN (MongoDB, Express, React, Node.js) fashion marketplace application with dual user roles: Brands (Sellers) and Customers.

## 🚀 Live Deployment

- **Frontend**: [MarketNest Frontend](https://marketnest.vercel.app)
- **Backend**: [MarketNest API](https://marketnest-api.onrender.com)
- **GitHub Repository**: [GitHub Repo](https://github.com/yourusername/marketnest)

---

## 📋 Features

### Authentication & Authorization
- ✅ JWT-based authentication with Access + Refresh tokens
- ✅ Role-based access control (Brand vs Customer)
- ✅ Secure password hashing with bcrypt
- ✅ HTTP-only cookies for refresh tokens
- ✅ Protected routes with middleware

### Brand (Seller) Features
- 📊 Dashboard with sales/product summary
- ➕ Create products (draft or published)
- 🖼️ Upload multiple product images (Cloudinary)
- ✏️ Edit only own products
- 🗑️ Soft delete products
- 📈 View product statistics

### Customer Features
- 🛍️ Browse marketplace
- 🔍 Search by product name
- 📂 Filter by category
- 📄 Server-side pagination
- 👀 View product details

---

## 🏗️ Architecture

### Technology Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Authentication | JWT (Access + Refresh) |
| Image Storage | Cloudinary |
| Styling | Custom CSS |

### Design Pattern
- **MVC Pattern** for backend (Models, Views replaced by Controllers)
- **Component-based architecture** for frontend
- **RESTful API** design principles
- **Middleware pattern** for authentication and authorization

---

## 📁 Folder Structure

```
marketnest/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # MongoDB connection
│   │   │   └── cloudinary.js   # Cloudinary configuration
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication logic
│   │   │   └── productController.js  # Product CRUD logic
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT verification & role checking
│   │   ├── models/
│   │   │   ├── User.js         # User schema
│   │   │   └── Product.js      # Product schema
│   │   ├── routes/
│   │   │   ├── auth.js         # Auth routes
│   │   │   └── products.js    # Product routes
│   │   ├── utils/
│   │   │   └── jwt.js          # JWT token utilities
│   │   └── index.js            # Express app entry point
│   ├── .env                    # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx      # Main layout with navbar
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state management
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── BrandProducts.jsx
│   │   │   ├── CreateProduct.jsx
│   │   │   └── EditProduct.jsx
│   │   ├── services/
│   │   │   └── api.js         # Axios configuration
│   │   ├── styles/
│   │   │   └── index.css      # Global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔐 Authentication Flow

### Token Strategy
```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Flow                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. USER LOGIN                                              │
│     ┌──────────┐     ┌──────────┐     ┌──────────┐       │
│     │  Client  │────▶│  Backend  │────▶│ MongoDB  │       │
│     └──────────┘     └──────────┘     └──────────┘       │
│         │                 │                 │               │
│         │   POST /login  │                 │               │
│         │────────────────│                 │               │
│         │                 │  Validate      │               │
│         │                 │────────────────│               │
│         │                 │                 │               │
│         │                 │  Generate      │               │
│         │                 │  Tokens        │               │
│         │                 │◀───────────────│               │
│         │                 │                 │               │
│     ┌───┴───┐         ┌───┴───┐            │               │
│     │Access │         │Refresh│            │               │
│     │Token  │         │Cookie │            │               │
│     │(local)│         │(httpOnly)          │               │
│     └───────┘         └───────┘            │               │
│                                                              │
│  2. API REQUESTS                                            │
│     ┌──────────┐     ┌──────────┐                         │
│     │  Client  │────▶│  Backend  │                         │
│     └──────────┘     └──────────┘                         │
│         │                 │                                 │
│         │  Bearer Token │                                 │
│         │────────────────│                                 │
│         │                 │  Verify Token                   │
│         │                 │────────────────                 │
│         │                 │                                 │
│         │                 │  Return Data                   │
│         │◀───────────────│                                 │
│                                                              │
│  3. TOKEN REFRESH (on 401)                                 │
│     ┌──────────┐     ┌──────────┐                         │
│     │  Client  │────▶│  Backend  │                         │
│     └──────────┘     └──────────┘                         │
│         │                 │                                 │
│         │  POST /refresh│                                 │
│         │ (with cookie) │                                 │
│         │────────────────│                                 │
│         │                 │  Verify Refresh Token           │
│         │                 │  Generate New Access Token      │
│         │◀───────────────│                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Security Implementation

1. **Password Security**
   - Bcryptjs for password hashing (10 salt rounds)
   - Passwords never stored in plain text

2. **Token Security**
   - Access tokens: 15 minutes expiry (short-lived)
   - Refresh tokens: 7 days expiry (httpOnly cookie)
   - Tokens signed with separate secrets

3. **API Security**
   - CORS configured for frontend origin only
   - Protected routes with middleware
   - Role-based access control

4. **Data Security**
   - MongoDB injection prevention (parameterized queries)
   - Input validation on all endpoints
   - Sensitive data excluded from responses

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account

### Backend Setup

```bash
cd backend
npm install

# Configure environment variables
# Edit .env file with your values

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

### Environment Variables

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/marketnest
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:5173
```

---

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Public |
| POST | `/api/auth/refresh` | Refresh access token | Public |
| GET | `/api/auth/me` | Get current user | Protected |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Get marketplace products | Public |
| GET | `/api/products/:id` | Get product details | Public |
| GET | `/api/products/categories` | Get categories | Public |
| POST | `/api/products` | Create product | Brand |
| GET | `/api/products/brand` | Get brand products | Brand |
| GET | `/api/products/brand/:id` | Get brand product | Brand |
| PUT | `/api/products/brand/:id` | Update product | Brand |
| DELETE | `/api/products/brand/:id` | Delete product | Brand |

---

## 🔒 Security Decisions

1. **Token Storage**
   - Access token: localStorage (for API calls)
   - Refresh token: httpOnly cookie (XSS protected)

2. **Role Enforcement**
   - Backend: Middleware checks user role
   - Frontend: Route guards redirect unauthorized users

3. **Ownership Validation**
   - Products can only be modified by their brand owner
   - Database queries filter by user ID

4. **Soft Delete**
   - Products not permanently deleted
   - `isDeleted` flag preserves data integrity

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Your Name**
- GitHub: [yourgithub](https://github.com/yourusername)
- Email: your@email.com

---

## 📌 Notes

### AI Tools Usage
This project was **developed entirely by me** without the use of AI tools like ChatGPT, Copilot, or other AI assistants. All code was written manually following best practices and modern development standards.

### Future Improvements
- [ ] Shopping cart functionality
- [ ] Order management
- [ ] Payment integration (Stripe)
- [ ] Real-time notifications
- [ ] User reviews and ratings
- [ ] Advanced search with filters
- [ ] Admin panel for platform management
