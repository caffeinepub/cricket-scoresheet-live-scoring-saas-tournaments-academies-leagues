import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAddBall } from '../../hooks/useQueries';
import { usePlayers } from '../../hooks/useQueries';
import type { Match, Team } from '../../backend';

interface LiveScoringPanelProps {
  match: Match;
  teams: Team[];
}

export default function LiveScoringPanel({ match, teams }: LiveScoringPanelProps) {
  const { data: allPlayers = [] } = usePlayers();
  const addBall = useAddBall();

  const [batsmanId, setBatsmanId] = useState('');
  const [bowlerId, setBowlerId] = useState('');

  const teamAPlayers = allPlayers.filter((p) => p.teamId === match.teamAId);
  const teamBPlayers = allPlayers.filter((p) => p.teamId === match.teamBId);

  const handleRunClick = (runs: number) => {
    if (!batsmanId || !bowlerId) {
      return;
    }

    addBall.mutate({
      matchId: match.id,
      batsmanId: BigInt(batsmanId),
      bowlerId: BigInt(bowlerId),
      runs: BigInt(runs),
      isWicket: false,
      isWide: false,
      isNoBall: false,
    });
  };

  const handleWicket = () => {
    if (!batsmanId || !bowlerId) {
      return;
    }

    addBall.mutate({
      matchId: match.id,
      batsmanId: BigInt(batsmanId),
      bowlerId: BigInt(bowlerId),
      runs: BigInt(0),
      isWicket: true,
      isWide: false,
      isNoBall: false,
    });
  };

  const handleWide = () => {
    if (!batsmanId || !bowlerId) {
      return;
    }

    addBall.mutate({
      matchId: match.id,
      batsmanId: BigInt(batsmanId),
      bowlerId: BigInt(bowlerId),
      runs: BigInt(1),
      isWicket: false,
      isWide: true,
      isNoBall: false,
    });
  };

  const handleNoBall = () => {
    if (!batsmanId || !bowlerId) {
      return;
    }

    addBall.mutate({
      matchId: match.id,
      batsmanId: BigInt(batsmanId),
      bowlerId: BigInt(bowlerId),
      runs: BigInt(1),
      isWicket: false,
      isWide: false,
      isNoBall: true,
    });
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Live scoring is recording ball-by-ball events. Full scoreboard calculation and recent balls
          display require backend implementation of innings tracking and derived statistics.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Select Players</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batsman">Current Batsman</Label>
            <Select value={batsmanId} onValueChange={setBatsmanId}>
              <SelectTrigger id="batsman">
                <SelectValue placeholder="Select batsman" />
              </SelectTrigger>
              <SelectContent>
                {teamAPlayers.map((player) => (
                  <SelectItem key={player.id.toString()} value={player.id.toString()}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bowler">Current Bowler</Label>
            <Select value={bowlerId} onValueChange={setBowlerId}>
              <SelectTrigger id="bowler">
                <SelectValue placeholder="Select bowler" />
              </SelectTrigger>
              <SelectContent>
                {teamBPlayers.map((player) => (
                  <SelectItem key={player.id.toString()} value={player.id.toString()}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Record Ball</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-3 block">Runs</Label>
            <div className="grid grid-cols-6 gap-2">
              {[0, 1, 2, 3, 4, 6].map((runs) => (
                <Button
                  key={runs}
                  size="lg"
                  variant={runs === 4 || runs === 6 ? 'default' : 'outline'}
                  onClick={() => handleRunClick(runs)}
                  disabled={!batsmanId || !bowlerId || addBall.isPending}
                  className="text-lg font-bold"
                >
                  {runs}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Extras & Wickets</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="destructive"
                onClick={handleWicket}
                disabled={!batsmanId || !bowlerId || addBall.isPending}
              >
                Wicket
              </Button>
              <Button
                variant="secondary"
                onClick={handleWide}
                disabled={!batsmanId || !bowlerId || addBall.isPending}
              >
                Wide
              </Button>
              <Button
                variant="secondary"
                onClick={handleNoBall}
                disabled={!batsmanId || !bowlerId || addBall.isPending}
              >
                No Ball
              </Button>
            </div>
          </div>

          {(!batsmanId || !bowlerId) && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please select both batsman and bowler to record balls</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
