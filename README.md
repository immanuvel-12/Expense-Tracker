[Expensio-README (1).md](https://github.com/user-attachments/files/33980908/Expensio-README.1.md)
# Expensio — Expense Tracker

Expensio is a personal expense-tracking web application built to help users record and manage their expenses through a clean, responsive interface.

## Features

- Expense tracking interface for managing personal spending
- React-based single-page application
- Express.js API for backend operations
- MongoDB database integration
- User authentication with JWT stored in an HttpOnly cookie
- Input validation and server-side request handling
- Environment-based configuration for local development and deployment

> The available features may depend on the active backend configuration. Keep this section aligned with the functionality enabled in your deployed version.

## Tech Stack

**Frontend**
- React
- JavaScript / JSX
- Vite
- Tailwind CSS
- shadcn/ui

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Project Structure

```text
Expensio/
├── public/       # Static assets
├── src/          # React frontend
├── server/       # Express API and MongoDB integration
├── package.json  # Frontend dependencies and scripts
└── README.md
```

The frontend uses a shared backend service to route API requests. The Express application and server configuration are maintained in the `server/` directory.

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- MongoDB database / MongoDB Atlas connection string

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Expensio
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your repository URL. If the cloned folder has a different name, use that folder name in the `cd` command.

### 2. Install frontend dependencies

From the project root:

```bash
npm install
```

### 3. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory using `.env.example` as a guide:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Use your own MongoDB connection string and a strong secret. Never commit real credentials or secret values to GitHub.

### 4. Start the backend

From the `server/` directory:

```bash
npm run dev
```

### 5. Start the frontend

Open another terminal at the project root:

```bash
npm run dev
```

Vite will show the local URL in the terminal. Make sure the frontend's backend configuration matches the backend service you are running.

## Security Notes

- Authentication uses JWT with an HttpOnly cookie.
- Password handling uses bcryptjs.
- Backend configuration and secrets should be stored in environment variables.
- Do not commit `.env` files containing real credentials.
- Configure the correct frontend origin and secure cookie settings for production deployments.

## Testing

The backend includes tests that can be run from the `server/` directory:

```bash
npm test
```

## Deployment

The frontend and backend may need to be deployed separately. Configure the frontend to use the deployed API URL, and set the backend's allowed frontend origin to your deployed frontend domain. Add secrets through the hosting provider's environment-variable settings rather than placing them in source code.

## Contact

**Immanuvel**  
MERN Stack Developer | BCA Graduate

- **Portfolio:** https://immanuvel-portfolio.vercel.app/
- **GitHub:** https://github.com/immanuvel-12
- **LinkedIn:** https://www.linkedin.com/in/immanuvel-dev/

---

Thanks for checking out Expensio!
