const request = require('supertest')
const app = require('../src/app')
const { resetCounters } = require('../src/routes/counters')
const status = require('../src/utils/status')

describe('Counter API Service', () => {
  beforeEach(() => {
    resetCounters()
  })

  describe('GET /', () => {
    it('should return service information', async () => {
      const response = await request(app).get('/')

      expect(response.status).toBe(status.HTTP_200_OK)
      expect(response.body.message).toBe('Hit Counter Service')
      expect(response.body.version).toBe('1.0.0')
    })
  })

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health')

      expect(response.status).toBe(status.HTTP_200_OK)
      expect(response.body.status).toBe('OK')
    })
  })

  describe('POST /counters/:name', () => {
    it('should create a new counter', async () => {
      const name = 'foo'
      const response = await request(app).post(`/counters/${name}`)

      expect(response.status).toBe(status.HTTP_201_CREATED)
      expect(response.body.name).toBe(name)
      expect(response.body.counter).toBe(0)
    })

    it('should not create a duplicate counter', async () => {
      const name = 'foo'

      // Create first counter
      await request(app).post(`/counters/${name}`)

      // Try to create duplicate
      const response = await request(app).post(`/counters/${name}`)

      expect(response.status).toBe(status.HTTP_409_CONFLICT)
    })
  })

  describe('GET /counters', () => {
    it('should list all counters', async () => {
      let response = await request(app).get('/counters')

      expect(response.status).toBe(status.HTTP_200_OK)
      expect(response.body).toHaveLength(0)

      // Create a counter
      await request(app).post('/counters/foo')

      response = await request(app).get('/counters')
      expect(response.status).toBe(status.HTTP_200_OK)
      expect(response.body).toHaveLength(1)
    })
  })

  describe('GET /counters/:name', () => {
    it('should read a specific counter', async () => {
      const name = 'foo'

      // Create counter first
      await request(app).post(`/counters/${name}`)

      const response = await request(app).get(`/counters/${name}`)

      expect(response.status).toBe(status.HTTP_200_OK)
      expect(response.body.name).toBe(name)
      expect(response.body.counter).toBe(0)
    })

    it('should return 404 for non-existent counter', async () => {
      const response = await request(app).get('/counters/nonexistent')

      expect(response.status).toBe(status.HTTP_404_NOT_FOUND)
    })
  })

  describe('PUT /counters/:name', () => {
    it('should update (increment) a counter', async () => {
      const name = 'foo'

      // Create counter
      await request(app).post(`/counters/${name}`)

      // Update counter
      const response = await request(app).put(`/counters/${name}`)

      expect(response.status).toBe(status.HTTP_200_OK)
      expect(response.body.name).toBe(name)
      expect(response.body.counter).toBe(1)
    })

    it('should not update a missing counter', async () => {
      const response = await request(app).put('/counters/nonexistent')

      expect(response.status).toBe(status.HTTP_404_NOT_FOUND)
    })
  })

  describe('DELETE /counters/:name', () => {
    it('should delete a counter', async () => {
      const name = 'foo'

      // Create counter
      await request(app).post(`/counters/${name}`)

      // Delete counter
      let response = await request(app).delete(`/counters/${name}`)
      expect(response.status).toBe(status.HTTP_204_NO_CONTENT)

      // Delete again (should still return 204)
      response = await request(app).delete(`/counters/${name}`)
      expect(response.status).toBe(status.HTTP_204_NO_CONTENT)

      // Verify it's gone
      response = await request(app).get(`/counters/${name}`)
      expect(response.status).toBe(status.HTTP_404_NOT_FOUND)
    })
  })
})
