import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Tournament, Team, Player, Match, UserProfile } from '../backend';
import { toast } from 'sonner';

// Tournament Queries
export function useTournaments() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Tournament[]>({
    queryKey: ['tournaments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTournaments();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateTournament() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, createdBy }: { name: string; createdBy: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTournament(name, createdBy);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success('Tournament created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create tournament');
    },
  });
}

// Team Queries
export function useTeams(tournamentId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Team[]>({
    queryKey: ['teams', tournamentId?.toString()],
    queryFn: async () => {
      if (!actor || tournamentId === null) return [];
      return actor.listTeams(tournamentId);
    },
    enabled: !!actor && !actorFetching && tournamentId !== null,
  });
}

export function useTeam(teamId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Team | null>({
    queryKey: ['team', teamId?.toString()],
    queryFn: async () => {
      if (!actor || teamId === null) return null;
      return actor.getTeam(teamId);
    },
    enabled: !!actor && !actorFetching && teamId !== null,
  });
}

export function useCreateTeam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, tournamentId }: { name: string; tournamentId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTeam(name, tournamentId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teams', variables.tournamentId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success('Team created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create team');
    },
  });
}

// Player Queries
export function usePlayers(teamId: bigint | null = null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Player[]>({
    queryKey: ['players', teamId?.toString() ?? 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPlayers(teamId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function usePlayer(playerId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Player | null>({
    queryKey: ['player', playerId?.toString()],
    queryFn: async () => {
      if (!actor || playerId === null) return null;
      return actor.getPlayer(playerId);
    },
    enabled: !!actor && !actorFetching && playerId !== null,
  });
}

export function useCreatePlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, teamId }: { name: string; teamId: bigint | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPlayer(name, teamId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      if (variables.teamId) {
        queryClient.invalidateQueries({ queryKey: ['teams', variables.teamId.toString()] });
      }
      toast.success('Player created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create player');
    },
  });
}

// Match Queries
export function useMatches(tournamentId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Match[]>({
    queryKey: ['matches', tournamentId?.toString()],
    queryFn: async () => {
      if (!actor || tournamentId === null) return [];
      return actor.listMatches(tournamentId);
    },
    enabled: !!actor && !actorFetching && tournamentId !== null,
  });
}

export function useMatch(matchId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Match | null>({
    queryKey: ['match', matchId?.toString()],
    queryFn: async () => {
      if (!actor || matchId === null) return null;
      return actor.getMatch(matchId);
    },
    enabled: !!actor && !actorFetching && matchId !== null,
  });
}

export function useCreateMatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamAId,
      teamBId,
      oversLimit,
      tournamentId,
    }: {
      teamAId: bigint;
      teamBId: bigint;
      oversLimit: bigint;
      tournamentId: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createMatch(teamAId, teamBId, oversLimit, tournamentId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['matches', variables.tournamentId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success('Match created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create match');
    },
  });
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save profile');
    },
  });
}

// Scoring Mutations
export function useAddBall() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchId,
      batsmanId,
      bowlerId,
      runs,
      isWicket,
      isWide,
      isNoBall,
    }: {
      matchId: bigint;
      batsmanId: bigint;
      bowlerId: bigint;
      runs: bigint;
      isWicket: boolean;
      isWide: boolean;
      isNoBall: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBall(matchId, batsmanId, bowlerId, runs, isWicket, isWide, isNoBall);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['match', variables.matchId.toString()] });
      toast.success('Ball recorded');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to record ball');
    },
  });
}
