'use client';

import {
  FilePenLineIcon,
  LucideIcon,
  Medal,
  Swords,
  User2Icon,
  UserCircle2Icon,
  BellRingIcon,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from './button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import NotificationPopover from '@/components/notification/notification-popover';
import { useAuthStore } from '@/lib/stores/auth-store';

// Types
interface NavPages {
  label: string;
  icon: LucideIcon;
  href: string;
}

type SideActionBase<T extends 'component' | 'link'> = {
  type: T;
} & (T extends 'component'
  ? { component: React.ComponentType }
  : { href: string; icon: LucideIcon });
type SideAction = SideActionBase<'component'> | SideActionBase<'link'>;

interface NavbarActions {
  pages: NavPages[];
  sideActions: SideAction[];
}

// User and admin configs
const USER_ACTIONS: NavbarActions = {
  pages: [
    {
      label: 'Challenges',
      icon: Swords,
      href: '/dashboard/challenge',
    },
    {
      label: 'Leaderboard',
      icon: Medal,
      href: '/dashboard/leaderboard',
    },
  ],
  sideActions: [
    {
      type: 'component',
      component: () => <NotificationPopover />,
    },
    {
      type: 'link',
      icon: User2Icon,
      href: '/profile',
    },
  ],
};

const ADMIN_ACTIONS: NavbarActions = {
  pages: [
    {
      label: 'Challenges',
      icon: Swords,
      href: '/dashboard/challenge',
    },
    {
      label: 'Leaderboard',
      icon: Medal,
      href: '/dashboard/leaderboard',
    },
    {
      label: 'Users',
      icon: UserCircle2Icon,
      href: '/dashboard/users',
    },
    {
      label: 'Submissions',
      icon: FilePenLineIcon,
      href: '/dashboard/submissions',
    },
    {
      label: 'Notify',
      icon: BellRingIcon,
      href: '/dashboard/notification',
    },
  ],
  sideActions: [
    {
      type: 'component',
      component: () => <NotificationPopover />,
    },
    {
      type: 'link',
      icon: User2Icon,
      href: '/profile',
    },
  ],
};

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { role } = useAuthStore();
  const { pages, sideActions } = role == 'admin' ? ADMIN_ACTIONS : USER_ACTIONS;

  return (
    <div className="flex flex-row items-center py-4 gap-4 bg-background/70 backdrop-blur-md shadow-lg">
      <h1 className="text-2xl font-display text-primary w-36 text-right pr-4">
        backdoor
      </h1>
      <div className="flex flex-row items-center gap-2">
        {pages.map((page) => (
          <Link href={page.href} key={page.label} prefetch>
            <Button
              size={'sm'}
              variant={'ghost'}
              effect={pathname === page.href ? 'underline' : 'hoverUnderline'}
              className={cn(
                'cursor-pointer normal-case text-muted-foreground',
                pathname === page.href ? 'text-foreground' : ''
              )}
            >
              <page.icon className="w-4 h-4" /> {page.label}
            </Button>
          </Link>
        ))}
      </div>
      <div className="flex flex-row items-center gap-2 ml-auto">
        {sideActions.map((action, index) => {
          if (action.type === 'link') {
            return (
              <Link href={action.href} key={index}>
                <Button
                  size="icon"
                  variant={'navSideAction'}
                  className="rounded-lg"
                >
                  <action.icon className="size-4" />
                </Button>
              </Link>
            );
          } else if (action.type === 'component') {
            return <action.component key={index} />;
          }
        })}
      </div>
    </div>
  );
};

export { Navbar };
