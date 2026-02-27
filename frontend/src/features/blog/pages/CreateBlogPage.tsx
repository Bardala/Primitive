import { MainLayout } from '@/app/layout';
import { BlogForm } from '../components/BlogForm';

export const CreateBlogPage: React.FC = () => {
  return (
    <MainLayout viewLeftSidebar={false} viewRightSidebar={false}>
      <div className="mx-auto max-w-5xl w-full px-4 py-8 sm:px-6 lg:px-8">
        <BlogForm />
      </div>
    </MainLayout>
  );
};
