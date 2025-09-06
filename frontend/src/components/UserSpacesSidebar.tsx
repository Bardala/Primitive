import { Space } from '@nest/shared';
import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiSearch, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import '../styles/userSpacesSidebar.css';

interface UserSpacesSidebarProps {
  spaces: Space[];
  isLoading: boolean;
  isError: boolean;
}

export const UserSpacesSidebar = ({ spaces, isLoading, isError }: UserSpacesSidebarProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filteredSpaces = spaces?.filter(
    space => space.name.toLowerCase().includes(search.toLowerCase()) && space.id !== '1'
  );

  const handleSearch = (e: FormEvent) => {
    const target = e.target as HTMLInputElement;
    setSearch(target.value);
  };

  return (
    <div className="spaces-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <FiUsers className="title-icon" />
          <h3>{t('userProfile.spaces')}</h3>
        </div>
      </div>

      <div className="sidebar-search">
        <FiSearch className="search-icon" />
        <input
          type="search"
          placeholder={t('userProfile.searchSpaces')}
          value={search}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="spaces-list">
        {isError && <div className="error-message">{t('userProfile.errorSpaces')}</div>}

        {isLoading && <div className="loading-state">{t('userProfile.loadingSpaces')}</div>}

        {filteredSpaces?.map(space => (
          <Link to={`/space/${space.id}`} className="space-item" key={space.id} title={space.name}>
            <div className="space-avatar">{space.name.charAt(0).toUpperCase()}</div>
            <div className="space-info">
              <span className="space-name">{space.name}</span>
              <span className={`space-status ${space.status}`}>{space.status}</span>
            </div>
          </Link>
        ))}

        {filteredSpaces?.length === 0 && !isLoading && (
          <div className="empty-state">
            <p>{t('userProfile.noSpaces')}</p>
            <Link to="/spaces" className="explore-link">
              <FiPlus className="link-icon" />
              Explore Spaces
            </Link>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <Link to="/spaces" className="view-all-link">
          View All Spaces
          <FiPlus className="link-icon" />
        </Link>
      </div>
    </div>
  );
};
