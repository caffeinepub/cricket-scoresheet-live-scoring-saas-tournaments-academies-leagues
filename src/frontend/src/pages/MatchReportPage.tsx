import { useParams } from '@tanstack/react-router';
import { useMatch, useTeams } from '../hooks/useQueries';
import { useTournamentContext } from '../state/TournamentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function MatchReportPage() {
  const { matchId } = useParams({ from: '/reports/$matchId' });
  const { data: match } = useMatch(BigInt(matchId));
  const { activeTournamentId } = useTournamentContext();
  const { data: teams = [] } = useTeams(activeTournamentId);

  if (!match) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Match Report</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Match not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const teamA = teams.find((t) => t.id === match.teamAId);
  const teamB = teams.find((t) => t.id === match.teamBId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Match Report</h1>
        <p className="text-muted-foreground mt-2">
          {teamA?.name ?? 'Team A'} vs {teamB?.name ?? 'Team B'}
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Match report with final scores, innings totals, fall of wickets, and top performers requires
          backend implementation of match summary generation from ball-by-ball events.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Match Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">{teamA?.name ?? 'Team A'}</h3>
            <p className="text-2xl font-bold">0/0 (0.0 overs)</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{teamB?.name ?? 'Team B'}</h3>
            <p className="text-2xl font-bold">0/0 (0.0 overs)</p>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Overs Limit: {match.oversLimit.toString()}
            </p>
            <p className="text-sm text-muted-foreground">Status: {match.status}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Batsmen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No data available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Bowlers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
