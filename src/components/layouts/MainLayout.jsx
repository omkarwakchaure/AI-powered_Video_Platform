import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import HeaderLayout from './partials/HeaderLayout';
import SearchBar from '../innerpages/searchPart/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import SidebarLayout from './partials/SidebarLayout';
import { SIDEBAR_CONFIG } from '../config/sidebar';
import { headerConfig, userMenuConfig } from '../config/header';
import { closeMobileMenu, toggleMobileMenu, toggleSidebar } from '../../store/slices/sidebarSlice';
import Logo from '../commonFiles/Logo';

const MainLayout = () => {
  const { isSidebarCollapsed } = useSelector((state) => state.sidebar);
  const { isMobileMenuOpen } = useSelector((state) => state.sidebar);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const isShortsPage = pathname === '/shorts';

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Side Panel */}
      <SidebarLayout
        logo={{
          full: <Logo size="md" />, // shown when expanded
          icon: <Logo size="sm" variant="icon" />, // shown when collapsed
        }}
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
      <div className={`flex flex-col flex-1 min-h-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} ml-0`}>
        <HeaderLayout
          user={{ name: 'Omkar Wakchaure', email: 'omkarwakchaure2019@gmail.com', role: { name: 'Admin' } }}
          logo={<Logo size="sm" variant="icon" />}
          isAuthenticated={true}
          userMenuConfig={userMenuConfig}
          headerConfig={headerConfig}
          onToggleMobileMenu={() => dispatch(toggleMobileMenu())}
        >
          <SearchBar />
        </HeaderLayout>

        {/* Page Content */}
        <main className={`flex-1 overflow-hidden min-h-0 ${isShortsPage ? '' : 'p-2 sm:p-4'}`}>
          <div className={isShortsPage ? 'h-full' : 'bg-plain rounded-md shadow-md p-6 max-w-full h-full flex flex-col'}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
