# Config Module

Country-agnostic configuration endpoints backed by `CountryRegistryService`.

## Endpoints

| Method | Path                | Description                          |
| ------ | ------------------- | ------------------------------------ |
| GET    | `/config/countries` | All supported countries + statutory schemes |
| GET    | `/config/tax-rules` | Tax slabs and statutory limits by country/FY |

## Supported Countries

IN, US, UK, SG — each with its own rules plugin under `src/countries/`.
