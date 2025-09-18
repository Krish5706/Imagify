# Imagify - Text to Image Generator

A full-stack web application that generates images from text prompts using AI. Users can create accounts, purchase credits, and generate high-quality images based on their descriptions.

## Features

- **Text to Image Generation**: Convert text prompts into images using advanced AI models.
- **User Authentication**: Secure login and registration system with JWT tokens.
- **Credit System**: Purchase credits to generate images, with Razorpay integration for payments.
- **Responsive UI**: Modern, responsive design built with React and TailwindCSS.
- **Image History**: View and manage previously generated images.
- **Real-time Notifications**: Toast notifications for user feedback.

## Technologies Used

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool and development server.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **React Router**: Declarative routing for React applications.
- **Axios**: HTTP client for making API requests.
- **React Toastify**: Toast notifications for user feedback.
- **Motion**: Animation library for React.

### Backend
- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing user data and image history.
- **Mongoose**: ODM library for MongoDB.
- **JWT**: JSON Web Tokens for authentication.
- **Bcrypt**: Password hashing library.
- **Razorpay**: Payment gateway integration.
- **CORS**: Cross-Origin Resource Sharing middleware.

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)
- Git

### Clone the Repository
```bash
git clone https://github.com/your-username/imagify.git
cd imagify
```

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory and add the following environment variables:
   ```
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:4000`.

### Frontend Setup
1. Navigate to the client directory:
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

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Register a new account or log in if you already have one.
3. Purchase credits if needed using the integrated Razorpay payment system.
4. Enter a text prompt to generate an image.
5. View your generated images in the result page.
6. Manage your account and view image history.

## Project Structure

```
imagify/
├── client/                 # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images, icons, and other assets
│   │   ├── components/     # Reusable React components
│   │   ├── context/        # React context for state management
│   │   ├── pages/          # Main application pages
│   │   └── main.jsx        # Application entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middleware functions
│   ├── models/             # MongoDB models
│   ├── routes/             # API route definitions
│   ├── package.json
│   └── server.js           # Server entry point
└── README.md               # Project documentation
```

## API Endpoints

### User Routes (`/api/user`)
- `POST /register`: Register a new user
- `POST /login`: User login
- `GET /credits`: Get user credit balance
- `POST /pay-razor`: Initiate Razorpay payment

### Image Routes (`/api/image`)
- `POST /generate-image`: Generate image from text prompt
- `GET /user-images`: Get user's generated images

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature.
3. Make your changes and test thoroughly.
4. Submit a pull request with a clear description of your changes.

## License

This project is licensed under the ISC License.

## Author

Krish

## Contact

For questions or support, please contact the author or open an issue on GitHub.
