const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const counterRoutes = require('./routes/counters')
const errorHandler = require('./middleware/errorHandler')
const logger = require('./middleware/logger')
const status = require('./utils/status')

const app = express()
const PORT = process.env.PORT || 8000

// Security middleware
app.use(helmet())
app.use(cors())

// Logging middleware
app.use(morgan('combined'))

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Custom logging setup
logger.init(app)

// Health endpoint
app.get('/health', (req, res) => {
  res.status(status.HTTP_200_OK).json({ status: 'OK' })
})

// Index endpoint
app.get('/', (req, res) => {
  app.logger.info('Request for Base URL')
  res.status(status.HTTP_200_OK).json({
    status: status.HTTP_200_OK,
    message: 'Hit Counter Service',
    version: '1.0.0',
    url: `${req.protocol}://${req.get('host')}/counters`
  })
})

// Counter routes
app.use('/counters', counterRoutes)

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(status.HTTP_404_NOT_FOUND).json({
    status: status.HTTP_404_NOT_FOUND,
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  })
})

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('*'.repeat(70))
    console.log('  S E R V I C E   R U N N I N G  '.padStart(45, '*').padEnd(70, '*'))
    console.log('*'.repeat(70))
    console.log(`Server running on port ${PORT}`)
  })
}

module.exports = app
