# Library Management System - Data Layer

## Overview
This repository contains the backend data layer and Prisma ORM configuration for the Library Management System.

## Running the API

The NestJS API is in `api/`. From that directory:

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL connection string and `JWT_SECRET` to a long, unique secret. Set `SEED_USER_PASSWORD` to a private password of at least 12 characters. Never commit `.env`.
2. Install dependencies with `npm install`.
3. Generate the Prisma client and create the database tables with `npm run prisma:generate` and `npm run prisma:migrate -- --name init`.
4. Optionally populate the example catalog with `npm run prisma:seed`, then run the server with `npm run start:dev`.

The seed clears existing reviews, books, genres, and users before loading sample data; only run it against a disposable development database. It creates a librarian at `librarian@library.com` and a patron at `patron@library.com`; both use the private `SEED_USER_PASSWORD` value. Set that password as the `seedUserPassword` collection variable in Postman to test seeded login. Public registration always creates a patron. Book create, update, and delete require a librarian JWT. The Postman collection at `docs/postman_collection.json` includes every API endpoint.

---

## Schema Decisions

### Why Book References Genre Rather Than Embedding It
We chose a normalized relational approach where **Book** references **Genre** via a foreign key (`genreId`) instead of embedding the genre details directly inside the book record:
1. **Data Integrity & Consistency:** Storing genres as a standalone entity ensures that genre names (e.g., "Science Fiction") are uniform across the catalog. Embedding strings directly often leads to typos, formatting discrepancies ("Sci-Fi" vs "Science Fiction"), and update anomalies.
2. **Efficient Updates:** If a genre name needs to be modified or enriched with additional metadata (like a genre description or age rating), it only needs to be updated in one place (`Genre` table) rather than across thousands of book records.
3. **Relational Querying:** Prisma allows us to easily fetch books filtered or grouped by genre, or include genres dynamically using `include: { genre: true }`.

---

## Stretch Task: Prisma vs. Document Database Note
One major difference encountered when modeling in Prisma (SQL/Relational) compared to a document database (like MongoDB) is **how relationships and structural integrity are enforced**. 
- In a **document database**, related data like reviews or genres are often embedded as nested arrays or objects for fast, single-document reads. However, this shifts the burden of maintaining referential integrity to application code.
- In **Prisma with PostgreSQL**, foreign keys, cascade deletes (`onDelete: Cascade`), and strict type safety are enforced at the database level. Relations are explicitly defined in the schema, making schema changes and complex queries (like multi-table joins or aggregated ratings) cleaner and safer through generated types.