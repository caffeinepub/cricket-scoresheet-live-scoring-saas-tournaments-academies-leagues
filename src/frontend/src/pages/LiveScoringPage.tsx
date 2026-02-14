import { useParams } from '@tanstack/react-router';
import { useMatch, useTeams, usePlayers } from '../hooks/useQueries';
import { useTournamentContext } from '../state/TournamentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import LiveScoringPanel from '../components/scoring/LiveScoringPanel';

export default function LiveScoringPage() {
  const { matchId } = useParams({ from: '/matches/$matchId/live' });
  const { data: match } = useMatch(BigInt(matchId));
  const { activeTournamentId } = useTournamentContext();
  const { data: teams = [] } = useTeams(activeTournamentId);

  if (!match) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Live Scoring</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Match not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const teamA = teams.find((t) => t.id === match.teamAId);
  const teamB = teams.find((t) => t.id === match.teamBId);

  if (match.status === 'Completed') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Live Scoring</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This match has been completed. Scoring is locked.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Scoring</h1>
        <p className="text-muted-foreground mt-2">
          {teamA?.name ?? 'Team A'} vs {teamB?.name ?? 'Team B'}
        </p>
      </div>

      {match.status === 'Upcoming' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Match has not started yet. Note: Start match functionality requires backend implementation.
          </AlertDescription>
        </Alert>
      )}

      <LiveScoringPanel match={match} teams={teams} />
    </div>
  );
}
