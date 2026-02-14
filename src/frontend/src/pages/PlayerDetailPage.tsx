import { useParams } from '@tanstack/react-router';
import { usePlayer, useTeams } from '../hooks/useQueries';
import { useTournamentContext } from '../state/TournamentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function PlayerDetailPage() {
  const { playerId } = useParams({ from: '/players/$playerId' });
  const { data: player } = usePlayer(BigInt(playerId));
  const { activeTournamentId } = useTournamentContext();
  const { data: teams = [] } = useTeams(activeTournamentId);

  if (!player) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Player Details</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Player not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const team = teams.find((t) => t.id === player.teamId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{player.name}</h1>
        <p className="text-muted-foreground mt-2">
          {team ? team.name : 'No team assigned'}
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Player statistics (runs, balls, strike rate, wickets, economy) require backend implementation
          of aggregated stats from ball-by-ball events.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Batting Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Runs:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Balls Faced:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Strike Rate:</span>
              <span className="font-medium">0.00</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bowling Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Wickets:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Overs:</span>
              <span className="font-medium">0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Economy:</span>
              <span className="font-medium">0.00</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
