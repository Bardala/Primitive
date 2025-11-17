import { AuthContextProvider, ThemeProvider } from '@/core/context';
import { requireAuth } from '@/core/hoc';
import { ROUTES } from '@/core/utils';
import { Login, SignUp } from '@/features/auth';
import { BlogDetails, CreateBlogPage } from '@/features/blog';
import { NotificationPage } from '@/features/notification/pages';
import { Space } from '@/features/spaces';
import { UserProfile, UsersList } from '@/features/user';
import { NotFound } from '@/shared';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home } from './Home';
import { NavBar } from './NavBar';
import { Settings } from './Settings';

const ProtectedCreateBlogPage = requireAuth(CreateBlogPage);
const ProtectedNotificationPage = requireAuth(NotificationPage);
const ProtectedSettings = requireAuth(Settings);
const ProtectedUserList = requireAuth(UsersList);
const ProtectUserProfile = requireAuth(UserProfile);
const ProtectedSpace = requireAuth(Space);

function AppContent() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.SIGNUP} element={<SignUp />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.BLOG_DETAILS} element={<BlogDetails />} />
          <Route path="*" element={<NotFound />} />
          <Route path={ROUTES.SPACE} element={<ProtectedSpace />} />
          <Route path={ROUTES.USER_PROFILE} element={<ProtectUserProfile />} />
          <Route path={ROUTES.USERS_LIST} element={<ProtectedUserList />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<ProtectedNotificationPage />} />
          <Route path={ROUTES.CREATE_BLOG} element={<ProtectedCreateBlogPage />} />
          <Route path={ROUTES.SETTINGS} element={<ProtectedSettings />} />
        </Routes>
      </BrowserRouter>

      <Analytics />
    </div>
  );
}

export function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthContextProvider>
          <AppContent />
          <ReactQueryDevtools />
        </AuthContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
