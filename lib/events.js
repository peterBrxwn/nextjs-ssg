import fetch from 'node-fetch';

export async function getEventsData() {
  const res = await fetch('https://us-central1-directly-test.cloudfunctions.net/event-api/api/events');
  return res.json();
}