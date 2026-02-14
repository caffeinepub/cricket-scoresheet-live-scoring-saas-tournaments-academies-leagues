import { useParams } from '@tanstack/react-router';
import { useMatch, useTeams } from '../hooks/useQueries';
import { useTournamentContext } from '../state/TournamentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ScoreboardPage() {
  const { matchId } = useParams({ from: '/matches/$matchId/scoreboard' });
  const { data: match } = useMatch(BigInt(matchId));
  const { activeTournamentId } = useTournamentContext();
  const { data: teams = [] } = useTeams(activeTournamentId);

  if (!match) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Scoreboard</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Match not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const teamA = teams.find((t) => t.id === match.teamAId);
  const teamB = teams.find((t) => t.id === match.teamBId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'default';
      case 'Completed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scoreboard</h1>
          <p className="text-muted-foreground mt-2">
            {teamA?.name ?? 'Team A'} vs {teamB?.name ?? 'Team B'}
          </p>
        </div>
        <Badge variant={getStatusColor(match.status)} className="text-lg px-4 py-2">
          {match.status}
        </Badge>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Live scoreboard display requires backend implementation of innings tracking and derived statistics.
          Currently showing match metadata only.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{teamA?.name ?? 'Team A'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">0/0</div>
            <p className="text-sm text-muted-foreground mt-2">0.0 overs</p>
            <p className="text-sm text-muted-foreground">Run Rate: 0.00</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{teamB?.name ?? 'Team B'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">0/0</div>
            <p className="text-sm text-muted-foreground mt-2">0.0 overs</p>
            <p className="text-sm text-muted-foreground">Run Rate: 0.00</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Match Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Overs Limit:</span>
            <span className="font-medium">{match.oversLimit.toString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium">{match.status}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
