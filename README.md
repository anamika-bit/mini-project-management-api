# Mini Project Management API

A backend service to manage **Users, Projects, Tasks, and Comments** with JWT authentication, PostgreSQL stored procedures, Redis caching, Docker setup, and an optional Python data-processing task.

This project demonstrates:
- [x] RESTful API design
- SQL relationships & joins
- Stored procedures
- JWT authentication
- Pagination & filtering
- Redis caching
- Dockerized development
- Basic Python scripting

---

## Tech Stack

- **Backend**: Node.js (Express)
- **Database**: PostgreSQL 16
- **Caching**: Redis
- **Authentication**: JWT
- **Containerization**: Docker & Docker Compose
- **Validation**: Joi
- **Optional Script**: Python 3

---


---

## Environment Setup

### Prerequisites

Ensure the following are installed:
- Docker
- Docker Compose (v2)
- Node.js (only if running locally)
- Python 3 (for optional task)

---

### Environment Variables

Create a `.env` file 

```env

PORT=3000
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password

JWT_SECRET=your_jwt_secret_key

REDIS_URL=redis://redis:6379

```

### Running the Project with Docker
1.Build and start containers :

```shell
docker compose up --build
```

This starts:
- Node.js API 
- PostgreSQL
- Redis


### Database Initialization

PostgreSQL automatically runs SQL files on first startup:

```shell
src/db/migrations.sql → creates tables
src/db/procedures.sql → creates stored procedures
```

These are mounted to:

```shell
/docker-entrypoint-initdb.d/
```

### Verify Database

```shell
docker exec -it <your_db_name> psql -U postgres -d <your_db_name>

\dt    -- list tables

\df    -- list functions
```

### Authentication (JWT)

JWT-based authentication is implemented.

After login, include the token in all protected routes:
Authorization: Bearer <JWT_TOKEN>

### API Endpoints

1.Authentication

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| POST   | /auth/register | Register a new user   |
| POST   | /auth/login    | Login & get JWT token |

2.Projects

| Method | Endpoint  | Description    |
| ------ | --------- | -------------- |
| POST   | /projects | Create project |
| GET    | /projects | List projects  |

3.Tasks

| Method | Endpoint          | Description                                  |
| ------ | ----------------- | -------------------------------------------- |
| POST   | /tasks            | Create task                                  |
| PUT    | /tasks/:taskid/assign | Assign task to a user                        |
| PUT    | /tasks/:taskid/status | Update task status (`todo/in_progress/done`) |
| POST   | /tasks/list       | List tasks with filters & pagination         |

Supported Filters for getting tasks list :
- project_id
- status
- assigned_to
- page
- limit

4.Comments

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| POST   | /tasks/:taskid/comments | Add comment to task |


### Redis Caching

- Task list endpoint is cached for 30 seconds.
- Reduces database load for repeated queries.
- Cache key is generated using request filters.

### Optional Python Task

#### Description

A Python script processes task data.

Steps:
- Save response of `/tasks/list` API to `tasks.json`

Run:
- `python3 generateSummary.py`





