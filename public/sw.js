// public/sw.js — MNEMO Service Worker (PWA notifications)

const CACHE_NAME = 'mnemo-v1';

// Install
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Store scheduled reminders
const scheduledTimers = new Map();

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};

  if (type === 'SCHEDULE_REMINDER') {
    const { id, text, time, date } = data;
    
    // Calculate ms until 15 minutes before the scheduled time
    const [hours, minutes] = time.split(':').map(Number);
    const targetDate = new Date(date + 'T' + time.padStart(5, '0') + ':00');
    const reminderTime = new Date(targetDate.getTime() - 15 * 60 * 1000); // 15 min before
    const now = new Date();
    const delay = reminderTime.getTime() - now.getTime();

    if (delay > 0) {
      // Clear existing timer for this id
      if (scheduledTimers.has(id)) {
        clearTimeout(scheduledTimers.get(id));
      }

      const timer = setTimeout(() => {
        self.registration.showNotification('MNEMO 待办提醒', {
          body: `⏰ 15分钟后: ${text}`,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: `todo-${id}`,
          data: { type: 'todo', id },
          requireInteraction: true,
          actions: [
            { action: 'open', title: '查看' },
            { action: 'dismiss', title: '知道了' },
          ],
        });
        scheduledTimers.delete(id);
      }, delay);

      scheduledTimers.set(id, timer);
    }
  }

  if (type === 'CANCEL_REMINDER') {
    const { id } = data;
    if (scheduledTimers.has(id)) {
      clearTimeout(scheduledTimers.get(id));
      scheduledTimers.delete(id);
    }
  }

  if (type === 'SCHEDULE_ALL') {
    // Re-schedule all todos with time (called on app open)
    const { todos } = data;
    const today = new Date().toISOString().slice(0, 10);
    
    todos.forEach((todo, i) => {
      if (!todo.done && todo.time && /^\d{1,2}:\d{2}$/.test(todo.time) && todo.date === today) {
        const [hours, minutes] = todo.time.split(':').map(Number);
        const targetDate = new Date(today + 'T' + todo.time.padStart(5, '0') + ':00');
        const reminderTime = new Date(targetDate.getTime() - 15 * 60 * 1000);
        const now = new Date();
        const delay = reminderTime.getTime() - now.getTime();

        if (delay > 0) {
          const id = `${todo.text}-${todo.time}`;
          if (scheduledTimers.has(id)) clearTimeout(scheduledTimers.get(id));

          const timer = setTimeout(() => {
            self.registration.showNotification('MNEMO 待办提醒', {
              body: `⏰ 15分钟后: ${todo.text} (${todo.time})`,
              icon: '/icon-192.png',
              badge: '/icon-192.png',
              tag: `todo-${i}`,
              requireInteraction: true,
            });
            scheduledTimers.delete(id);
          }, delay);

          scheduledTimers.set(id, timer);
        }
      }
    });
  }
});

// Handle notification click — open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      // Or open new window
      return clients.openWindow('/');
    })
  );
});
