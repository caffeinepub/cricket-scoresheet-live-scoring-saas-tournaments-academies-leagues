import { useTournamentContext } from '../state/TournamentContext';
import { useMatches, useTeams, usePlayers } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, UserCircle, Activity } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function DashboardPage() {
  const { activeTournamentId } = useTournamentContext();
  const { data: matches = [] } = useMatches(activeTournamentId);
  const { data: teams = [] } = useTeams(activeTournamentId);
  const { data: players = [] } = usePlayers();

  const liveMatches = matches.filter((m) => m.status === 'Live');
  const recentMatches = matches.slice(-5).reverse();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-green-500';
      case 'Completed':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your cricket tournament statistics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matches.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Matches</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveMatches.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Players</CardTitle>
            <UserCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{players.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Matches</CardTitle>
        </CardHeader>
        <CardContent>
          {recentMatches.length === 0 ? (
            <p className="text-sm text-muted-foreground">No matches yet. Create your first match!</p>
          ) : (
            <div className="space-y-3">
              {recentMatches.map((match) => {
                const teamA = teams.find((t) => t.id === match.teamAId);
                const teamB = teams.find((t) => t.id === match.teamBId);

                return (
                  <Link
                    key={match.id.toString()}
                    to="/matches/$matchId/scoreboard"
                    params={{ matchId: match.id.toString() }}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(match.status)}>{match.status}</Badge>
                      <div>
                        <p className="font-medium">
                          {teamA?.name ?? 'Team A'} vs {teamB?.name ?? 'Team B'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {match.oversLimit.toString()} overs
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
