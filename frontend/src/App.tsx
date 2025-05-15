import { ReactNotifications } from 'react-notifications-component';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { NavBar } from './components/NavBar';
import { BlogDetails } from './pages/BlogDetails';
import { CreateBlogPage } from './pages/CreateBlogPage';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NotificationPage } from './pages/NotificationPage';
import { Space } from './pages/Space';
import { UserProfile } from './pages/UserProfile';
import { UsersList } from './pages/UsersList';
import { SignUp } from './pages/signup';

function App() {
  return (
    <div className="App">
      <ReactNotifications />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/space/:id" element={<Space />} />
          <Route path="/b/:id" element={<BlogDetails />} />
          <Route path="*" element={<h1>Not Found</h1>} />
          <Route path="/u/:id" element={<UserProfile />} />
          <Route path="/u" element={<UsersList />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/new/b/:spaceName/:spaceId" element={<CreateBlogPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
