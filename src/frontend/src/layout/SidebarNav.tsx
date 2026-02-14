import { Link, useRouterState } from '@tanstack/react-router';
import { Home, Trophy, Play, Monitor, Users, UserCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import TournamentSwitcher from '../components/tournaments/TournamentSwitcher';
import LoginButton from '../components/auth/LoginButton';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: Home },
  { title: 'Matches', href: '/matches', icon: Trophy },
  { title: 'Teams', href: '/teams', icon: Users },
  { title: 'Players', href: '/players', icon: UserCircle },
  { title: 'Reports', href: '/reports', icon: FileText },
];

export default function SidebarNav({ onNavigate }: { onNavigate?: () => void } = {}) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="flex h-full flex-col border-r bg-sidebar">
      {/* Logo & Brand */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <img
          src="/assets/generated/cric-logo.dim_512x512.png"
          alt="Cricket Scoresheet"
          className="h-10 w-10 rounded-lg"
        />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-sidebar-foreground">Cricket Score</span>
          <span className="text-xs text-muted-foreground">Live Scoring</span>
        </div>
      </div>

      {/* Tournament Switcher */}
      <div className="px-4 py-4">
        <TournamentSwitcher />
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;

          return (
            <Link key={item.href} to={item.href} onClick={onNavigate}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3"
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-4 space-y-3">
        <LoginButton />
        <div className="text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()}</p>
          <p className="mt-1">
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'cricket-score'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
