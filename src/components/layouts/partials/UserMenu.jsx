import { ArrowRightStartOnRectangleIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';
import React from 'react';

const ICONS = { UserIcon, Cog6ToothIcon, ArrowRightStartOnRectangleIcon };

const UserMenu = ({ user, config }) => {
  return createPortal(
    <div
      className="
        fixed z-[9999]
        right-2 sm:right-4 md:right-6
        top-14 sm:top-16
        w-[calc(100vw-1rem)] max-w-[14rem]
        bg-plain shadow-lg rounded-lg border border-border
      "
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="flex items-center gap-3">
          {config.header.showAvatar && (
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
              <span className="text-plain text-sm font-medium">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            {config.header.showEmail && <p className="text-xs text-text/70 truncate">{user.email}</p>}
            {config.header.showRole && <p className="text-xs text-text/60 truncate">{user.role?.name}</p>}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1 sm:py-2">
        {config.items.map(
          (item) =>
            item.enabled && (
              <button key={item.key} onClick={item.onClick} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-background transition-colors cursor-pointer">
                {item.icon &&
                  (() => {
                    const Icon = ICONS[item.icon];
                    return Icon ? <Icon className="w-4 h-4 text-text/70 shrink-0" /> : null;
                  })()}
                {item.label}
              </button>
            )
        )}
      </div>

      {/* Logout */}
      {config.logout.enabled && (
        <div className="border-t border-border py-1 sm:py-2">
          <button onClick={config.logout.onClick} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-alert hover:bg-alert/5 cursor-pointer">
            {config.logout.icon &&
              (() => {
                const Icon = ICONS[config.logout.icon];
                return Icon ? <Icon className="w-4 h-4 shrink-0" /> : null;
              })()}
            {config.logout.label}
          </button>
        </div>
      )}
    </div>,
    document.body
  );
};

export default UserMenu;
