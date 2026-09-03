// Cette fonction est appelée une fois par jour par Vercel Cron (voir vercel.json).
// Elle tire 3 horaires au hasard entre HOUR_START et HOUR_END, et programme
// une notification OneSignal pour chacun, avec un message choisi au hasard
// dans la liste MESSAGES ci-dessous.
//
// 👉 C'est ICI que tu ajoutes / modifies tes messages perso.

const MESSAGES = [
  "Good girls drink water 🧚🏻‍♀️",
  "Time to drink water 🤪",
  "Drink and swallow, be my good girl 🌚",
];

const HOUR_START = 8;  // 8h
const HOUR_END = 20;   // 20h
const NOTIFICATIONS_PER_DAY = 3;

// Vercel Cron ne fait qu'un GET — on protège l'endpoint avec un secret
// pour éviter que n'importe qui puisse le déclencher depuis internet.
function isAuthorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // pas de secret configuré = pas de protection (ok en test)
  const auth = req.headers['authorization'];
  return auth === `Bearer ${secret}`;
}

function randomTime(startHour, endHour) {
  const startMin = startHour * 60;
  const endMin = endHour * 60;
  const minutes = startMin + Math.floor(Math.random() * (endMin - startMin));
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(m).padStart(2, '0')}${period}`; // ex: "9:05AM"
}

async function sendScheduled(deliveryTimeOfDay, message) {
  const res = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
    },
    body: JSON.stringify({
      app_id: process.env.ONESIGNAL_APP_ID,
      included_segments: ['Subscribed Users'],
      contents: { fr: message, en: message },
      delayed_option: 'timezone',
      delivery_time_of_day: deliveryTimeOfDay,
      throttle_rate_per_minute: 0,
    }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, deliveryTimeOfDay, data };
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const results = [];
  for (let i = 0; i < NOTIFICATIONS_PER_DAY; i++) {
    const time = randomTime(HOUR_START, HOUR_END);
    const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    const result = await sendScheduled(time, message);
    results.push(result);
  }

  res.status(200).json({ scheduled: results });
}
