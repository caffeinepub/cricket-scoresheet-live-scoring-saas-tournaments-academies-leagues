import { useState } from 'react';
import { useTournamentContext } from '../state/TournamentContext';
import { useMatches, useTeams, useCreateMatch } from '../hooks/useQueries';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Play, Monitor } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function MatchesPage() {
  const { activeTournamentId } = useTournamentContext();
  const { data: matches = [] } = useMatches(activeTournamentId);
  const { data: teams = [] } = useTeams(activeTournamentId);
  const createMatch = useCreateMatch();
  const { isAuthenticated } = useCurrentUser();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [teamAId, setTeamAId] = useState('');
  const [teamBId, setTeamBId] = useState('');
  const [oversLimit, setOversLimit] = useState('20');

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamAId && teamBId && oversLimit && activeTournamentId && teamAId !== teamBId) {
      createMatch.mutate(
        {
          teamAId: BigInt(teamAId),
          teamBId: BigInt(teamBId),
          oversLimit: BigInt(oversLimit),
          tournamentId: activeTournamentId,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setTeamAId('');
            setTeamBId('');
            setOversLimit('20');
          },
        }
      );
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Matches</h1>
          <p className="text-muted-foreground mt-2">Manage and view all tournament matches</p>
        </div>
        {isAuthenticated && activeTournamentId && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Match
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Match</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateMatch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-a">Team A</Label>
                  <Select value={teamAId} onValueChange={setTeamAId} required>
                    <SelectTrigger id="team-a">
                      <SelectValue placeholder="Select Team A" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem
                          key={team.id.toString()}
                          value={team.id.toString()}
                          disabled={team.id.toString() === teamBId}
                        >
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-b">Team B</Label>
                  <Select value={teamBId} onValueChange={setTeamBId} required>
                    <SelectTrigger id="team-b">
                      <SelectValue placeholder="Select Team B" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem
                          key={team.id.toString()}
                          value={team.id.toString()}
                          disabled={team.id.toString() === teamAId}
                        >
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overs">Overs Limit</Label>
                  <Input
                    id="overs"
                    type="number"
                    min="1"
                    max="50"
                    value={oversLimit}
                    onChange={(e) => setOversLimit(e.target.value)}
                    required
                  />
                </div>

                {teamAId === teamBId && teamAId && (
                  <p className="text-sm text-destructive">Please select different teams</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMatch.isPending || !teamAId || !teamBId || teamAId === teamBId}
                >
                  {createMatch.isPending ? 'Creating...' : 'Create Match'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {!activeTournamentId ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Please select or create a tournament first
            </p>
          </CardContent>
        </Card>
      ) : matches.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No matches yet. Create your first match!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => {
            const teamA = teams.find((t) => t.id === match.teamAId);
            const teamB = teams.find((t) => t.id === match.teamBId);

            return (
              <Card key={match.id.toString()}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {teamA?.name ?? 'Team A'} vs {teamB?.name ?? 'Team B'}
                    </CardTitle>
                    <Badge variant={getStatusColor(match.status)}>{match.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {match.oversLimit.toString()} overs
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/matches/$matchId/scoreboard" params={{ matchId: match.id.toString() }}>
                    <Button variant="outline" className="w-full">
                      <Monitor className="h-4 w-4 mr-2" />
                      View Scoreboard
                    </Button>
                  </Link>
                  {match.status === 'Live' && isAuthenticated && (
                    <Link to="/matches/$matchId/live" params={{ matchId: match.id.toString() }}>
                      <Button className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Live Scoring
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
