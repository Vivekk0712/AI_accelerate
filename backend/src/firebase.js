const admin = require('firebase-admin');
require('dotenv').config();

try {
  let credential;
  
  // Check if service account JSON is provided as environment variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    credential = admin.credential.cert(serviceAccount);
  } 
  // Check if service account file exists (for local development)
  else if (require('fs').existsSync('./serviceAccount.json')) {
    const serviceAccount = require('./serviceAccount.json');
    credential = admin.credential.cert(serviceAccount);
  }
  // Fallback to application default credentials
  else {
    credential = admin.credential.applicationDefault();
  }

  admin.initializeApp({
    credential: credential,
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
  
  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Firebase Admin SDK initialization error:', error);
  process.exit(1);
}

module.exports = admin;
