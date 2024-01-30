/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();
// const db = admin.firestore();

export const userCreated = functions.auth.user().onCreate(async (user) => {
  const uid = user.uid;
  const email = user.email;
  const username = email?.substring(0, email.indexOf('@'));
  const imgUrl = 'https://i.pravatar.cc/50?img=' + Math.floor(Math.random() * 49 + 1);

  const userRef = admin.firestore().collection('users').doc(uid);

  try {
    await userRef.set({
      uid: uid,
      email,
      username,
      imgUrl,
    });
  } catch (error) {
    console.error('Error creating document:', error);
    throw new functions.https.HttpsError('internal', 'Error creating document');
  }
});
