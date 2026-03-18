import admin from 'firebase-admin';
import path from 'path';

// Point to the JSON file you downloaded in Step 1
const serviceAccount = require(path.join(__dirname, '../../clanclasher-27m12-firebase-adminsdk-fbsvc-b26dcbbac4.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;