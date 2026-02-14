import Array "mo:core/Array";
import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Set "mo:core/Set";
import Bool "mo:core/Bool";
import Authorization "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  var nextTournamentId = 1;
  var nextTeamId = 1;
  var nextPlayerId = 1;
  var nextMatchId = 1;
  var nextPlayerMatchId = 0;

  type Role = Authorization.UserRole;

  public type UserProfile = {
    name : Text;
    role : Text;
  };

  public type Tournament = {
    id : Nat;
    name : Text;
    createdBy : Text;
    createdAt : Time.Time;
    teams : [Nat];
    matches : [Nat];
  };

  type InternalTournament = {
    id : Nat;
    name : Text;
    createdBy : Text;
    createdAt : Time.Time;
    teams : List.List<Nat>;
    matches : List.List<Nat>;
  };

  public type TournamentSnapshot = {
    id : Nat;
    name : Text;
    createdBy : Text;
    createdAt : Time.Time;
    teams : [Nat];
    matches : [Nat];
  };

  public type Team = {
    id : Nat;
    name : Text;
    captainId : ?Nat;
    players : [Nat];
    tournamentId : Nat;
  };

  type InternalTeam = {
    id : Nat;
    name : Text;
    captainId : ?Nat;
    players : List.List<Nat>;
    tournamentId : Nat;
  };

  public type Player = {
    id : Nat;
    name : Text;
    teamId : ?Nat;
  };

  public type PlayerMatch = {
    id : Nat;
    playerId : ?Nat;
    matchId : Nat;
    runs : Nat;
    ballsFaced : Nat;
    wicketsTaken : Nat;
    oversBowled : Nat;
    ballsBowled : Nat;
    runsConceded : Nat;
  };

  public type Match = {
    id : Nat;
    teamAId : Nat;
    teamBId : Nat;
    oversLimit : Nat;
    status : Text;
    tournamentId : Nat;
    currentBowlerId : ?Nat;
    innings : [Nat];
  };

  type InternalMatch = {
    id : Nat;
    teamAId : Nat;
    teamBId : Nat;
    oversLimit : Nat;
    status : Text;
    tournamentId : Nat;
    currentBowlerId : ?Nat;
    innings : List.List<Nat>;
  };

  public type BallByBall = {
    id : Nat;
    matchId : Nat;
    batsmanId : Nat;
    bowlerId : Nat;
    runs : Nat;
    isWicket : Bool;
    isWide : Bool;
    isNoBall : Bool;
  };

  public type Innings = {
    id : Nat;
    matchId : Nat;
    teamId : Nat;
    runs : Nat;
    wickets : Nat;
    overs : Nat;
    balls : Nat;
    runRate : Nat;
    batsmanStats : [Nat];
    bowlerStats : [Nat];
    overwiseScores : [Nat];
    currentBowlerId : ?Nat;
  };

  type InternalInnings = {
    id : Nat;
    matchId : Nat;
    teamId : Nat;
    runs : Nat;
    wickets : Nat;
    overs : Nat;
    balls : Nat;
    runRate : Nat;
    batsmanStats : List.List<Nat>;
    bowlerStats : List.List<Nat>;
    overwiseScores : List.List<Nat>;
    currentBowlerId : ?Nat;
  };

  // State Management
  let accessControlState = Authorization.initState();
  include MixinAuthorization(accessControlState);

  let tournamentsMap = Map.empty<Nat, InternalTournament>();
  let teams = Map.empty<Nat, InternalTeam>();
  let players = Map.empty<Nat, Player>();
  let matches = Map.empty<Nat, InternalMatch>();
  let playerMatches = Map.empty<Nat, PlayerMatch>();
  let balls = Map.empty<Nat, BallByBall>();
  let innings = Map.empty<Nat, InternalInnings>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Utility functions for immutable snapshots
  func tournamentToSnapshot(immutableTournament : InternalTournament) : Tournament {
    {
      id = immutableTournament.id;
      name = immutableTournament.name;
      createdBy = immutableTournament.createdBy;
      createdAt = immutableTournament.createdAt;
      teams = immutableTournament.teams.toArray();
      matches = immutableTournament.matches.toArray();
    };
  };

  func teamToSnapshot(immutableTeam : InternalTeam) : Team {
    {
      id = immutableTeam.id;
      name = immutableTeam.name;
      captainId = immutableTeam.captainId;
      players = immutableTeam.players.toArray();
      tournamentId = immutableTeam.tournamentId;
    };
  };

  func matchToSnapshot(immutableMatch : InternalMatch) : Match {
    {
      id = immutableMatch.id;
      teamAId = immutableMatch.teamAId;
      teamBId = immutableMatch.teamBId;
      oversLimit = immutableMatch.oversLimit;
      status = immutableMatch.status;
      tournamentId = immutableMatch.tournamentId;
      currentBowlerId = immutableMatch.currentBowlerId;
      innings = immutableMatch.innings.toArray();
    };
  };

  func inningsToSnapshot(immutableInnings : InternalInnings) : Innings {
    {
      id = immutableInnings.id;
      matchId = immutableInnings.matchId;
      teamId = immutableInnings.teamId;
      runs = immutableInnings.runs;
      wickets = immutableInnings.wickets;
      overs = immutableInnings.overs;
      balls = immutableInnings.balls;
      runRate = immutableInnings.runRate;
      batsmanStats = immutableInnings.batsmanStats.toArray();
      bowlerStats = immutableInnings.bowlerStats.toArray();
      overwiseScores = immutableInnings.overwiseScores.toArray();
      currentBowlerId = immutableInnings.currentBowlerId;
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not Authorization.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Tournament Management
  public shared ({ caller }) func createTournament(name : Text, createdBy : Text) : async Nat {
    if (not (Authorization.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create tournaments");
    };

    let tournament : InternalTournament = {
      id = nextTournamentId;
      name;
      createdBy;
      createdAt = Time.now();
      teams = List.empty<Nat>();
      matches = List.empty<Nat>();
    };
    tournamentsMap.add(nextTournamentId, tournament);
    nextTournamentId += 1;
    tournament.id;
  };

  public query ({ caller }) func getTournament(tournamentId : Nat) : async ?Tournament {
    switch (tournamentsMap.get(tournamentId)) {
      case (null) { null };
      case (?tournament) { ?tournamentToSnapshot(tournament) };
    };
  };

  public query ({ caller }) func getTournamentSnapshot(tournamentId : Nat) : async ?Tournament {
    switch (tournamentsMap.get(tournamentId)) {
      case (null) { null };
      case (?tournament) { ?tournamentToSnapshot(tournament) };
    };
  };

  public query ({ caller }) func listTournaments() : async [Tournament] {
    tournamentsMap.values().toArray().map(tournamentToSnapshot);
  };

  // Team Management
  public shared ({ caller }) func createTeam(name : Text, tournamentId : Nat) : async Nat {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only admins or scorers can create teams");
    };

    let team : InternalTeam = {
      id = nextTeamId;
      name;
      captainId = null;
      players = List.empty<Nat>();
      tournamentId;
    };
    teams.add(nextTeamId, team);

    switch (tournamentsMap.get(tournamentId)) {
      case (?tournament) {
        tournament.teams.add(nextTeamId);
        tournamentsMap.add(tournamentId, tournament);
      };
      case (null) {};
    };
    nextTeamId += 1;
    team.id;
  };

  public query ({ caller }) func getTeam(teamId : Nat) : async ?Team {
    switch (teams.get(teamId)) {
      case (null) { null };
      case (?team) { ?teamToSnapshot(team) };
    };
  };

  public query ({ caller }) func listTeams(tournamentId : Nat) : async [Team] {
    teams.values().toArray().filter(func(team) { team.tournamentId == tournamentId }).map(teamToSnapshot);
  };

  // Player Management
  public shared ({ caller }) func createPlayer(name : Text, teamId : ?Nat) : async Nat {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only admins or scorers can create players");
    };

    let player : Player = {
      id = nextPlayerId;
      name;
      teamId;
    };
    players.add(nextPlayerId, player);
    nextPlayerId += 1;
    player.id;
  };

  public query ({ caller }) func getPlayer(playerId : Nat) : async ?Player {
    players.get(playerId);
  };

  public query ({ caller }) func listPlayers(teamId : ?Nat) : async [Player] {
    players.values().toArray().filter(func(player) { player.teamId == teamId });
  };

  // Match Management
  public shared ({ caller }) func createMatch(teamAId : Nat, teamBId : Nat, oversLimit : Nat, tournamentId : Nat) : async Nat {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only admins or scorers can create matches");
    };

    let match : InternalMatch = {
      id = nextMatchId;
      teamAId;
      teamBId;
      oversLimit;
      status = "Upcoming";
      tournamentId;
      currentBowlerId = null;
      innings = List.empty<Nat>();
    };
    matches.add(nextMatchId, match);

    switch (tournamentsMap.get(tournamentId)) {
      case (?tournament) {
        tournament.matches.add(nextMatchId);
        tournamentsMap.add(tournamentId, tournament);
      };
      case (null) {};
    };

    nextMatchId += 1;
    match.id;
  };

  public query ({ caller }) func getMatch(matchId : Nat) : async ?Match {
    switch (matches.get(matchId)) {
      case (null) { null };
      case (?match) { ?matchToSnapshot(match) };
    };
  };

  public query ({ caller }) func listMatches(tournamentId : Nat) : async [Match] {
    matches.values().toArray().filter(func(m) { m.tournamentId == tournamentId }).map(matchToSnapshot);
  };

  // Scoring Operations
  public shared ({ caller }) func addOverwiseScore(inningsId : Nat, _overNumber : Nat, score : Nat) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only admins or scorers can add over wise scores");
    };

    switch (innings.get(inningsId)) {
      case (?existingInnings) {
        existingInnings.overwiseScores.add(score);
        innings.add(inningsId, existingInnings);
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func addBall(matchId : Nat, batsmanId : Nat, bowlerId : Nat, runs : Nat, isWicket : Bool, isWide : Bool, isNoBall : Bool) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only admins or scorers can add balls");
    };

    let ball : BallByBall = {
      id = 0;
      matchId;
      batsmanId;
      bowlerId;
      runs;
      isWicket;
      isWide;
      isNoBall;
    };

    switch (matches.get(matchId)) {
      case (?match) {
        balls.add(match.innings.size(), ball);
      };
      case (null) {
        Runtime.trap("Match does not exist");
      };
    };
  };

  public query ({ caller }) func getOverwiseScores(inningsId : Nat) : async [Nat] {
    switch (innings.get(inningsId)) {
      case (?existingInnings) {
        existingInnings.overwiseScores.toArray();
      };
      case (null) { [] };
    };
  };
};
