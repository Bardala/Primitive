import { MainLayout } from '@/app/layout';

import { useParams } from 'react-router-dom';

import { BlogForm } from '../components/BlogForm';

export const CreateBlogPage: React.FC = () => {
  const { spaceId, spaceName } = useParams();

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-surface-light p-6 shadow-xl ring-1 ring-border-light dark:bg-surface-dark dark:ring-border-dark sm:p-10">
          <BlogForm spaceId={spaceId!} spaceName={spaceName} />
        </div>
      </div>
    </MainLayout>
  );
};
