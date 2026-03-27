import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import UserMenu from './UserMenu';
import React from 'react';

const HeaderLayout = ({ user, userMenuConfig, headerConfig, isAuthenticated = true, onToggleMobileMenu, children, logo }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);

  const notificationRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full min-h-16 bg-plain shadow flex items-center px-3 sm:px-4 md:px-6 py-2 gap-2">
      {/* LEFT — logo (mobile) or hamburger fallback */}
      <div className="flex items-center flex-1">
        {logo ? (
          <div className="md:hidden" onClick={onToggleMobileMenu}>
            {logo}
          </div>
        ) : (
          headerConfig.brand.showMenuButton && (
            <div className="md:hidden">
              <button onClick={onToggleMobileMenu} className="p-2 rounded-lg hover:bg-background transition-colors cursor-pointer" aria-label="Toggle menu">
                <Bars3Icon className="w-5 h-5 text-text" />
              </button>
            </div>
          )
        )}
      </div>

      {/* CENTER — search bar */}
      <div className="w-[55vw] sm:w-[60vw] md:w-[500px] lg:w-[600px] xl:w-[700px] shrink-0">{children}</div>

      {/* RIGHT — icon actions */}
      <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
        {/* Notifications */}
        {headerConfig.notifications.enabled && (
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="text-text p-2 rounded-md hover:bg-background transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5" />
              {headerConfig.notifications.showIndicator && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-alert rounded-full" />}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-plain shadow-lg rounded-md text-text z-50 border border-border">
                <div className="p-4 border-b border-border">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-stone-600">No new notifications</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowUserPopup((prev) => !prev);
            }}
            className="text-text p-2 rounded-md hover:bg-background transition-colors cursor-pointer"
            aria-label="User profile"
          >
            <UserCircleIcon className="w-5 h-5" />
          </button>

          {isAuthenticated && user && showUserPopup && <UserMenu user={user} config={userMenuConfig} />}
        </div>
      </div>
    </header>
  );
};

export default HeaderLayout;
