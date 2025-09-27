const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// Reset pickupSlots every day at 4:00 AM (Johannesburg time)
exports.resetPickupSlots = functions.pubsub
  .schedule("0 4 * * *")
  .timeZone("Africa/Johannesburg")
  .onRun(async () => {
    const slotsRef = db.collection("pickupSlots");
    const snapshot = await slotsRef.get();

    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.update(doc.ref, { booked: 0 });
    });

    await batch.commit();
    console.log("✅ Pickup slots reset for the new day");
    return null;
  });
