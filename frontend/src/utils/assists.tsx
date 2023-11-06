import { NOTIFICATION_TYPE, NotificationTitleMessage, Store } from 'react-notifications-component';

export function isArabic(str: string): boolean {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(str);
}

export const ShortLength = 500;

export function addNotification({
  message,
  type,
}: {
  message: NotificationTitleMessage;
  type: NOTIFICATION_TYPE;
}): void {
  Store.addNotification({
    title: 'Notification',
    message,
    type, // 'default', 'success', 'info', 'warning'
    container: 'bottom-left', // where to position the notifications
    animationIn: ['animated', 'fadeIn'], // animate.css classes that's applied
    animationOut: ['animated', 'fadeOut'], // animate.css classes that's applied
    dismiss: {
      duration: 3000,
    },
  });
}
