import { formatDistanceToNowStrict } from 'date-fns';
import { NOTIFICATION_TYPE, NotificationTitleMessage, Store } from 'react-notifications-component';

export function isArabic(str: string, threshold: number = 0.3): boolean {
  let inCodeBlock = false;
  let inInlineCode = false;
  let arabicCount = 0;
  let totalChars = 0;
  let i = 0;

  while (i < str.length) {
    // Check for code block start/end
    if (str.slice(i, i+3) === '```') {
      inCodeBlock = !inCodeBlock;
      i += 3;
      continue;
    }
    
    // Check for inline code
    if (str[i] === '`' && !inCodeBlock) {
      inInlineCode = !inInlineCode;
      i++;
      continue;
    }
    
    // Skip characters inside code blocks
    if (inCodeBlock || inInlineCode) {
      i++;
      continue;
    }
    
    // Check for box-drawing characters (skip diagram lines)
    const boxChars = '┌─┐│└┘├┤┬┴┼═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬►◄•·…→←↑↓⇄⇆';
    if (boxChars.includes(str[i])) {
      // Skip the entire line (fast-forward to next newline)
      while (i < str.length && str[i] !== '\n') i++;
      continue;
    }
    
    // Count meaningful characters
    if (str[i] !== ' ' && str[i] !== '\n' && str[i] !== '\t' && str[i] !== '\r') {
      totalChars++;
      
      // Check if it's Arabic
      const code = str.charCodeAt(i);
      if (code >= 0x0600 && code <= 0x06FF) {
        arabicCount++;
      }
    }
    
    i++;
  }
  
  const ratio = totalChars > 0 ? arabicCount / totalChars : 0;
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
