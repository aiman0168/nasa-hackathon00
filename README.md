# Vitals in Orbit (V.I.O)

## Project overview

Vitals in Orbit (V.I.O) is an offline-first astronaut health monitoring web app designed for long-duration crewed missions. It helps astronauts compare each health measurement to their own personal baseline, identify early warnings, and get plain-language guidance before symptoms escalate.

## Screenshots

Placeholder for screenshots or GIFs:

- Dashboard overview
- Daily check-in
- Mission hazard summary
- Flight surgeon report

## Features

- Crew profiles with personalized baselines and mission context
- Guided daily check-in for vitals, sleep, mood, nutrition, exercise, symptoms, and radiation
- Alert engine that compares each reading to baseline and safety limits
- Readiness score, hazard mapping, recent alert timeline, and mission routine reminders
- Offline storage via localStorage and a PWA-ready service worker
- Printable ground-link summary for a flight surgeon
- Demo data showing realistic stress/sleep drift and infection-like patterns

## How the alert logic works

The alert engine evaluates each metric against both the astronaut’s personal baseline and absolute safety thresholds. A reading becomes more concerning when it drifts beyond a rolling baseline or crosses a physiological safety floor/ceiling. The app also looks for multi-day pattern changes such as declining sleep, rising stress, or falling mood, even if the absolute latest value remains in-range.

Composite rules combine correlated symptoms such as poor sleep + high stress + low mood, or elevated HR + elevated temp + fatigue, to flag earlier behavioral and infection risk.

## Data and privacy

This prototype is fully local-first. All crew, baselines, entries, and generated reports are stored in browser localStorage under the `vio:` prefix. No external API calls are made, and no backend or cloud data system is required.

## Run instructions

```bash
npm install
npm run dev
```

To build:

```bash
npm run build
```

To run tests:

```bash
npm test
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Sign in to Vercel and import the repository.
3. Choose the Vite preset.
4. Ensure the framework is set to Vite and the root is the project folder.
5. Deploy.

The project includes a `vercel.json` file and a `dist` output directory configuration.

## Disclaimer

This is a hackathon prototype for research and demonstration purposes. It is not a medical device, does not replace clinical judgment, and should not be used as an operational medical decision-making system in real-world human flight without proper review and validation.
"# NASA-hackathon" 
"# nasa-hackathon00" 
