import React from 'react';
import { BlogForm } from '@/features/blog';
import { DefaultSpaceId } from '@nest/shared';
import { useSideBar } from '@/core/context/SideBarContext';
import { useParams } from 'react-router-dom';

export const ShortForm = () => {
  const { dispatch } = useSideBar();
  const id = useParams().id || DefaultSpaceId;

  return (
    <BlogForm 
      spaceId={id} 
      onSuccess={() => dispatch({ type: 'closeAll' })} 
    />
  );
};
