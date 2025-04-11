const axios = require('axios');

// Configure with your frontend and backend URLs
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://engagement-gallery.onrender.com';
const BACKEND_URL = process.env.BACKEND_URL || 'https://weddingbackend-1fp6.onrender.com';
const PING_INTERVAL = process.env.PING_INTERVAL || 300000; // 5 minutes (reduced from 14 minutes)

/**
 * Ping service to keep it alive
 * @param {string} url - The URL to ping
 * @returns {Promise<void>}
 */
const pingService = async (url) => {
  try {
    const response = await axios.get(url);
    console.log(`[${new Date().toISOString()}] Pinged ${url} - Status: ${response.status}`);
    return response;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error pinging ${url}:`, error.message);
    return null;
  }
};

/**
 * Initialize the keep-alive mechanism for both frontend and backend
 */
const initKeepAlive = () => {
  console.log(`[${new Date().toISOString()}] Starting keep-alive pings every ${PING_INTERVAL/1000} seconds (5 minutes)`);
  
  // Immediately ping both services when starting up
  pingService(FRONTEND_URL);
  pingService(BACKEND_URL);

  // Set up recurring pings for both services
  setInterval(() => {
    pingService(FRONTEND_URL);
    pingService(BACKEND_URL);
  }, PING_INTERVAL);
};

module.exports = { 
  initKeepAlive,
  pingService
}; 