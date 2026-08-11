# ABC Office Management System

This is a full-stack web application for managing departments and users, built with NestJS for the backend and Next.js for the frontend. The entire application is containerized with Docker for easy setup and deployment.

## Requirements

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 🚀 Getting Started

Follow these steps to run the application on your machine.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd abc-office
```

### 2. Create the Environment Configuration File

Copy the `.env.example` file to create your own local environment configuration file. This file will contain secrets and environment-specific settings.

```bash
cp .env.example .env
```

### 3. Configure Your Environment

Open the `.env` file you just created and review the environment variables. For development, you can usually keep the default values. However, it is important to **change `JWT_ACCESS_SECRET` to a long, random, and secure string.**

```dotenv
# .env
POSTGRES_USER=vua1
POSTGRES_PASSWORD=1111
POSTGRES_DB=abc_office

# IMPORTANT: Replace this with a long, random, and secure secret
JWT_ACCESS_SECRET=replace_with_a_long_random_and_secure_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES_DAYS=7
```

### 4. Run the Application

You can run the application in either development or production mode.

#### Development Mode (with Hot Reloading)

This mode is recommended during development. The services will automatically restart when you save changes to the source code.

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### 5. Access the Application

Once all containers are up and running, you can access the following services:

* **Frontend Application:** http://localhost:3000
* **Backend API:** http://localhost:5000
* **PostgreSQL Database:** Connect through port `5433` on your host machine.

### Default Admin Account

The database is automatically initialized with a default administrator account (Please change the password before deploying to production.):

* **Username:** `admin`
* **Password:** `Admin@123`
