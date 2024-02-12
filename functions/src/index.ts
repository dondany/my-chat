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
import { onDocumentCreated } from 'firebase-functions/v2/firestore';

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
  const imgUrl =
    'https://i.pravatar.cc/50?img=' + Math.floor(Math.random() * 49 + 1);

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

export const messageCreated = onDocumentCreated(
  'conversations/{conversationId}/messages/{messageId}',
  (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log('No data associated with the event!');
      return;
    }
    const data = snapshot.data();
    const messageContent = data.content;
    const messageId = event.params.messageId;
    const senderId = data.sender;
    const messageCreated = data.created;
    const conversationId = event.params.conversationId;
    const latestMessageId = conversationId + '_' + senderId;

    const conversationRef = admin
      .firestore()
      .collection('conversations')
      .doc(conversationId);

    const latestMessageRef = admin
      .firestore()
      .collection('latestMessages')
      .doc(latestMessageId);

    return admin
      .firestore()
      .runTransaction(async (trx) => {
        trx.update(conversationRef, {
          latestMessage: messageContent,
          latestMessageUid: messageId,
        });
        const latestMessageDoc = (await latestMessageRef.get()).data();
        if (latestMessageDoc) {
          trx.update(latestMessageRef, {
            messageUid: messageId,
            messageCreated: messageCreated,
          });
        } else {
          trx.create(latestMessageRef, {
            uid: latestMessageId,
            userUid: senderId,
            conversationUid: conversationId,
            messageUid: messageId,
            messageCreated: messageCreated,
          });
        }
      })
      .catch((error) => {
        console.error('Transaction failed: ', error);
        throw error;
      });
  }
);
