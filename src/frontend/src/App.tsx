import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppShell from './layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import MatchesPage from './pages/MatchesPage';
import LiveScoringPage from './pages/LiveScoringPage';
import ScoreboardPage from './pages/ScoreboardPage';
import TeamsPage from './pages/TeamsPage';
import PlayersPage from './pages/PlayersPage';
import ReportsPage from './pages/ReportsPage';
import TeamDetailPage from './pages/TeamDetailPage';
import PlayerDetailPage from './pages/PlayerDetailPage';
import MatchReportPage from './pages/MatchReportPage';
import { TournamentProvider } from './state/TournamentContext';

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TournamentProvider>
        <AppShell>
          <Outlet />
        </AppShell>
        <Toaster />
      </TournamentProvider>
    </ThemeProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const matchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/matches',
  component: MatchesPage,
});

const liveScoringRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/matches/$matchId/live',
  component: LiveScoringPage,
});

const scoreboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/matches/$matchId/scoreboard',
  component: ScoreboardPage,
});

const teamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teams',
  component: TeamsPage,
});

const teamDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/teams/$teamId',
  component: TeamDetailPage,
});

const playersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/players',
  component: PlayersPage,
});

const playerDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/players/$playerId',
  component: PlayerDetailPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsPage,
});

const matchReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/$matchId',
  component: MatchReportPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  matchesRoute,
  liveScoringRoute,
  scoreboardRoute,
  teamsRoute,
  teamDetailRoute,
  playersRoute,
  playerDetailRoute,
  reportsRoute,
  matchReportRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
