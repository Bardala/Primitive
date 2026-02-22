import { MainLayout } from '@/app/layout';
import { isArabic } from '@/core/utils';

import { FormEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiBold, FiCode, FiImage, FiItalic, FiLink, FiList, FiType } from 'react-icons/fi';
import { MdFormatQuote } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { MyMarkdown } from '../components/MyMarkdown';
import { useCreateBlog } from '../hooks/useBlog';
import { useUserSeries } from '../hooks/useSeries';

// import '../styles/create-blog-page.css';

import { BlogForm } from '../components/BlogForm';

export const CreateBlogPage: React.FC = () => {
  const { spaceId, spaceName } = useParams();
  const { t } = useTranslation();

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
