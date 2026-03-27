import { ArrowRightStartOnRectangleIcon, Bars3Icon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';
import React from 'react';
import Logo from '../../commonFiles/Logo';

const SidebarLayout = ({ logo, menuConfig, pathname, isSidebarCollapsed, isMobileMenuOpen, onNavigate, onToggleSidebar, onCloseMobileMenu, onLogout }) => {
  const [expanded, setExpanded] = useState({});

  // useEffect to set selected item to remain expanded even if the page gets refreshed.
  useEffect(() => {
    menuConfig.forEach((item) => {
      if (item.children?.some((child) => pathname.startsWith(child.path))) {
        setExpanded((prev) => ({ ...prev, [item.id]: true }));
      }
    });
  }, [pathname, menuConfig]);

  const toggle = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-screen bg-plain border-r border-border transition-all duration-300 z-30 flex flex-col ${
          isMobileMenuOpen ? 'flex w-full md:hidden' : 'hidden'
        } ${!isMobileMenuOpen && isSidebarCollapsed ? 'md:flex md:w-16' : ''} ${!isMobileMenuOpen && !isSidebarCollapsed ? 'md:flex md:w-64' : ''}`}
      >
        <div className={`h-16 flex items-center border-b border-border ${isSidebarCollapsed && !isMobileMenuOpen ? 'px-2 justify-center' : 'px-4'}`}>
          {/* LEFT GROUP: Menu + Title */}
          <div className={`flex items-center ${isSidebarCollapsed && !isMobileMenuOpen ? 'justify-center w-full' : 'gap-6'}`}>
            <button onClick={onToggleSidebar} className="p-2 rounded-lg hover:bg-background transition-colors hidden md:block cursor-pointer">
              {isSidebarCollapsed && !isMobileMenuOpen ? (logo?.icon ?? <Logo size="sm" variant="icon" />) : <Bars3Icon className="w-6 h-6 text-text" />}
            </button>

            {/* Desktop logo */}
            {!isSidebarCollapsed && <div className="hidden md:block">{logo?.full ?? <Logo size="md" />}</div>}

            {/* Mobile logo */}
            <div className="md:hidden">{logo?.full ?? <Logo size="md" />}</div>
          </div>

          {/* RIGHT: Mobile close button */}
          <div className="ml-auto md:hidden">
            <button onClick={onCloseMobileMenu} className="p-2 rounded-lg hover:bg-background transition-colors cursor-pointer" aria-label="Close Menu">
              <XMarkIcon className="w-6 h-6 text-text" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {menuConfig.map((item) => {
              const Icon = item.icon;
              const isOpen = expanded[item.id];
              const isActiveItem = item.path && pathname === item.path;
              const isSelectionActive = item.children?.some((child) => pathname.startsWith(child.path));

              if (!item.children) {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.path) {
                        onNavigate(item.path);
                        onCloseMobileMenu();
                      }

                      onCloseMobileMenu();
                    }}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors group cursor-pointer ${
                      isSidebarCollapsed ? 'justify-center' : 'space-x-3'
                    } ${isActiveItem ? 'text-primary font-medium' : 'hover:bg-background text-text/90 font-medium'}`}
                  >
                    {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                    {(!isSidebarCollapsed || isMobileMenuOpen) && <span>{item.label}</span>}
                  </button>
                );
              }

              return (
                <div key={item.id}>
                  <button
                    onClick={() => toggle(item.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors group cursor-pointer ${
                      isSidebarCollapsed ? 'justify-center' : 'justify-between'
                    }  ${isSelectionActive ? 'text-primary' : 'hover:bg-background'}`}
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? '' : 'space-x-3'}`}>
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {(!isSidebarCollapsed || isMobileMenuOpen) && <span className="font-medium">{item.label}</span>}
                    </div>

                    {(!isSidebarCollapsed || isMobileMenuOpen) && <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
                  </button>

                  {isOpen && (!isSidebarCollapsed || isMobileMenuOpen) && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;

                        return (
                          <button
                            key={child.path}
                            onClick={() => {
                              onNavigate(child.path);
                              onCloseMobileMenu();
                            }}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${
                              pathname === child.path ? 'bg-background/70 text-primary' : 'hover:bg-background'
                            }`}
                          >
                            {ChildIcon && <ChildIcon className="w-4 h-4 text-text/60 flex-shrink-0" />}
                            <span>{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Logout Button (sticky at bottom) */}
        <div className="mt-auto p-4 border-t border-border">
          <button
            type="button"
            className={`w-full flex items-center p-3 rounded-lg hover:bg-alert/5 hover:text-alert transition-colors relative group cursor-pointer ${
              isSidebarCollapsed ? 'justify-center' : 'space-x-3'
            }`}
            onClick={onLogout}
          >
            <ArrowRightStartOnRectangleIcon className="text-text/80 group-hover:text-alert w-6 h-6 flex-shrink-0" />
            {(!isSidebarCollapsed || isMobileMenuOpen) && <span className="text-text/90 group-hover:text-alert font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarLayout;
