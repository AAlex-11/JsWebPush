// sw.js

// Listen for push events
self.addEventListener('push', (event) => {
    const payload = event.data ? event.data.json() : { title: 'New Notification', body: 'You have a new message!' };
    console.log('Push event received:', payload);
    // Display a notification
    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: payload.icon || '/icon.png',
            data: { url: payload.url } // Optional: URL to open when the notification is clicked
        })
    );

    // Send a message to the client to show an in-app notification
    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            client.postMessage({
                type: 'show-notification',
                body: payload.body
            });
        });
    });
});

// Listen for notification click events
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Close the notification

    // Open a URL if provided in the notification data
    if (event.notification.data && event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});