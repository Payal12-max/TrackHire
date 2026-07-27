# Application Tracker Complete

A runnable full-stack job application tracker with:
- Dashboard analytics and graphs
- Drag-and-drop Kanban board
- Application timeline
- Calendar and reminders
- Interview experience journal
- Company insights
- Demo AI job summary
- Explainable resume match score
- Weekly career insights

## Run
Open two terminals.

### Backend
```bash
cd backend
npm install
npm run seed
npm run dev
```
Backend: http://localhost:4000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:5173

## PostgreSQL later
The starter intentionally remains on Node's built-in SQLite so it runs immediately without database setup. Replace `backend/db.js` and queries with Prisma/PostgreSQL after the product flow is stable.

## AI
`backend/routes/ai.js` contains safe local demo analysis. Replace its implementation with Gemini/OpenAI/Together server-side calls and keep the same response shapes.
