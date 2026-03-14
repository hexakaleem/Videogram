import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js'

const app = express()

// Request Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[API LOG] ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Time: ${duration}ms`);
    });
    next();
})

// Middlewares Usage
app.use(cors({
    origin: process.env.CORS_ORIGIN,
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




export default app;