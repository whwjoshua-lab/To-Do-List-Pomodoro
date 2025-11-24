const CACHE_NAME = 'pomodoro-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './backgroundSnow.js',
    './backgroundLeaves.js',
    './manifest.json',
    './icon.png',
    './Loopable (BGM.24 seconds).mp3',
    './Alarm Sound (15 seconds) .mp3'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
