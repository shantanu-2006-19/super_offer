require("dotenv").config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// Connect to database
import connectDB from './config/db.js';
connectDB();
import errorMiddleware from './middleware/errorMiddleware.js';
import { generalLimiter } from './middleware/rateLimiter.js';

// Import routes
import authRoutes from './routes/auth.js';
import shopRoutes from './routes/shops.js';
import offerRoutes from './routes/offers.js';
import adminRoutes from './routes/admin.js';



const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_URL, "https://super-offer-nine.vercel.app" ,'http://localhost:5173'],
  credentials: true,
  allowedOrigins: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS

// Rate limiting
app.use(generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Super Offer API is running' });
});

// Error middleware
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

