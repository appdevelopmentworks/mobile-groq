'use client'

import { useState } from 'react';
import { MessageCircle, BookUser, Settings } from 'lucide-react';
import { ChatPage } from '@/components/pages/chat-page';
import { HowToUsePage } from '@/components/pages/how-to-use-page';
import { SettingsPage } from '@/components/pages/settings-page';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'chat', label: 'チャット', icon: MessageCircle, component: ChatPage },
  { id: 'usage', label: '使い方', icon: BookUser, component: HowToUsePage },
  { id: 'settings', label: '設定', icon: Settings, component: SettingsPage },
];

export function MainNav() {
  const [activePage, setActivePage] = useState('chat');

  const ActiveComponent = navItems.find(item => item.id === activePage)?.component || ChatPage;

  const NavLinks = ({ isMobile }: { isMobile: boolean }) => (
    <nav className={cn(isMobile ? 'flex justify-around' : 'flex flex-col space-y-2', 'p-2')}>
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => setActivePage(item.id)}
          className={cn(
            'flex items-center justify-center p-3 rounded-lg transition-colors',
            isMobile ? 'flex-col w-full' : 'space-x-3',
            activePage === item.id
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted'
          )}
        >
          <item.icon className="h-6 w-6" />
          <span className={cn('text-xs', isMobile ? 'mt-1' : 'text-sm')}>{item.label}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 border-r">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Groq AI Chat</h1>
        </div>
        <NavLinks isMobile={false} />
      </aside>

      <div className="flex flex-col flex-1">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <ActiveComponent />
        </main>

        {/* Bottom Nav for Mobile */}
        <footer className="md:hidden border-t">
          <NavLinks isMobile={true} />
        </footer>
      </div>
    </div>
  );
}
