# 🌍 Travel Planner & Budget Estimator

A comprehensive MERN stack web application for planning trips, estimating budgets, exploring destinations with interactive maps, and getting AI-powered travel recommendations.

## ✨ Features

### 🔐 Authentication & User Management
- JWT-based secure authentication
- User profiles with preferences and statistics
- Password reset functionality
- Account management and preferences

### 🗺️ Trip Planning
- Create, edit, and delete trips
- Interactive trip management dashboard
- Trip status tracking (planning, booked, in-progress, completed)
- Trip sharing with other users
- Detailed itinerary planning

### 💰 Smart Budget Estimator
- Accurate cost breakdown calculations
- Country-specific pricing adjustments
- Different travel styles (budget, mid-range, luxury)
- Seasonal pricing variations
- Per-person and per-day cost analysis
- Budget history and comparisons

### 🗺️ Interactive Maps
- Destination exploration with visual maps
- Location search and filtering
- Points of interest (hotels, restaurants, attractions)
- Integration-ready for Google Maps API

### 🤖 AI Travel Assistant
- Intelligent chatbot for travel advice
- Destination recommendations
- Travel tips and safety information
- Food and activity suggestions
- Real-time travel assistance

### 📱 Modern UI/UX
- Responsive design for all devices
- Modern card-based layouts
- Smooth animations and transitions
- Intuitive navigation and user experience
- Professional color scheme and typography

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### External APIs (Ready for Integration)
- **Google Maps API** - Maps and location services
- **Gemini AI API** - Intelligent chat responses

## 📁 Project Structure

```
travel-planner/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TripForm.jsx
│   │   │   ├── BudgetEstimator.jsx
│   │   │   ├── ChatbotWidget.jsx
│   │   │   └── MapView.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── backend/
    ├── models/
    │   ├── User.js
    │   ├── Trip.js
    │   └── Budget.js
    ├── routes/
    │   ├── auth.js
    │   ├── user.js
    │   ├── trip.js
    │   └── budget.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── server.js
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd travel-planner
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
   cd ../
   npm install
   npm run dev
   ```

4. **Environment Variables**
   
   Create `backend/.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/travel-planner
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   NODE_ENV=development
   ```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/change-password` - Change password

### Trips
- `GET /api/trips` - Get all user trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get single trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `POST /api/trips/:id/share` - Share trip

### Budget
- `POST /api/budget/estimate` - Calculate budget estimate
- `GET /api/budget/history` - Get budget history
- `GET /api/budget/:id` - Get detailed budget
- `GET /api/budget/destination/:country/:city` - Get destination averages

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/preferences` - Update preferences
- `GET /api/user/stats` - Get user statistics

## 🌟 Key Features Explained

### Budget Estimation Algorithm
The budget estimator uses a sophisticated calculation system:
- **Base rates** for different travel styles
- **Country multipliers** for regional cost variations
- **Seasonal adjustments** for peak/off-peak pricing
- **Traveler-specific calculations** (adults vs children)
- **Comprehensive breakdown** (accommodation, food, transport, activities)

### Trip Management
- **Status tracking** from planning to completion
- **Collaborative planning** with trip sharing
- **Detailed itineraries** with day-by-day planning
- **Photo uploads** and trip memories
- **Budget vs actual** spending tracking

### AI Assistant
- **Context-aware responses** for travel queries
- **Destination-specific advice** and recommendations
- **Safety tips** and travel best practices
- **Real-time chat interface** with conversation history

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password hashing** using bcryptjs
- **Input validation** and sanitization
- **Rate limiting** to prevent abuse
- **CORS configuration** for cross-origin security
- **Environment variable protection** for sensitive data

## 📈 Performance Optimizations

- **Code splitting** with React Router
- **Lazy loading** of components
- **Database indexing** for efficient queries
- **Pagination** for large data sets
- **Image optimization** and lazy loading
- **Caching strategies** for API responses

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the production version: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Configure environment variables in your hosting dashboard

### Backend (Render/Heroku)
1. Set up MongoDB Atlas database
2. Configure environment variables
3. Deploy backend to your hosting provider
4. Update CORS settings with your frontend domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@travelplanner.com
- GitHub Issues: [Create an issue]
- Documentation: [Link to docs]

## 🔄 Upcoming Features

- **Real-time collaboration** on trip planning
- **Weather integration** for destination insights
- **Booking integration** with travel providers
- **Mobile app** for iOS and Android
- **Social features** and trip sharing
- **Advanced analytics** and spending insights

---

**Made with ❤️ for travelers around the world** 🌍
</parameter>