// Simple health check endpoint
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    message: 'RPG Todo API is running',
    timestamp: new Date().toISOString()
  });
}
