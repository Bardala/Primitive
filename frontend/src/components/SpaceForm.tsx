import { CreateSpaceReq, Space, SpaceStatus, UpdateSpaceReq } from '@nest/shared';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { isArabic } from 'src/utils/assists';

export const SpaceForm: React.FC<{
  handleSubmit: FormEventHandler<HTMLFormElement>;
  isLoading: boolean;
  dispatch: any;
  state: CreateSpaceReq | UpdateSpaceReq;
  initialSpace?: Space;
}> = ({ handleSubmit, isLoading, dispatch, state }) => {
  const { t } = useTranslation();

  return (
    <form className="create-space-form" onSubmit={handleSubmit}>
      <input
        type="text"
        id="name"
        name="name"
        value={state.name}
        placeholder={t('spaceForm.namePlaceholder')}
        className={isArabic(state.name) ? 'arabic' : 'english'}
        onChange={e => dispatch({ type: 'SET_NAME', payload: e.target.value })}
      />

      <select
        name="status"
        id="status"
        value={state.status}
        onChange={e => dispatch({ type: 'SET_STATUS', payload: e.target.value as SpaceStatus })}
      >
        <option value="" disabled hidden>
          {t('spaceForm.status')}
        </option>
        <option value="public">{t('spaceForm.public')}</option>
        <option value="private">{t('spaceForm.private')}</option>
      </select>

      <textarea
        className={isArabic(state.description) ? 'arabic' : 'english'}
        placeholder={t('spaceForm.descriptionPlaceholder')}
        name="description"
        id="description"
        value={state.description}
        onChange={e => dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })}
      />

      <button type="submit" disabled={isLoading}>
        {t('spaceForm.create')}
      </button>
    </form>
  );
};
