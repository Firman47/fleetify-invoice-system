# Fleetify Invoice System

Technical Test - Junior Fullstack Engineer  
Multi-Step Invoice / Resi Generator (Fleet & Logistics)

---

## Overview

This project is a fullstack web application that simulates a logistics invoice generation system using a multi-step wizard.

It includes:

- Authentication using JWT
- Role-based payload transformation (Admin & Kerani)
- Dynamic item search with debounce
- Invoice generation with backend validation (Zero-Trust)
- Dockerized full environment (Frontend, Backend, Database)

---

## Tech Stack

### Frontend

- Next.js 14 (Pages Router only)
- TypeScript (Strict Mode)
- Zustand (State Management + Persist)
- React Query v5
- Tailwind CSS

### Backend

- Go (Golang)
- Fiber Framework
- GORM ORM
- PostgreSQL
- JWT Authentication

### Infrastructure

- Docker
- Docker Compose

---

## Features

### Authentication

- Login using JWT
- Token stored in cookies
- Axios interceptor automatically attaches token to every request

---

### Multi-Step Wizard

#### Step 1: Client Data

- Sender name
- Sender address
- Receiver name

#### Step 2: Items

- Dynamic table input
- Item search with debounce (500ms)
- Race condition handled using AbortController

#### Step 3: Review & Invoice

- Summary of all data
- Submit invoice
- Print invoice (A4 layout)

---

### Role-Based Logic

There are two roles:

- Admin
- Kerani

Rules:

- Admin sends full payload (price + total included)
- Kerani sends simplified payload (price & total removed from request)

---

### Backend Rules (Important)

- Backend does NOT trust frontend price or total
- All prices are recalculated from database (Zero-Trust)
- Uses DB transaction (ACID):
  - Insert invoice header
  - Insert invoice details
  - Rollback if any failure occurs

---

### Database Seeding (Zero Setup)

When application starts:

- Database is automatically migrated
- Master item data is automatically seeded

No manual SQL required.

---

## How to Run (Zero Setup)

### Requirements

- Docker
- Docker Compose

---

### Start Project

```bash
docker-compose up --build
```
