import { Sidebar } from '../components/SideBar';

export const Home = () => {
  return (
    <div className="home">
      <main>
        <h1>Home</h1>
      </main>
      <div className="side-bar">
        <Sidebar />
      </div>
    </div>
  );
};
