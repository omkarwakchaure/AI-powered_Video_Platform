export const headerConfig = {
  brand: {
    title: 'MediaMixer',
    showMenuButton: true,
  },
  notifications: {
    enabled: false,
    showIndicator: false,
  },
  userMenu: {
    showProfile: true,
    showSettings: true,
    showLogout: true,
  },
};

export const userMenuConfig = {
  header: {
    showAvatar: true,
    showEmail: true,
    showRole: true,
  },
  items: [
    { key: 'profile', label: 'Profile', enabled: true, icon: 'UserIcon' },
    { key: 'settings', label: 'Settings', enabled: true, icon: 'Cog6ToothIcon' },
  ],
  logout: {
    enabled: true,
    label: 'Logout',
    icon: 'ArrowRightStartOnRectangleIcon',
  },
};
