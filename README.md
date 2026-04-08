# Cali-TUF

Thanks to **Striver** and his **Take U Forward (TUF)** platform for my coding journey till now.

Hope you will like this.

## Run Locally

### Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node)

### Steps

1) Clone the repo and install dependencies

```bash
npm install
```

2) Start the dev server

```bash
npm run dev
```

3) Open the app

- Visit http://localhost:3000

### Other useful scripts

```bash
npm run lint
npm run build
npm run start
```

## Calendar Features

- **Month view calendar** with a clean grid layout
- **Range selection**: click once for start date, click again for end date (auto-swaps if you pick an earlier end date)
- **Selection styling**: endpoints are highlighted and the days in between are shaded
- **Today indicator**: current day is visually marked
- **Priority task markers**: low / mid / high priorities show as colored dots on days
- **Notes panel**: write notes for the current month, persisted in your browser using `localStorage`
- **Mobile-friendly**: notes open in a bottom-sheet style panel on mobile

Made with love by Krishna
