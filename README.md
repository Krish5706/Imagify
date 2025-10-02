# Imagify - AI Text to Image Generator

## Features

- **AI-Powered Image Generation**: Convert text prompts into high-quality images using advanced AI models
- **User Authentication**: Secure login and registration system with JWT-based authentication
- **Credit-Based System**: Purchase credits to generate images with integrated Razorpay payment gateway
- **Responsive Design**: Modern, mobile-friendly UI built with React and TailwindCSS
- **Image History**: View and manage previously generated images
- **Real-time Notifications**: Toast notifications for user feedback and status updates
- **Secure File Uploads**: Handle image uploads and storage securely

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │   Express API   │    │   MongoDB       │
│   (Port 5173)   │◄──►│   (Port 4000)   │◄──►│   Database      │
│                 │    │                 │    │                 │
│ - Components    │    │ - Controllers   │    │ - Users         │
│ - Pages         │    │ - Routes        │    │ - Images        │
│ - Context       │    │ - Middleware    │    │ - Transactions  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                         ┌─────────────────┐
                         │   External APIs │
                         │                 │
                         │ - Clipdrop API  │
                         │ - Razorpay API  │
                         └─────────────────┘
```

### System Flow
1. **User Registration/Login** → JWT Token Generation
2. **Credit Purchase** → Razorpay Payment Integration
3. **Image Generation** → Text Prompt → Clipdrop API → Image Storage
4. **History Management** → MongoDB Storage → User Dashboard

## Tech Stack

### Frontend
- **React 19.1.0**: JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **TailwindCSS 4.1.11**: Utility-first CSS framework for styling
- **React Router DOM**: Declarative routing for React applications
- **Axios**: HTTP client for making API requests
- **React Toastify**: Toast notifications for user feedback
- **Motion**: Animation library for React components

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express 5.1.0**: Web application framework for Node.js
- **MongoDB**: NoSQL database for storing user data and image history
- **Mongoose**: ODM library for MongoDB
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing library
- **Razorpay**: Payment gateway integration
- **CORS**: Cross-Origin Resource Sharing middleware
- **Nodemailer**: Email sending functionality
- **Dotenv**: Environment variable management

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or cloud instance like MongoDB Atlas)
- **Git** - [Download here](https://git-scm.com/)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/imagify.git
cd imagify
```

### 2. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the required environment variables (see [Environment Variables](#environment-variables) section).

4. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:4000`.

### 3. Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The client will run on `http://localhost:5173` (default Vite port).

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIPDROP_API=your_clipdrop_api_key
```

### Environment Variable Descriptions:
- `PORT`: Port number for the server (default: 4000)
- `MONGODB_URI`: MongoDB connection string (local or cloud)
- `JWT_SECRET`: Secret key for JWT token generation
- `RAZORPAY_KEY_ID`: Razorpay API key ID for payments
- `RAZORPAY_KEY_SECRET`: Razorpay API key secret for payments
- `CLIPDROP_API`: API key for Clipdrop text-to-image service

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Register a new account or log in with existing credentials
3. Purchase credits using the integrated Razorpay payment system if needed
4. Enter a descriptive text prompt to generate an image
5. View your generated images on the result page
6. Access your account settings and image history from the dashboard

## Project Structure

```
imagify/
├── client/                 # React frontend application
│   ├── public/             # Static assets (favicon, etc.)
│   ├── src/
│   │   ├── assets/         # Images, icons, and media files
│   │   ├── components/     # Reusable React components
│   │   │   ├── Header.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ...
│   │   ├── context/        # React context for state management
│   │   ├── pages/          # Main application pages
│   │   │   ├── Home.jsx
│   │   │   ├── Result.jsx
│   │   │   ├── History.jsx
│   │   │   └── ...
│   │   ├── App.jsx         # Main application component
│   │   ├── main.jsx        # Application entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   ├── vite.config.js      # Vite configuration
│   └── eslint.config.js    # ESLint configuration
├── server/                 # Node.js backend application
│   ├── config/             # Database and configuration files
│   │   └── mongodb.js      # MongoDB connection setup
│   ├── controllers/        # Route controllers
│   │   ├── userControllers.js
│   │   │   └── imageController.js
│   ├── middlewares/        # Custom middleware functions
│   │   └── auth.js         # Authentication middleware
│   ├── models/             # MongoDB data models
│   │   ├── userModel.js
│   │   ├── imageHistoryModel.js
│   │   └── transactionModel.js
│   ├── routes/             # API route definitions
│   │   ├── userRoutes.js
│   │   └── imageRoutes.js
│   ├── uploads/            # Uploaded image storage
│   ├── package.json
│   └── server.js           # Server entry point
└── README.md               # Project documentation
```

## API Endpoints

### User Routes (`/api/user`)
- `POST /register` - Register a new user account
- `POST /login` - Authenticate user login
- `GET /credits` - Retrieve user credit balance
- `POST /credits` - Retrieve user credit balance (alternative)
- `POST /pay-razor` - Initiate Razorpay payment for credit purchase
- `POST /verify-razor` - Verify Razorpay payment

### Image Routes (`/api/image`)
- `POST /generate-image` - Generate image from text prompt (requires credits)
- `GET /user-history` - Retrieve user's generated image history
- `DELETE /delete-history` - Delete a specific history item
- `POST /cleanup-orphaned-images` - Clean up orphaned image files
- `POST /cleanup-old-images` - Clean up old images beyond retention period

## Author

**Krish** **Mark**

---

*Made with ❤️ using React and Node.js*
