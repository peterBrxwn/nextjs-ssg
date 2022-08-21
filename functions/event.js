const functions = require('firebase-functions');
const admin = require("firebase-admin");
const db = admin.firestore();
const express = require('express');
const app = express();

// GET /api/event
// Get all events details
app.get('/api/events', async (req, res) => {
  functions.logger.log(`Getting events data`);

  try {
    const snapshot = await db.collection(`/events/`).get();
    if (!snapshot.size) {
      return res.status(200).json([]);
    }
    const data = snapshot.docs.map((e) => e.data());
    res.set('Cache-Control', 'private, max-age=300');
    return res.status(200).json(data);
  } catch(error) {
    functions.logger.log(
      'Error getting message details',
      eventId,
      error.message
    );
    return res.sendStatus(500);
  }
});

// Expose the API as a function
exports.api = functions.https.onRequest(app);
// http://localhost:5001/directly-test/us-central1/event-api/api/event/test1235