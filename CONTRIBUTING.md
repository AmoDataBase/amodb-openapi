# Contributing

Thanks for helping. Keep changes small and focused.

1. Open an issue first for anything larger than a bug fix or a doc fix.
2. Fork the repository and create a branch from `main`.
3. Run the checks before you open a pull request. They lint `openapi.yaml` and rebuild the Postman and Insomnia files, which you commit with your change:

```sh
npm install
npm run check
```

4. Add or update tests for the behavior you change.
5. Write commit messages in the imperative mood, one short line, no trailing period.

Text in docs and comments: short, concrete sentences, sentence case headings, no long dashes.

Never commit API keys. Use environment variables and `.env` files that are ignored by git.

## Releasing

For maintainers.

1. Run `npm run check` and commit the rebuilt collections.
2. Update `CHANGELOG.md`.
3. Tag the commit and push the tag: `git tag v0.2.0 && git push origin v0.2.0`.

The Release workflow creates the GitHub release and attaches `openapi.yaml`, `postman_collection.json` and `insomnia_export.json`.

By contributing you agree that your work is released under the MIT license of this repository.
