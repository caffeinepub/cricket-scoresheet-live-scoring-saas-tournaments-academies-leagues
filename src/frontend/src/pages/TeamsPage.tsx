import { useState } from 'react';
import { useTournamentContext } from '../state/TournamentContext';
import { useTeams, useCreateTeam } from '../hooks/useQueries';
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
import { Plus, Users } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function TeamsPage() {
  const { activeTournamentId } = useTournamentContext();
  const { data: teams = [] } = useTeams(activeTournamentId);
  const createTeam = useCreateTeam();
  const { isAuthenticated } = useCurrentUser();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [teamName, setTeamName] = useState('');

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim() && activeTournamentId) {
      createTeam.mutate(
        { name: teamName.trim(), tournamentId: activeTournamentId },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setTeamName('');
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground mt-2">Manage tournament teams and rosters</p>
        </div>
        {isAuthenticated && activeTournamentId && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g., Mumbai Indians"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createTeam.isPending}>
                  {createTeam.isPending ? 'Creating...' : 'Create Team'}
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
      ) : teams.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No teams yet. Create your first team!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link key={team.id.toString()} to="/teams/$teamId" params={{ teamId: team.id.toString() }}>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {team.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{team.players.length} players</p>
                    {team.captainId && <p>Captain assigned</p>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
