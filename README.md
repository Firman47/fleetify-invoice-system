# Fleetify Invoice System

Technical Test - Junior Fullstack Engineer
Multi-Step Invoice / Resi Generator (Fleet & Logistics)

---

## Overview

Fleetify Invoice System is a fullstack application for generating logistics invoices with a guided wizard flow.
The app supports role-based data submission, dynamic item lookup, persistent invoice drafts, and safe backend validation.

Key capabilities:

- Multi-step wizard for client, item, and review flow
- Role-based payload handling for Admin and Kerani
- Dynamic item lookup with debounce and autocomplete
- Client-side state persistence using Zustand
- Backend validation with zero-trust pricing logic
- Dockerized full stack environment with PostgreSQL

---

## Project Structure

- `apps/web` - Next.js frontend
- `apps/api` - Go backend with Fiber
- `apps/api/internal` - backend controllers, services, models, and routes
- `apps/web/src/pages/wizard` - wizard pages for step 1, 2, and 3
- `apps/web/src/store` - Zustand stores for invoice and auth data
- `apps/web/src/services` - API service calls

---

## Tech Stack

### Frontend

- Next.js 16 (Pages Router)
- TypeScript (Strict Mode)
- Zustand (state management + persistence)
- React Query v5
- Tailwind CSS
- lucide-react icons

### Backend

- Go (Golang)
- Fiber framework
- GORM ORM
- PostgreSQL
- JWT authentication

### Infrastructure

- Docker
- Docker Compose

---

## Features

### Authentication

- JWT-based login
- Token stored in HTTP cookies
- Axios interceptor attaches token automatically to API requests

#### Test Credentials

For testing purposes, the following dummy accounts are available:

| Username | Password  | Role   |
| -------- | --------- | ------ |
| admin    | admin123  | Admin  |
| kerani   | kerani123 | Kerani |

Use these credentials to log in to the application and test the different role-based features.

### Multi-Step Invoice Wizard

#### Step 1: Client Data

- Capture sender name
- Capture sender address
- Capture receiver name

#### Step 2: Item Selection

- Add / remove invoice items
- Search item by code with debounce (500ms)
- Autocomplete dropdown for item selection
- Quantity adjustment per item
- Role-based price and total display

#### Step 3: Review & Submit

- Review client and item details
- Display total invoice amount
- Print invoice layout
- Submit invoice to backend

---

## Role-Based Logic

The system supports two user roles:

- **Admin**
  - Full payload sent to backend
  - Includes item price and total in review UI
- **Kerani**
  - Simplified payload sent to backend
  - Backend still recalculates pricing amounts

---

## Backend Rules (Zero Trust)

The backend enforces strong validation and does not trust price data from the frontend.

- Prices and totals are recalculated on the server using item master data
- Invoice creation uses a DB transaction for atomic writes
- If any insert fails, the transaction is rolled back

---

## Database and Seeding

On startup, the backend automatically:

- Migrates database schemas
- Seeds master item data

This means no manual SQL setup is required for demo use.

---

## Running the Application

### Prerequisites

- Docker
- Docker Compose

### Start with Docker

```bash
docker-compose up --build
```

This command starts the frontend, backend, and PostgreSQL services.

### Frontend Local Run

If you prefer running only the frontend locally:

```bash
cd apps/web
npm install
npm run dev
```

### Backend Local Run

If you prefer running only the backend locally:

```bash
cd apps/api
go run main.go
```

---

## Useful Commands

- `docker-compose up --build` - Start all services
- `docker-compose down` - Stop and remove containers
- `cd apps/web && npm run dev` - Run frontend developer server
- `cd apps/api && go run main.go` - Run backend locally

---

## Important Files

- `apps/web/src/pages/wizard/step-1.tsx`
- `apps/web/src/pages/wizard/step-2.tsx`
- `apps/web/src/pages/wizard/step-3.tsx`
- `apps/web/src/store/invoice.store.ts`
- `apps/api/main.go`
- `apps/api/internal/controllers`
- `apps/api/internal/services`
- `apps/api/internal/models`

---

## Notes

- The frontend stores draft invoice data in local storage for persistence.
- Item search uses debounce and abort controllers to reduce race conditions.
- Backend uses JWT auth and verifies requests before invoice creation.

---

## License

This repository is for technical assessment purposes.
