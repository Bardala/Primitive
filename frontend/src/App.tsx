import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { NavBar } from './components/NavBar';
import { NotFound } from './components/NotFound';
import { requireAuth } from './hoc/requireAuth';
import { BlogDetails } from './pages/BlogDetails';
import { CreateBlogPage } from './pages/CreateBlogPage';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NotificationPage } from './pages/NotificationPage';
import { Space } from './pages/Space';
import { UserProfile } from './pages/UserProfile';
import { UsersList } from './pages/UsersList';
import { Settings } from './pages/settings';
import { SignUp } from './pages/signup';
import { ROUTES } from './utils/routes';

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

function App() {
  return <AppContent />;
}

export default App;
