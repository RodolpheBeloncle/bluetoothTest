self.addEventListener('push', function (event) {
    const data = event.data.json();

    const options = {
        body: data.body,
        icon: data.icon || 'assets/icons/icon-512x512.png',
        badge: data.badge || 'assets/icons/icon-128x128.png',
        image: data.image || 'assets/images/notification-banner.png', // Adding an image to the notification
        vibrate: [100, 50, 100], // Vibration pattern for emphasis
        requireInteraction: true, // Keeps the notification active until user interacts with it
        actions: data.actions || [
            { action: 'open', title: 'Open App', icon: 'assets/icons/open-icon.png' },
            { action: 'dismiss', title: 'Dismiss', icon: 'assets/icons/dismiss-icon.png' }
        ],
        data: {
            url: data.url // Custom data to be used for click actions
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.action === 'open') {
        clients.openWindow(event.notification.data.url);
    } else {
        // Handle other actions if needed
    }
});
