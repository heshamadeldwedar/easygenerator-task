// Set environment variables BEFORE any imports
// This is critical because ConfigModule validates at import time
process.env.JWT_ACCESS_SECRET = 'test-jwt-secret-that-is-at-least-32-chars'
process.env.COOKIE_SECRET = 'test-cookie-secret-that-is-at-least-32-chars'
process.env.NODE_ENV = 'test'
process.env.BCRYPT_ROUNDS = '4' // Faster for tests
process.env.MONGO_URI = 'mongodb://localhost:27017/test' // Placeholder, overridden per test

export {}
