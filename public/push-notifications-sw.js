self.addEventListener('push', (event) => {
  const payload = (() => {
    if (!event.data) {
      return {};
    }

    try {
      return event.data.json();
    } catch (error) {
      return {
        body: event.data.text(),
      };
    }
  })();

  const title = payload.title ?? 'Wildfire alert detected';
  const notificationOptions = {
    body: payload.body ?? 'Open the alert for more details.',
    data: payload.data ?? { url: payload.url ?? '/alerts' },
    tag: payload.tag,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
  };

  event.waitUntil(
    self.registration.showNotification(title, notificationOptions)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url ?? '/alerts',
    self.location.origin
  ).href;

  event.waitUntil(
    (async () => {
      const windowClients = await clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      if (windowClients.length > 0) {
        const firstClient = windowClients[0];
        if ('navigate' in firstClient) {
          await firstClient.navigate(targetUrl);
        }
        return firstClient.focus();
      }

      return clients.openWindow(targetUrl);
    })()
  );
});
