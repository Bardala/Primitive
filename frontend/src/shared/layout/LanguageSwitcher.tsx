import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLang = (lng: 'en' | 'ar') => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  const currentLang = i18n.language;

  return (
    <div className="flex items-center gap-1 rounded-xl bg-background-light p-1 dark:bg-background-dark/50">
      <button
        onClick={() => changeLang('en')}
        className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
          currentLang === 'en'
            ? 'bg-surface-light text-primary-600 shadow-sm dark:bg-surface-dark dark:text-primary-400'
            : 'text-text-secondary-light hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:text-text-primary-dark'
        }`}
      >
        English
      </button>
      <button
        onClick={() => changeLang('ar')}
        className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
          currentLang === 'ar'
            ? 'bg-surface-light text-primary-600 shadow-sm dark:bg-surface-dark dark:text-primary-400'
            : 'text-text-secondary-light hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:text-text-primary-dark'
        }`}
      >
        العربية
      </button>
    </div>
  );
};
