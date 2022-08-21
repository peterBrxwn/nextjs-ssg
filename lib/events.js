import fetch from 'node-fetch';

export async function getEventsData() {
  const res = await fetch('http://localhost:5001/directly-test/us-central1/event-api/api/events');
  return res.json();
}