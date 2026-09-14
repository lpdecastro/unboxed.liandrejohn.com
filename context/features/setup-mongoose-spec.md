# Setup Mongoose Spec

## Task

Set up Mongoose and MongoDB connectivity for the project.

## Requirements

* Use MongoDB URI: `mongodb://localhost:27017/unboxed`
* Create a reusable `connectDB` utility.
* Create the required Mongoose schemas and models.
* Use `@context/project-overview.md` → `#data-model` as the source of truth for the data models.
* Create accurate seed JSON for all 8 games and save it under `@src/data`.
* Create 2 realistic sample bookings in the same location and format.
* Keep seed data compatible with the Mongoose schemas.

## Documentation

* Update `README.md` with MongoDB setup and local usage instructions.
* Update `CLAUDE.md` with the database structure and relevant development guidance.

## Acceptance Criteria

* The application can successfully connect to the local MongoDB database.
* All required schemas and models are implemented according to `#data-model`.
* Seed JSON contains all 8 games and 2 valid sample bookings.
* Seed data can be imported without schema validation errors.
* The project builds and runs without database-related errors.
