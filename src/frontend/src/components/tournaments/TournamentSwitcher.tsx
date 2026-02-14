import { useState } from 'react';
import { useTournamentContext } from '../../state/TournamentContext';
import { useTournaments, useCreateTournament } from '../../hooks/useQueries';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

export default function TournamentSwitcher() {
  const { activeTournamentId, setActiveTournamentId } = useTournamentContext();
  const { data: tournaments = [], isLoading } = useTournaments();
  const createTournament = useCreateTournament();
  const { isAuthenticated, userProfile } = useCurrentUser();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTournamentName, setNewTournamentName] = useState('');

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTournamentName.trim() && userProfile) {
      createTournament.mutate(
        { name: newTournamentName.trim(), createdBy: userProfile.name },
        {
          onSuccess: (tournamentId) => {
            setActiveTournamentId(tournamentId);
            setDialogOpen(false);
            setNewTournamentName('');
          },
        }
      );
    }
  };

  // Auto-select first tournament if none selected
  if (!activeTournamentId && tournaments.length > 0 && !isLoading) {
    setActiveTournamentId(tournaments[0].id);
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">Tournament</Label>
      <Select
        value={activeTournamentId?.toString() ?? ''}
        onValueChange={(value) => setActiveTournamentId(BigInt(value))}
        disabled={isLoading || tournaments.length === 0}
      >
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? 'Loading...' : 'Select tournament'} />
        </SelectTrigger>
        <SelectContent>
          {tournaments.map((tournament) => (
            <SelectItem key={tournament.id.toString()} value={tournament.id.toString()}>
              {tournament.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isAuthenticated && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Tournament
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Tournament</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTournament} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tournament-name">Tournament Name</Label>
                <Input
                  id="tournament-name"
                  value={newTournamentName}
                  onChange={(e) => setNewTournamentName(e.target.value)}
                  placeholder="e.g., Summer League 2026"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={createTournament.isPending}>
                {createTournament.isPending ? 'Creating...' : 'Create Tournament'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
