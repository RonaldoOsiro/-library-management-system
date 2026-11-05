# Library Management System - Data Layer

## Overview
This repository contains the backend data layer and Prisma ORM configuration for the Library Management System.

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