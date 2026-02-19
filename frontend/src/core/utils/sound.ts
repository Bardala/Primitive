export const playNotificationSound = (format: 'mp3' | 'wav' = 'wav') => {
  const audio = new Audio(`/notification.${format}`);
  audio.play().catch(err => {
    console.warn('Could not play notification sound:', err);
  });
};
