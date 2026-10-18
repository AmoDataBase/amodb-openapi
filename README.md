<p align="center">
  <a href="https://amodb.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/amodb-dev/.github/main/assets/lockup-dark.png">
      <img src="https://raw.githubusercontent.com/amodb-dev/.github/main/assets/lockup-light.png" alt="amodb" width="260">
    </picture>
  </a>
</p>

<h1 align="center">amodb-openapi</h1>

<p align="center">OpenAPI 3.1 specification of the amodb API with Postman and Insomnia collections.</p>

<p align="center">
  <a href="https://github.com/amodb-dev/amodb-openapi/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/amodb-dev/amodb-openapi/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/amodb-dev/amodb-openapi/releases"><img alt="Latest release" src="https://img.shields.io/github/v/release/amodb-dev/amodb-openapi"></a>
  <a href="https://github.com/amodb-dev/amodb-openapi/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/amodb-dev/amodb-openapi"></a>
</p>

OpenAPI 3.1 specification of the amodb API, with ready to import Postman and Insomnia collections.

amodb is a paid API for movie and TV metadata. It is compatible with TMDB v3 and OMDb. Existing TMDB clients work by changing the base URL to `https://api.amodb.dev/3`.

## What is in this repo

| File | What it is |
|---|---|
| `openapi.yaml` | The OpenAPI 3.1.0 document: 99 paths, 99 operations, 23 tags |
| `postman_collection.json` | Postman collection v2.1, one folder per tag |
| `insomnia_export.json` | Insomnia v4 export, one folder per tag, with an environment |
| `redocly.yaml` | Lint configuration |
| `scripts/` | Scripts that build the two collections from `openapi.yaml` |

The spec covers:

- TMDB v3 read endpoints under `/3`: movies, TV shows, seasons, episodes, people, search, discover, trending, genres, collections, companies, networks, keywords, find, configuration, certifications and watch providers. It includes `/3/movie/latest` and `/3/tv/latest`.
- amodb extensions: `moods`, `soundtracks`, `ratings`, `wikidata` and `showtimes` for movies and TV shows, plus the matching `append_to_response` values, `kinopoisk_id` in `external_ids` and `kinopoisk_id` as an `external_source` for `find`.
- The OMDb compatible route at `/omdb/` with the parameters `i`, `t`, `s`, `type`, `y`, `plot`, `page` and `r`.
- Images at `https://img.amodb.dev/t/p/{size}/{file}`.
- The public `GET /plans` endpoint.

Parameters are listed per operation and match what the server reads. For example, `append_to_response` has its own list of names for movies, TV shows, people, seasons and episodes, and `language` appears only where it changes the response. Response schemas and examples come from live responses of the API server. The `/plans` example is the one exception and shows illustrative values.

## Routes that are not offered

TMDB write methods and account routes return 405 with code 37 and the message "This method is not offered by amodb.". That covers everything under `account`, `authentication`, `guest_session` and `list`, and any path that ends in `/account_states` or `/rating`.

These TMDB routes return 404 with code 34, as does any other unknown path:

- `aggregate_credits` of movies, shows and seasons
- `changes` of movies, shows and people
- `/person/{id}/translations`, `/person/latest` and `/person/{id}/tagged_images`
- `/credit/{credit_id}`, `/review/{review_id}` and `/tv/episode_group/{id}`
- `images`, `translations` and `alternative_names` of collections, companies and networks
- `/tv/{id}/screened_theatrically` and `/configuration/timezones`

`include_adult` is ignored. Adult titles and people are never served.

The OMDb route returns errors as HTTP 200 with `{"Response":"False","Error":"..."}`. Only `r=json` is supported, any other `r` returns 400. Episodes and seasons are not offered.

## Install

Download `openapi.yaml`, `postman_collection.json` and `insomnia_export.json` from the [latest release](https://github.com/amodb-dev/amodb-openapi/releases), or clone the repository:

```sh
git clone https://github.com/amodb-dev/amodb-openapi
cd amodb-openapi
npm install
```

## Quick start

Lint the spec and call the API with your key:

```sh
npm run lint
curl -H "Authorization: Bearer $AMODB_API_KEY" "https://api.amodb.dev/3/movie/550"
```

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

## Links

- Website: https://amodb.dev
- Docs: https://amodb.dev/docs
- Pricing: https://amodb.dev/pricing
- Status: https://amodb.dev/status
- Issues: https://github.com/amodb-dev/amodb-openapi/issues
- Changelog: https://github.com/amodb-dev/amodb-openapi/blob/main/CHANGELOG.md
- Security: https://github.com/amodb-dev/amodb-openapi/blob/main/SECURITY.md
- Organization: https://github.com/amodb-dev

## License

MIT. See `LICENSE`.
