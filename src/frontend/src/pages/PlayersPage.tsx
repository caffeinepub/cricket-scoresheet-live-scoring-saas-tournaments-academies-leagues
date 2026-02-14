import { useState } from 'react';
import { useTournamentContext } from '../state/TournamentContext';
import { usePlayers, useTeams, useCreatePlayer } from '../hooks/useQueries';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Plus, UserCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function PlayersPage() {
  const { activeTournamentId } = useTournamentContext();
  const { data: players = [] } = usePlayers();
  const { data: teams = [] } = useTeams(activeTournamentId);
  const createPlayer = useCreatePlayer();
  const { isAuthenticated } = useCurrentUser();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      createPlayer.mutate(
        {
          name: playerName.trim(),
          teamId: selectedTeamId ? BigInt(selectedTeamId) : null,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setPlayerName('');
            setSelectedTeamId('');
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Players</h1>
          <p className="text-muted-foreground mt-2">Manage players and view statistics</p>
        </div>
        {isAuthenticated && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Player</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreatePlayer} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="player-name">Player Name</Label>
                  <Input
                    id="player-name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="e.g., Virat Kohli"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team">Team (Optional)</Label>
                  <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                    <SelectTrigger id="team">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No team</SelectItem>
                      {teams.map((team) => (
                        <SelectItem key={team.id.toString()} value={team.id.toString()}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={createPlayer.isPending}>
                  {createPlayer.isPending ? 'Adding...' : 'Add Player'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {players.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No players yet. Add your first player!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => {
            const team = teams.find((t) => t.id === player.teamId);

            return (
              <Link
                key={player.id.toString()}
                to="/players/$playerId"
                params={{ playerId: player.id.toString() }}
              >
                <Card className="hover:bg-accent transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCircle className="h-5 w-5" />
                      {player.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {team ? team.name : 'No team assigned'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
