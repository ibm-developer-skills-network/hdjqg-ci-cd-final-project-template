const express = require('express')
const router = express.Router()
const status = require('../utils/status')

// In-memory counter storage
let COUNTER = {}

// List all counters
router.get('/', (req, res) => {
  req.app.logger.info('Request to list all counters...')

  const counters = Object.entries(COUNTER).map(([name, counter]) => ({
    name,
    counter
  }))

  res.status(status.HTTP_200_OK).json(counters)
})

// Create a new counter
router.post('/:name', (req, res) => {
  const { name } = req.params
  req.app.logger.info(`Request to Create counter: ${name}...`)

  if (name in COUNTER) {
    return res.status(status.HTTP_409_CONFLICT).json({
      status: status.HTTP_409_CONFLICT,
      error: 'Conflict',
      message: `Counter ${name} already exists`
    })
  }

  COUNTER[name] = 0

  const locationUrl = `${req.protocol}://${req.get('host')}/counters/${name}`

  res.status(status.HTTP_201_CREATED)
    .location(locationUrl)
    .json({ name, counter: 0 })
})

// Read a specific counter
router.get('/:name', (req, res) => {
  const { name } = req.params
  req.app.logger.info(`Request to Read counter: ${name}...`)

  if (!(name in COUNTER)) {
    return res.status(status.HTTP_404_NOT_FOUND).json({
      status: status.HTTP_404_NOT_FOUND,
      error: 'Not Found',
      message: `Counter ${name} does not exist`
    })
  }

  const counter = COUNTER[name]
  res.status(status.HTTP_200_OK).json({ name, counter })
})

// Update (increment) a counter
router.put('/:name', (req, res) => {
  const { name } = req.params
  req.app.logger.info(`Request to Update counter: ${name}...`)

  if (!(name in COUNTER)) {
    return res.status(status.HTTP_404_NOT_FOUND).json({
      status: status.HTTP_404_NOT_FOUND,
      error: 'Not Found',
      message: `Counter ${name} does not exist`
    })
  }

  COUNTER[name] += 1
  const counter = COUNTER[name]

  res.status(status.HTTP_200_OK).json({ name, counter })
})

// Delete a counter
router.delete('/:name', (req, res) => {
  const { name } = req.params
  req.app.logger.info(`Request to Delete counter: ${name}...`)

  if (name in COUNTER) {
    delete COUNTER[name]
  }

  res.status(status.HTTP_204_NO_CONTENT).send()
})

// Utility function for testing
function resetCounters () {
  COUNTER = {}
}

module.exports = router
module.exports.resetCounters = resetCounters
