function init (app) {
  // Simple logger setup
  app.logger = {
    info: (message) => {
      const timestamp = new Date().toISOString()
      console.log(`[${timestamp}] [INFO] ${message}`)
    },
    error: (message) => {
      const timestamp = new Date().toISOString()
      console.error(`[${timestamp}] [ERROR] ${message}`)
    },
    warning: (message) => {
      const timestamp = new Date().toISOString()
      console.warn(`[${timestamp}] [WARNING] ${message}`)
    }
  }

  app.logger.info('Logging handler established')
}

module.exports = { init }
