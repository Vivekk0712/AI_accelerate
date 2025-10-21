const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

try {
  let credential;
  
  // Check if service account JSON is provided as environment variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    credential = admin.credential.cert(serviceAccount);
    console.log('Using Firebase credentials from environment variable');
  } 
  // Check if service account file exists (for local development)
  else {
    const serviceAccountPath = path.join(__dirname, 'serviceAccount.json');
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      credential = admin.credential.cert(serviceAccount);
      console.log('Using Firebase credentials from serviceAccount.json file');
    } else {
      throw new Error('Firebase credentials not found. Please add serviceAccount.json or set FIREBASE_SERVICE_ACCOUNT_JSON environment variable.');
    }
  }

  admin.initializeApp({
    credential: credential,
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
  
  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Firebase Admin SDK initialization error:', error);
  console.error('\nTo fix this:');
  console.error('1. Download serviceAccount.json from Firebase Console');
  console.error('2. Place it in backend/src/serviceAccount.json');
  console.error('3. Or set FIREBASE_SERVICE_ACCOUNT_JSON environment variable');
  process.exit(1);
}

module.exports = admin;
