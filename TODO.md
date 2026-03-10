# Super Offer – Nearby Deals Finder

## Project Overview
Full-stack MERN application for discovering nearby offers from local shops using Google Maps. Features role-based access control (Admin, Shop Owner, User).

## STATUS: COMPLETE ✅

All files have been created successfully!

## Project Structure

```
super_offer/
├── backend/               # Express.js API
│   ├── config/           # Database config
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth & validation
│   ├── models/           # MongoDB models
│   ├── routes/          # API routes
│   └── utils/           # Utilities
├── frontend/             # React + Vite
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # Auth context
│       ├── pages/       # Page components
│       └── services/    # API service
├── .env.example         # Environment template
├── README.md           # Documentation
└── DEPLOYMENT.md       # Deployment guide
```

## To Run the Project:

### Backend:
```bash
cd backend
npm install
# Create .env file from .env.example
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
# Create .env file with Google Maps API key
npm run dev
```

