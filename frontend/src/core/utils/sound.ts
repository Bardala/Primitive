export const playNotificationSound = (format: 'mp3' | 'wav' = 'wav') => {
  const audio = new Audio(`/notification.${format}`);
  audio.play().catch(err => {
    console.warn('Could not play notification sound:', err);
  });
};

export const showSystemNotification = (title: string, options?: NotificationOptions) => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return;
  }

  const createNotification = () => {
    const notification = new Notification(title, {
      icon: '/PrimitiveLogo.png',
      ...options,
    });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  };

  if (Notification.permission === 'granted') {
    createNotification();
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        createNotification();
      }
    });
  }
};
