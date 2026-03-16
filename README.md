# Super Offer - Nearby Deals Finder

A full-stack MERN application that allows users to discover nearby offers from local shops based on their location using Google Maps. Shop owners can register their shops and publish offers after admin approval.

## 🚀 Live Demo

Click here to view the project:

🔗 https://super-offer-nine.vercel.app/

## Features

### User Features
- 🔍 **Discover Nearby Offers**: Find deals from local shops based on your location
- 🗺️ **Interactive Map**: View shops and offers on Google Maps
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 💾 **Save Offers**: Save favorite deals for later
- 🔐 **Secure Authentication**: JWT-based authentication with refresh tokens

### Shop Owner Features
- 🏪 **Register Shop**: Submit shop for admin approval
- 📝 **Manage Offers**: Create, edit, and delete offers
- 📊 **Dashboard**: View shop performance and analytics
- ✅ **Approval System**: Shops must be approved by admin before publishing offers

### Admin Features
- 👥 **User Management**: View and manage users
- 🏪 **Shop Approvals**: Approve or reject shop registration requests
- 📈 **Analytics**: View system analytics and statistics
- 🗑️ **Content Moderation**: Delete inappropriate offers

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with refresh tokens
- **Validation**: express-validator
- **Security**: bcryptjs, rate limiting, secure cookies

### Frontend
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios
- **Maps**: @react-google-maps/api
- **State Management**: Context API

## Project Structure

```
super_offer/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── shopController.js  # Shop management
│   │   ├── offerController.js # Offer management
│   │   └── adminController.js # Admin operations
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   ├── adminMiddleware.js     # Admin access
│   │   ├── shopOwnerMiddleware.js  # Shop owner access
│   │   ├── validationMiddleware.js # Request validation
│   │   ├── errorMiddleware.js      # Error handling
│   │   └── rateLimiter.js          # Rate limiting
│   ├── models/
│   │   ├── User.js          # User model
│   │   ├── Shop.js          # Shop model (with GeoJSON)
│   │   ├── Offer.js         # Offer model (with GeoJSON)
│   │   └── RefreshToken.js  # Refresh token model
│   ├── routes/
│   │   ├── auth.js    # Auth routes
│   │   ├── shops.js   # Shop routes
│   │   ├── offers.js  # Offer routes
│   │   └── admin.js   # Admin routes
│   ├── utils/
│   │   └── validators.js # Validation rules
│   ├── .env           # Environment variables
│   ├── package.json   # Dependencies
│   └── server.js      # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── offer/
│   │   │       ├── OfferCard.jsx
│   │   │       └── OfferGrid.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── NearbyOffers.jsx
│   │   │   ├── OfferDetails.jsx
│   │   │   ├── user/
│   │   │   ├── shopowner/
│   │   │   └── admin/
│   │   ├── services/
│   │   │   └── api.js      # API service
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── index.html
│
├── .env.example
├── README.md
└── TODO.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Google Maps API Key

### Installation

1. **Clone the repository**
   ```bash
   cd super_offer
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your Google Maps API key
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Environment Variables

#### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/super_offer
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
GOOGLE_MAPS_API_KEY=your-google-maps-key
COOKIE_SECRET=your-cookie-secret
```

#### Frontend (.env)
```
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Shops
- `POST /api/shops` - Register new shop (Shop Owner)
- `GET /api/shops` - Get all shops
- `GET /api/shops/my-shop` - Get my shop (Shop Owner)
- `GET /api/shops/:id` - Get single shop
- `PUT /api/shops/:id` - Update shop (Shop Owner)
- `DELETE /api/shops/:id` - Delete shop (Shop Owner)
- `GET /api/shops/nearby` - Get nearby shops

### Offers
- `POST /api/offers` - Create offer (Shop Owner)
- `GET /api/offers` - Get all offers
- `GET /api/offers/nearby` - Get nearby offers
- `GET /api/offers/:id` - Get single offer
- `PUT /api/offers/:id` - Update offer (Shop Owner)
- `DELETE /api/offers/:id` - Delete offer (Shop Owner)
- `GET /api/offers/my/offers` - Get my offers (Shop Owner)

### Admin
- `GET /api/admin/shop-requests` - Get shop requests
- `PUT /api/admin/approve-shop/:id` - Approve shop
- `PUT /api/admin/reject-shop/:id` - Reject shop
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/offers` - Get all offers
- `DELETE /api/admin/offers/:id` - Delete offer
- `GET /api/admin/analytics` - Get system analytics

## User Roles

1. **User**: Can browse and save offers
2. **Shop Owner**: Can manage their shop and offers
3. **Admin**: Full system access

## Geospatial Features

The application uses MongoDB's geospatial queries to find nearby offers:
- Shops and offers store location as GeoJSON Point
- 2dsphere indexes are created for efficient location queries
- Distance filtering (1km, 5km, 10km, etc.)

## Security Features

- JWT authentication with access and refresh tokens
- Password hashing with bcrypt
- Role-based access control
- Rate limiting to prevent brute force
- Secure HTTP-only cookies
- Input validation and sanitization
- CORS configuration

## Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables
4. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## License

MIT License

