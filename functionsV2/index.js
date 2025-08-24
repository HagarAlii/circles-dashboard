/* eslint-env node, commonjs */
const { setGlobalOptions } = require("firebase-functions");
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({ maxInstances: 10 });

exports.blockUsersOnReport = onDocumentWritten("users/{userId}", async (event) => {
  const { data, after } = event;

  if (!after.exists) {
    // Document deleted — no action needed
    return;
  }

  const userData = after.data();

  if (userData.reported >= 5 && !userData.isBlocked) {
    await after.ref.set({ isBlocked: true }, { merge: true });
    console.log(`Blocked user ${after.id} due to reports.`);
  }
});
