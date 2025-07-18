# BergAI Backend

## Steps to Run Locally

```bash
git clone https://github.com/BergAI/berg-be.git
cd berg-be
npm install

Create .env file in root.
add
PORT=3000
SUPABASE_URL=https://qxzeazrvtfrcvptunshe.supabase.co
SUPABASE_ANON_KEY=<fetch it from supabase SETTINGS > API KEYS > anon>

npm run local:start
```

## Sample Test Call

```bash
GET    http://localhost:3000/api/v1/users
GET    http://localhost:3000/api/v1/users/:id
POST   http://localhost:3000/api/v1/users       { "username": "goutham", "role": "admin" }
PUT    http://localhost:3000/api/v1/users/:id   { "username": "newname" }
DELETE http://localhost:3000/api/v1/users/:id


GET    http://localhost:3000/api/v1/projects
GET    http://localhost:3000/api/v1/projects/:id
POST   http://localhost:3000/api/v1/projects     { "projectName": "Project A" }
PUT    http://localhost:3000/api/v1/projects/:id { "projectName": "Updated Project" }
DELETE http://localhost:3000/api/v1/projects/:id


GET    http://localhost:3000/api/v1/tasks
GET    http://localhost:3000/api/v1/tasks/:id
POST   http://localhost:3000/api/v1/tasks         { "taskName": "Task 1", "project": "<project_id>" }
PUT    http://localhost:3000/api/v1/tasks/:id     { "taskName": "Updated Task" }
DELETE http://localhost:3000/api/v1/tasks/:id

```
