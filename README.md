# LeadFlow – Simple Client Lead Manager

## Description

LeadFlow is a small CRM (Customer Relationship Management) web app for managing leads that come from a company's website, LinkedIn, referrals and ads.

Instead of being a plain table of data, every lead moves through a **Lead Journey**:

```text
New → Contacted → Follow-up → Converted
                      (a lead can also become Lost)
```

On the lead details page you can see exactly where a lead is in this journey, and move it forward with one click.

```text
Frontend → React
Backend  → Express
Storage  → JSON file (server/data/leads.json)
```

There is **no database** and **no login**. This is a simple local project.

## Features

- Dashboard with counts for Total, New, Contacted, Follow-up, Converted and Lost leads
- Priority summary (High / Medium / Low)
- "Today's Follow-ups" list on the dashboard
- Add, view, edit and delete leads
- Search by name, email or company (works while typing)
- Filter by status and by priority (search and filters work together)
- Quick status change on the lead details page
- **Lead Journey** tracker (✓ done, ● current, ○ upcoming, Lost shown separately)
- Notes for every lead
- Follow-up date with Due Today / Upcoming / Overdue labels
- Follow-ups page with three groups: Due Today, Upcoming, Overdue
- Priority badges: High = red, Medium = yellow, Low = green
- Friendly error messages (lead not found, invalid ID, empty fields, invalid email, server error)
- Responsive design: the sidebar becomes a top menu on small screens
- 10 sample leads included

> Note: on the Follow-ups page and the dashboard, leads that are already **Converted** or **Lost** are not shown, because there is nothing left to follow up.

## Technologies

```text
React.js (with Vite and React Router)
JavaScript
HTML
CSS (plain CSS, no frameworks)
Node.js
Express.js
JSON file for storage
```

Only these packages are used:

```text
server: express, cors
client: react, react-dom, react-router-dom (plus vite for development)
```

## Folder Structure

```text
LeadFlow-CRM/
│
├── client/                      React frontend
│   ├── index.html               Page that loads React
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx             Starts React
│       ├── App.jsx              Page routes (URLs)
│       ├── index.css            All the styling
│       ├── utils.js             Helper functions (dates, constants)
│       ├── services/
│       │   └── api.js           All calls to the Express API
│       ├── components/
│       │   ├── Navbar.jsx       Sidebar menu
│       │   ├── LeadCard.jsx     One lead card
│       │   ├── LeadForm.jsx     Form used for Add and Edit
│       │   ├── StatusBadge.jsx
│       │   ├── PriorityBadge.jsx
│       │   ├── FollowUpBadge.jsx
│       │   └── LeadJourney.jsx  The Lead Journey tracker
│       └── pages/
│           ├── Dashboard.jsx
│           ├── Leads.jsx        List + search + filters
│           ├── AddLead.jsx
│           ├── EditLead.jsx
│           ├── LeadDetails.jsx  Details + Lead Journey + change status
│           └── FollowUps.jsx
│
├── server/                      Express backend
│   ├── server.js                Starts the server (port 5000)
│   ├── package.json
│   ├── routes/
│   │   └── leadRoutes.js        Connects URLs to controller functions
│   ├── controllers/
│   │   └── leadController.js    Reads/writes leads.json, validation
│   └── data/
│       └── leads.json           The lead data (our "database")
│
├── .gitignore
└── README.md
```

## Installation

You need [Node.js](https://nodejs.org) installed (version 18 or newer).

Open **two terminals** in VS Code.

**Terminal 1 – Backend**

```bash
cd server
npm install
npm start
```

You should see: `LeadFlow server running at http://localhost:5000`

**Terminal 2 – Frontend**

```bash
cd client
npm install
npm run dev
```

## URLs

| What | URL |
| --- | --- |
| React app (open this in your browser) | http://localhost:5173 |
| Express API | http://localhost:5000/api/leads |

Keep both terminals running while you use the app.

## API Endpoints

```text
GET    /api/leads              Get all leads
GET    /api/leads/:id          Get one lead
POST   /api/leads              Add a new lead
PUT    /api/leads/:id          Update a lead
DELETE /api/leads/:id          Delete a lead
PATCH  /api/leads/:id/status   Change only the status
```

## How it works

1. The React page calls a function in `services/api.js`.
2. That function sends a request (using `fetch`) to the Express API.
3. The controller reads `leads.json` with `fs`, changes the data, and saves it back.
4. Express sends a JSON answer and React updates the screen.

## Common problems

- **"Cannot connect to the server"** – the backend is not running. Start it with `npm start` inside the `server` folder.
- **Port already in use** – close the other program using port 5000 or 5173.
