<!-- GitHub topics: amodb, openapi, openapi-3-1, tmdb, omdb, movie-api, tv-api, postman-collection, api-specification -->

# amodb-openapi

OpenAPI 3.1 specification of the amodb API, with ready to import Postman and Insomnia collections.

amodb is a paid API for movie and TV metadata. It is compatible with TMDB v3 and OMDb. Existing TMDB clients work by changing the base URL to `https://api.amodb.dev/3`.

## What is in this repo

| File | What it is |
|---|---|
| `openapi.yaml` | The OpenAPI 3.1.0 document: 107 paths, 107 operations, 25 tags |
| `postman_collection.json` | Postman collection v2.1, one folder per tag |
| `insomnia_export.json` | Insomnia v4 export, one folder per tag, with an environment |
| `redocly.yaml` | Lint configuration |
| `scripts/` | Scripts that build the two collections from `openapi.yaml` |

The spec covers:

- TMDB v3 read endpoints under `/3`: movies, TV shows, seasons, episodes, people, search, discover, trending, genres, collections, companies, networks, keywords, find, configuration, certifications, watch providers, reviews and credits.
- amodb extensions: `moods`, `soundtracks`, `ratings`, `wikidata` and `showtimes`, plus extra `append_to_response` values and more `external_source` values for `find`.
- The OMDb compatible route at `/omdb/`.
- Images at `https://img.amodb.dev/t/p/{size}/{file}`.
- The public `GET /plans` endpoint.

TMDB write methods (account, session, rating and list writes) are not offered. They return 405 with code 37.

## Base URL and auth

amodb is a paid API. Get a key at https://amodb.dev/pricing. A key is 32 lowercase hex characters.

Bearer header:

```sh
curl -H "Authorization: Bearer YOUR_KEY" "https://api.amodb.dev/3/movie/550?language=en-US"
```

`api_key` query parameter, as in TMDB v3:

```sh
curl "https://api.amodb.dev/3/search/movie?query=inception&api_key=YOUR_KEY"
```

OMDb route, which takes `apikey`:

```sh
curl "https://api.amodb.dev/omdb/?i=tt0137523&apikey=YOUR_KEY"
```

## Rate limits

Plans differ only in requests per minute. Every plan gets all data.

| Plan id | Requests per minute |
|---|---|
| lite | 20 |
| pro | 40 |
| proplus | 120 |

Live plan names and prices: https://api.amodb.dev/plans

## View the spec

Lint it:

```sh
npm install
npm run lint
```

Build a single HTML page with Redocly and open `dist/index.html`:

```sh
npm run build:docs
```

## Import into Postman and Insomnia

Postman: Import, choose `postman_collection.json`, then set the collection variable `apiKey`. The collection sends it as a Bearer token. Postman can also import `openapi.yaml` directly.

Insomnia: Import, choose `insomnia_export.json`, then set `apiKey` in the Base Environment. Insomnia can also import `openapi.yaml` directly.

## Generate a client

Any generator that reads OpenAPI 3.1 works. For example:

```sh
npx @openapitools/openapi-generator-cli generate -i openapi.yaml -g typescript-fetch -o ./client
```

## Rebuild the collections

```sh
npm install
npm run check
```

`npm run check` lints `openapi.yaml`, then rebuilds `postman_collection.json` and `insomnia_export.json`.

## License

MIT. See `LICENSE`.
