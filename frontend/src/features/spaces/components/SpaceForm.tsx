import { isArabic } from '@/core/utils';

import { CreateSpaceReq, Space, SpaceStatus, UpdateSpaceReq } from '@nest/shared';

import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export const SpaceForm: React.FC<{
  handleSubmit: FormEventHandler<HTMLFormElement>;
  isLoading: boolean;
  dispatch: any;
  state: CreateSpaceReq | UpdateSpaceReq;
  initialSpace?: Space;
}> = ({ handleSubmit, isLoading, dispatch, state }) => {
  const { t } = useTranslation();

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        id="name"
        name="name"
        value={state.name}
        placeholder={t('spaceForm.namePlaceholder')}
        className={`input-base w-full ${isArabic(state.name) ? 'text-right' : 'text-left'}`}
        onChange={e => dispatch({ type: 'SET_NAME', payload: e.target.value })}
      />

      <div className="relative">
        <select
          name="status"
          id="status"
          value={state.status}
          onChange={e => dispatch({ type: 'SET_STATUS', payload: e.target.value as SpaceStatus })}
          className="input-base w-full appearance-none pr-10"
        >
          <option value="" disabled hidden>
            {t('spaceForm.status')}
          </option>
          <option value="public">{t('spaceForm.public')}</option>
          <option value="private">{t('spaceForm.private')}</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary-light dark:text-text-secondary-dark">
          <svg
            className="h-4 w-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      <textarea
        className={`input-base min-h-[120px] w-full resize-y ${
          isArabic(state.description) ? 'text-right' : 'text-left'
        }`}
        placeholder={t('spaceForm.descriptionPlaceholder')}
        name="description"
        id="description"
        value={state.description}
        onChange={e => dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })}
      />

      <button type="submit" disabled={isLoading} className="btn-primary flex w-full justify-center">
        {isLoading ? <span className="animate-spin mr-2">⏳</span> : null}
        {t('spaceForm.create')}
      </button>
    </form>
  );
};
