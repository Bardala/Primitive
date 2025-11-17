import { formatDistanceToNowStrict } from 'date-fns';
import { NOTIFICATION_TYPE, NotificationTitleMessage, Store } from 'react-notifications-component';

export function isArabic(str: string, threshold: number = 0.3): boolean {
  const arabicRegex = /[\u0600-\u06FF]/g;
  const arabicMatches = str.match(arabicRegex);
  const arabicCount = arabicMatches ? arabicMatches.length : 0;

  const totalLetters = str.replace(/\s/g, '').length; // exclude spaces
  const ratio = totalLetters > 0 ? arabicCount / totalLetters : 0;

  return ratio >= threshold;
}

export function formatTimeShort(date: number | Date): string {
  let time = formatDistanceToNowStrict(date);
  time = time.replace('second', 'sec');
  time = time.replace('minute', 'm');
  time = time.replace('hour', 'h');
  time = time.replace('day', 'd');
  time = time.replace('month', 'mo');
  time = time.replace('year', 'y');
  return time;
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
