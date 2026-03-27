import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import HeaderLayout from './partials/HeaderLayout';
import SearchBar from '../innerpages/searchPart/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import SidebarLayout from './partials/SidebarLayout';
import { SIDEBAR_CONFIG } from '../config/sidebar';
import { headerConfig, userMenuConfig } from '../config/header';
import { closeMobileMenu, toggleMobileMenu, toggleSidebar } from '../../store/slices/sidebarSlice';

const MainLayout = () => {
  const { isSidebarCollapsed } = useSelector((state) => state.sidebar);
  const { isMobileMenuOpen } = useSelector((state) => state.sidebar);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Side Panel */}
      <SidebarLayout
        title="Title"
        menuConfig={SIDEBAR_CONFIG}
        pathname={pathname}
        isSidebarCollapsed={isSidebarCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        onNavigate={(path) => navigate(path)}
        onToggleSidebar={() => dispatch(toggleSidebar())}
        onCloseMobileMenu={() => dispatch(closeMobileMenu())}
        onLogout={() => {}}
      />

      {/* Main Content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} ml-0`}>
        <HeaderLayout
          user={{ name: 'Omkar Wakchaure', email: 'omkarwakchaure2019@gmail.com', role: { name: 'Admin' } }}
          isAuthenticated={true}
          userMenuConfig={userMenuConfig}
          headerConfig={headerConfig}
          onToggleMobileMenu={() => dispatch(toggleMobileMenu())}
        >
          <SearchBar />
        </HeaderLayout>

        {/* Page Content */}
        <main className="p-2 sm:p-4 flex-1 overflow-y-auto">
          <div className="bg-plain rounded-md shadow-md p-6 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
