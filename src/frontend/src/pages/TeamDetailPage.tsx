import { useParams } from '@tanstack/react-router';
import { useTeam, usePlayers } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Crown } from 'lucide-react';

export default function TeamDetailPage() {
  const { teamId } = useParams({ from: '/teams/$teamId' });
  const { data: team } = useTeam(BigInt(teamId));
  const { data: allPlayers = [] } = usePlayers();

  if (!team) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Team Details</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Team not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const teamPlayers = allPlayers.filter((p) => p.teamId === team.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
        <p className="text-muted-foreground mt-2">Team roster and details</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Team roster management (add/remove players, assign captain) requires backend implementation.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Team Roster</CardTitle>
        </CardHeader>
        <CardContent>
          {teamPlayers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No players in this team yet</p>
          ) : (
            <div className="space-y-2">
              {teamPlayers.map((player) => (
                <div
                  key={player.id.toString()}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {team.captainId === player.id && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="font-medium">{player.name}</span>
                  </div>
                  {team.captainId === player.id && <Badge>Captain</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
