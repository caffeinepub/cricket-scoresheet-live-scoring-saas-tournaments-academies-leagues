import { useTournamentContext } from '../state/TournamentContext';
import { useMatches, useTeams } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function ReportsPage() {
  const { activeTournamentId } = useTournamentContext();
  const { data: matches = [] } = useMatches(activeTournamentId);
  const { data: teams = [] } = useTeams(activeTournamentId);

  const completedMatches = matches.filter((m) => m.status === 'Completed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-2">View completed match summaries and statistics</p>
      </div>

      {!activeTournamentId ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Please select or create a tournament first
            </p>
          </CardContent>
        </Card>
      ) : completedMatches.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No completed matches yet. Complete a match to see reports!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {completedMatches.map((match) => {
            const teamA = teams.find((t) => t.id === match.teamAId);
            const teamB = teams.find((t) => t.id === match.teamBId);

            return (
              <Card key={match.id.toString()}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {teamA?.name ?? 'Team A'} vs {teamB?.name ?? 'Team B'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {match.oversLimit.toString()} overs
                  </p>
                </CardHeader>
                <CardContent>
                  <Link to="/reports/$matchId" params={{ matchId: match.id.toString() }}>
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      View Report
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
