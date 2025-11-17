import { ROUTES } from '@/core/utils';

import { useTranslation } from 'react-i18next';
import { FiFrown, FiHome, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import '../styles/notFound.css';

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-icon">
            <FiFrown className="frown-icon" />
            <div className="pulse-effect"></div>
          </div>

          <h1 className="not-found-title">{t('notFound.title')}</h1>
          <p className="not-found-description">{t('notFound.description')}</p>

          <div className="error-code">404</div>

          <div className="not-found-actions">
            <Link to={ROUTES.HOME} className="action-btn primary">
              <FiHome className="btn-icon" />
              {t('notFound.goHome')}
            </Link>

            <button onClick={() => window.history.back()} className="action-btn secondary">
              {t('notFound.goBack')}
            </button>
          </div>

          <div className="suggestions">
            <h3 className="suggestions-title">{t('notFound.suggestionsTitle')}</h3>
            <ul className="suggestions-list">
              <li className="suggestion-item">
                <FiSearch className="suggestion-icon" />
                {t('notFound.suggestion1')}
              </li>
              <li className="suggestion-item">
                <span className="suggestion-icon">✓</span>
                {t('notFound.suggestion2')}
              </li>
              <li className="suggestion-item">
                <span className="suggestion-icon">↻</span>
                {t('notFound.suggestion3')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
