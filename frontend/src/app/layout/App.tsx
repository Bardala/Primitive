import { AuthContextProvider, ThemeProvider } from '@/core/context';
import { SideBarProvider } from '@/core/context/SideBarContext';
import { requireAuth } from '@/core/hoc';
import { ErrorBoundary } from '@/core/hoc';
import { ROUTES } from '@/core/utils';
import { Login, SignUp } from '@/features/auth';
import { BlogDetails, CreateBlogPage, SeriesBlogsPage, TagBlogsPage } from '@/features/blog';
import { PrivateChatPage } from '@/features/chat';
import { ChatProvider } from '@/features/chat/context/ChatContext';
import { NotificationProvider } from '@/features/notification/context/NotificationContext';
import { NotificationPage } from '@/features/notification/pages';
import { Space } from '@/features/spaces';
import { UserProfile, UsersList } from '@/features/user';
import { NotFound } from '@/shared';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home } from './Home';
import { Settings } from './Settings';
import { NavbarLayout } from './NavbarLayout';
import { PlainLayout } from './PlainLayout';

const ProtectedCreateBlogPage = requireAuth(CreateBlogPage);
const ProtectedNotificationPage = requireAuth(NotificationPage);
const ProtectedSettings = requireAuth(Settings);
const ProtectedUserList = requireAuth(UsersList);
const ProtectUserProfile = requireAuth(UserProfile);
const ProtectedSpace = requireAuth(Space);
const ProtectedPrivateChatPage = requireAuth(PrivateChatPage);

function AppContent() {
  return (
    <div className="relative">
      <BrowserRouter>
        <Routes>
          {/* Routes without navbar */}
          <Route element={<PlainLayout/>} >
            <Route path={ROUTES.CREATE_BLOG} element={<ProtectedCreateBlogPage />} />
          </Route>

          {/* Routes with navbar */}
          <Route element={<NavbarLayout/>} >
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.SIGNUP} element={<SignUp />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.BLOG_DETAILS} element={<BlogDetails />} />
            <Route path={ROUTES.SPACE} element={<ProtectedSpace />} />
            <Route path={ROUTES.USER_PROFILE} element={<ProtectUserProfile />} />
            <Route path={ROUTES.USERS_LIST} element={<ProtectedUserList />} />
            <Route path={ROUTES.NOTIFICATIONS} element={<ProtectedNotificationPage />} />
            <Route path={ROUTES.SETTINGS} element={<ProtectedSettings />} />
            <Route path={ROUTES.CHAT} element={<ProtectedPrivateChatPage />} />
            <Route path={ROUTES.GET_TAG(':tag')} element={<TagBlogsPage />} />
            <Route path={ROUTES.GET_SERIES(':id')} element={<SeriesBlogsPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Analytics />
    </div>
  );
}

export function App() {
  const queryClient = new QueryClient();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthContextProvider>
            <ChatProvider>
              <NotificationProvider>
                <SideBarProvider>
                  <AppContent />
                </SideBarProvider>
              </NotificationProvider>
            </ChatProvider>
            {/* <ReactQueryDevtools /> */}
          </AuthContextProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
