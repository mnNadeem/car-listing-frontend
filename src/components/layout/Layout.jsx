import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './Layout.css';

function Layout() {
  return (
    <div className="layout">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-main">
          <div className="layout-content">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
