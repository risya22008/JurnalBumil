const admin = require("firebase-admin");

// Load Firebase service account credentials
const serviceAccount = require("./database-service-account-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://jurnalbumil-c9c5f-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.firestore(); // Firestore
const realtimeDb = admin.database(); // Realtime Database (opsional)

module.exports = { db, realtimeDb };
