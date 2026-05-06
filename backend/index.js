const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')

const app = express()

// Before your routes
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}))
app.use(cookieParser())

app.use('/api', router)

if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '../frontend/build')

    app.use(express.static(buildPath))

    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'))
    })
}

const PORT = process.env.PORT || 8080

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('✅ Connected to DB')
        console.log('🚀 Server is running on port ' + PORT)
    })
})