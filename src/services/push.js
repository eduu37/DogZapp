import admin from "firebase-admin";
import fs from "fs";

if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  const serviceAccount = JSON.parse(fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf8"));
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

export async function sendPushToTokens(tokens, message) {
  if (!admin.apps.length) return;

  const payload = {
    notification: { title: message.title, body: message.body },
    data: message.data || {}
  };

  const BATCH = 500;
  for (let i = 0; i < tokens.length; i += BATCH) {
    const subset = tokens.slice(i, i + BATCH);
    try {
      await admin.messaging().sendToDevice(subset, payload);
    } catch (err) {
      console.error("Error enviando push:", err);
    }
  }
}
