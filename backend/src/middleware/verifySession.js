const admin = require('../firebase');

async function verifySession(req, res, next) {
  const sessionCookie = req.cookies[process.env.SESSION_COOKIE_NAME] || '';
  const authHeader = req.headers.authorization;
  const idToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  try {
    let decodedClaims;
    
    // Try session cookie first (preferred)
    if (sessionCookie) {
      decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */);
    } 
    // Fallback to ID token from Authorization header (for mobile)
    else if (idToken) {
      decodedClaims = await admin.auth().verifyIdToken(idToken, true /** checkRevoked */);
    } 
    else {
      throw new Error('No authentication provided');
    }
    
    req.user = decodedClaims;
    next();
  } catch (error) {
    console.error('Auth verification error:', error.message);
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
  }
}

module.exports = verifySession;