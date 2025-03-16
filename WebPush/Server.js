import express from "express";
import webPush from "web-push";
import path from "path";
import { fileURLToPath } from "url";

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Set VAPID keys
const vapidKeys = {
    publicKey: 'BJWeyHa-92g1zmHs0Tt0CoWTtSFEUntkGHYt4AHm838HWEOBM30R5sgr7X3ODonL0eTnuZJzHPqq5L7rbOF4A9g', // Replace with your VAPID public key
    privateKey: 'MdcX_k4sZ7GwMzoEPIQKrHdc0mrHUtXYgirUC1XBHG0' // Replace with your VAPID private key
};
webPush.setVapidDetails(
    'mailto:your-email@example.com', // Contact email
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Middleware to parse JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));// Serve static files from the root directory

// Store subscriptions (in-memory for this example)
let subscriptions = [];

// Endpoint to save subscriptions
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    console.log('Subscription saved:', subscription);
    res.status(201).json({ message: 'Subscription saved.' });
});

// Function to send push notifications
function sendPushNotification(subscription, payload) {
    webPush.sendNotification(subscription, payload)
        .then(response => {
            console.log('Push notification sent:', response);
        })
        .catch(error => {
            console.error('Error sending push notification:', error);
        });
}

// Send notifications every 10 seconds
setInterval(() => {
    const payload = JSON.stringify({
        title: 'Periodic Notification',
        body: 'This is a periodic push notification sent every 10 seconds.',
        icon: '/icon.png',
        url: 'http://127.0.0.1:3000/' // URL to open when the notification is clicked
    });

    // Send notifications to all subscribers
    subscriptions.forEach(subscription => {
        sendPushNotification(subscription, payload);
    });
}, 10000); // 10 seconds

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

