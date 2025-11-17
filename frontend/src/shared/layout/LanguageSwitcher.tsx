import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLang = (lng: 'en' | 'ar') => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'; // 👈 RTL support
  };

  return (
    <div>
      <button onClick={() => changeLang('en')}>English</button>
      <button onClick={() => changeLang('ar')}>العربية</button>
    </div>
  );
};
