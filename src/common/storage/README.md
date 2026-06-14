# Local Storage Service

JSON file–backed persistence for development without a database.

## Overview

`LocalStorageService` stores collections as `{collection}.json` files under the project `data/` directory. Data is cached in memory and written to disk on every mutation.

## Collections

| Collection           | Used By                    |
| -------------------- | -------------------------- |
| `employees`          | Employee Management        |
| `salary_structures`  | Salary Structure           |
| `declarations`       | Declarations & Investments |
| `audit_trail`        | Audit & Compliance         |

## API

- `getAll<T>(collection)` — read all records
- `findOne<T>(collection, predicate)` — find first match
- `findMany<T>(collection, predicate)` — filter records
- `insert<T>(collection, item)` — append (throws on duplicate `id`)
- `update<T>(collection, id, updater)` — patch existing record

## Notes

Replace this service with a real repository when a database is added. The interface is intentionally simple so migration is straightforward.
