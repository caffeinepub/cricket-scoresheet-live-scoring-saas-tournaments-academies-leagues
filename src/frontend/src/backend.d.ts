import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Player {
    id: bigint;
    name: string;
    teamId?: bigint;
}
export type Time = bigint;
export interface Tournament {
    id: bigint;
    teams: Array<bigint>;
    name: string;
    createdAt: Time;
    createdBy: string;
    matches: Array<bigint>;
}
export interface Match {
    id: bigint;
    status: string;
    teamAId: bigint;
    teamBId: bigint;
    innings: Array<bigint>;
    oversLimit: bigint;
    currentBowlerId?: bigint;
    tournamentId: bigint;
}
export interface UserProfile {
    name: string;
    role: string;
}
export interface Team {
    id: bigint;
    name: string;
    players: Array<bigint>;
    tournamentId: bigint;
    captainId?: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBall(matchId: bigint, batsmanId: bigint, bowlerId: bigint, runs: bigint, isWicket: boolean, isWide: boolean, isNoBall: boolean): Promise<void>;
    addOverwiseScore(inningsId: bigint, _overNumber: bigint, score: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createMatch(teamAId: bigint, teamBId: bigint, oversLimit: bigint, tournamentId: bigint): Promise<bigint>;
    createPlayer(name: string, teamId: bigint | null): Promise<bigint>;
    createTeam(name: string, tournamentId: bigint): Promise<bigint>;
    createTournament(name: string, createdBy: string): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMatch(matchId: bigint): Promise<Match | null>;
    getOverwiseScores(inningsId: bigint): Promise<Array<bigint>>;
    getPlayer(playerId: bigint): Promise<Player | null>;
    getTeam(teamId: bigint): Promise<Team | null>;
    getTournament(tournamentId: bigint): Promise<Tournament | null>;
    getTournamentSnapshot(tournamentId: bigint): Promise<Tournament | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listMatches(tournamentId: bigint): Promise<Array<Match>>;
    listPlayers(teamId: bigint | null): Promise<Array<Player>>;
    listTeams(tournamentId: bigint): Promise<Array<Team>>;
    listTournaments(): Promise<Array<Tournament>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
