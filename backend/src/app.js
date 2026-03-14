import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js'
import path from 'path'

const app = express()


// Middlewares Usage
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`);
    });
    next();
});

app.use(cors({
    origin: [
        process.env.CORS_ORIGIN,
        'http://localhost:5173',
        'http://localhost:8080'
    ].filter(Boolean),
    credentials: true
}))

// To perform CRUD Operations on Client's cookies
app.use(cookieParser())

// This middleware converts JSON into JS Object and Parses it into "req.body", with incoming limit of 16KB
app.use(express.json({ limit: '16kb' }))

// urlencoded parses the urlencoded payloads (not for form data) and extended:true allows nested objects
app.use(express.urlencoded({ extended: true, limit: '16kb' }))

// DATA IN URL IS PARSED AUTOMATICALLY
// Accessed through req.query -> GET /products?category=shoes&price=100
// and req.params -> GET /users/:id/orders/:orderId

// Serve all files in the 'public' folder as static assets
app.use(express.static('public'))

// ROUTES DECLARATION
app.use('/api/v1/users', userRouter)

// Catch-all route for React SPA (Must be AFTER API routes)
app.get('*', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'));
});

export default app;