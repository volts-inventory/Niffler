# ### Niffler

A small data ingestion and web dashboard that collects nearby store and product information from third‑party sources, stores it in MongoDB, and serves a simple geosearch UI/API via Flask. The system is containerized and orchestrated with Docker Compose.

### Features
- **Automated ingestion**: Periodically fetches stores and products from external providers and writes to MongoDB
- **Geospatial search**: Uses client IP to infer approximate location and filter results within a configurable radius
- **Filtering**: Narrow results by brand, category, date, store, price ceiling, and an optional numeric attribute threshold
- **Simple UI**: Lightweight web app to browse nearby stores and products

### Architecture
- **MongoDB**: Primary datastore with a persisted volume
- **Extract service**: Long‑running worker that fetches and upserts data, then maintains helpful indexes
- **Web service**: Flask application exposing HTML and JSON endpoints; served on host port `31415`

```
docker-compose.yml
├─ mongo (MongoDB 6.0)
├─ web (Flask app → http://localhost:31415)
└─ extract (ingestion loop)
```

### Quickstart (Docker)
1) Install Docker Desktop
2) From the project root, build and start all services:

```bash
docker compose up --build
```

3) Open the web app:

```bash
open http://localhost:31415
```

Logs (in another terminal):

```bash
docker compose logs -f extract | cat
docker compose logs -f web | cat
```

Stop services:

```bash
docker compose down
```

This project persists database files in a Docker volume named `mongo_data`.

### Services
- **mongo**
  - Image: `mongo:6.0`
  - Data volume: `mongo_data:/data/db`

- **extract**
  - Build context: `./extract`
  - Behavior: Runs an infinite loop that fetches data roughly every 12 hours and writes to MongoDB; sets indexes after ingestion

- **web**
  - Build context: `./web`
  - Port: `31415` (host) → `5000` (container)
  - Uses the database `mary_jane` on the internal `mongo` host within the Compose network

### API Reference (JSON)
Base URL when running locally: `http://localhost:31415`

- **GET `/stores`**
  - Query params:
    - `max_distance_km` (optional, default `150`): search radius in kilometers
  - Returns: Array of nearby stores

- **GET `/brands`**
  - Query params:
    - `max_distance_km` (optional, default `150`)
  - Returns: Sorted list of distinct brands near you

- **GET `/products`**
  - Query params (all optional unless otherwise noted by your use case):
    - `brand` (string; use `All` for no brand filter)
    - `type` (string; use `All` for no category filter)
    - `date` (string; e.g., `YYYY-MM-DD` substring match)
    - `store` (string; use `All` for no store filter)
    - `thc` (number; optional numeric attribute threshold)
    - `max_price` (number)
  - Results are geofiltered to your approximate location and sorted server‑side by a price efficiency metric.

Note on location: The web service infers latitude/longitude from the client IP (or `X-Forwarded-For` if present). If geolocation cannot be determined, a safe default is used.

### Development Notes
- Primary workflow is via Docker Compose. Local, non‑Docker runs would require adapting database connection settings in `web/app.py` and ensuring a MongoDB instance is available at the expected host.
- Collections used include `dispo_info` (store metadata) and `all_products` (product documents). Indexes are set by the extractor.

### Troubleshooting
- **No results initially**: The extractor may still be fetching. Check logs:
  ```bash
  docker compose logs -f extract | cat
  ```
- **Location issues**: Some environments mask IP geolocation. For testing, you can send a request with a forged header:
  ```bash
  curl -H "X-Forwarded-For: 8.8.8.8" "http://localhost:31415/stores?max_distance_km=50"
  ```
- **Clean up everything** (containers + volumes):
  ```bash
  docker compose down -v
  ```

### Tech Stack
- Python, Flask, Requests, PyMongo
- MongoDB with geospatial queries
- Docker, Docker Compose



