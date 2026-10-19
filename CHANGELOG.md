# Changelog

All notable changes to this project are documented in this file. The format follows Keep a Changelog.

## Unreleased

Aligns the document with the live API server: 99 paths, 99 operations and 23 tags, down from 107, 107 and 25.

- Removed 12 paths that answer 404: `aggregate_credits` and `screened_theatrically` of TV shows, person translations, images and translations of collections, images and alternative names of companies and networks, `/3/configuration/timezones`, `/3/review/{review_id}` and `/3/credit/{credit_id}`. The Reviews and Credits tags are gone.
- Added `GET /3/movie/latest`, `GET /3/tv/latest`, `GET /3/tv/{series_id}/lists` and `GET /3/tv/{series_id}/showtimes`.
- Parameters now match what the server reads. Removed `include_adult`, `include_video_language`, the `page` parameter of similar, recommendations and reviews, the `country` filter of alternative titles, and `language` where it has no effect. `region` stays on movie lists and movie search, `timezone` on the airing lists.
- `append_to_response` has one list of allowed names for each of movies, TV shows, people, seasons and episodes. Appended `moods`, `soundtracks` and `ratings` have no `id`, appended `wikidata` and `showtimes` keep it.
- `showtimes` accepts `country` or `region`. Without either it returns the per country totals.
- `find` lists all 12 `external_source` values and documents the 400 response with code 22.
- Replaced the open objects of moods, soundtracks, ratings, Wikidata, showtimes, find results and external ids with typed schemas. The details schemas list the appended sections as optional properties. Credits, images, videos, translations, seasons, episodes, people and entity schemas follow the real responses. Schemas were checked against about 500 live responses.
- Examples are trimmed live responses, including moods, soundtracks, ratings, Wikidata, showtimes, find by IMDb and Kinopoisk id, the 22, 34 and 37 error bodies, and OMDb movie, series, search and error. Only the `/plans` example still shows illustrative values.
- OMDb: parameters are `i`, `t`, `s`, `type` (movie or series), `y`, `plot`, `page` and `r` (json only), plus `apikey`. Separate schemas for movie and series results. Errors are HTTP 200 with `Response` set to `False`, except `r` other than json, which returns 400.
- The introduction, tag descriptions and README list the TMDB routes that answer 405 and 404.
- Rebuilt `postman_collection.json` and `insomnia_export.json`.
- Add CI, release and Dependabot workflows.
- Repository and package URLs now point to the AmoDataBase organization.

## 0.1.0 - 2026-10-18

Initial release.

- OpenAPI 3.1 document `openapi.yaml` with 107 paths and 107 operations.
- TMDB v3 read endpoints under `/3`, amodb extensions, the OMDb compatible `/omdb/` route, images and plans.
- Generated `postman_collection.json` and `insomnia_export.json`.
