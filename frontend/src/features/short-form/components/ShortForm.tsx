import { useSideBar } from '@/core/context/SideBarContext';
import { ROUTES } from '@/core/utils';
import { BlogForm } from '@/features/blog';

import { DefaultSpaceId } from '@nest/shared';

import React from 'react';
import { matchPath } from 'react-router-dom';

export const ShortForm = () => {
  const { dispatch } = useSideBar();
  const match = matchPath(ROUTES.SPACE, document.location.pathname);
  const id = match?.params.id || DefaultSpaceId;
 
  return <BlogForm spaceId={id} onSuccess={() => dispatch({ type: 'closeAll' })} />;
};
