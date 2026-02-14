# Specification

## Summary
**Goal:** Build a multi-tournament cricket scoresheet and live-scoring SaaS with persisted data, role-based access via Internet Identity, a modern responsive dashboard UI, and a ball-by-ball scoring/statistics engine.

**Planned changes:**
- Implement backend data models and stable persistence for Users (roles), Tournaments, Teams, Players, Matches, Innings, BallByBall events, and efficiently queryable derived statistics.
- Add Internet Identity authentication and enforce role-based access control (Admin/Scorer/Viewer) across backend methods and frontend routes/actions.
- Build a responsive sports dashboard UI shell with sidebar navigation and pages: Dashboard, Matches, Live Scoring, Scoreboard, Teams, Players, Reports.
- Apply a consistent professional visual theme across the app (avoid blue/purple as the primary palette).
- Implement tournament context: create/list/select an active tournament and scope all entities and views to it.
- Implement Team management: create teams, manage rosters, and assign exactly one captain per team.
- Implement Player management: create players, optional default team assignment, and display aggregated batting/bowling stats from recorded events.
- Implement Match management: create matches (Team A/Team B, overs limit), prevent duplicate team selection, track status (Upcoming/Live/Completed), and start/end actions (lock scoring when completed).
- Implement Live Scoring: fast ball-by-ball input (0/1/2/3/4/6, Wicket, Wide, No Ball), persist each event, and show recent deliveries/events.
- Implement scoring/statistics engine to derive match state and player summaries from ball-by-ball events and store/retrieve match result summaries for completed matches.
- Implement Live Scoreboard page for a selected match with auto-refresh via polling while Live, and final summary when Completed.
- Implement Dashboard KPIs and recent matches list scoped to the active tournament.
- Implement Reports page for completed match summaries, fall of wickets (if available), and top batting/bowling performers derived from events.
- Add and integrate generated brand assets (logo and subtle dashboard background/hero) as frontend static assets.

**User-visible outcome:** Users can sign in with Internet Identity, select a tournament, manage teams/players/matches, score a live match ball-by-ball with automatic stats, view an auto-updating scoreboard, and generate reports for completed matches within a modern responsive dashboard.
