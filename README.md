A Cloudflare Worker that utilises D1 (SQLite) to create a short url for a provided long url.

This project is an excuse to try out some new tools (namely Cloudflare Workers and D1). However, it also serves as an example of how you can build, deploy and test via CI.

# Local Development

`package.json` contains some commands for local development. `npm i && npm start` _should_ just work. As should `npm test`. If you wish to perform Cloudflare actions locally, then you'll need to run `npx wrangler login` first.

Invoking the endpoint can be done like so:

```bash
curl -i -X POST http://localhost:8787/api/shorten?url=http://example.com # response returns an alternative url that can be used for requests and returns a 301 to the original URL
```

# Building

[.github/workflows/build.yml](.github/workflows/build.yml) describes the process in a repeatable way.

# Deployment

Also done via GitHub Actions. However if you want to deploy manually, you can do so with Wrangler by running `npm run deploy`.

# Database

```bash
npm run db:init # executes the migration script to setup the db
npm run db:query # simple select statement against the DB

# the above commands run locally due to the `--local` flag.

npm run db:generate # generates a migration script if you change the schema
```

# The Design

## Architecture

The architecture is simple, it consists of:

- A CloudFlare Worker (serverless function, exposes a HTTP API)
- Cloudflare D1 (SQLite serverless database: with automatic read replicas)

## Shortfalls

### Hashing algorithm

Some decisions have been made in order to keep the project fun, but which would limit real life usage:

- The SHA-512 hash is split to reduce the size, increasing the risk of a collision

I may improve this at some point as it's own challenge, but the problem stands today.

### The "short url" isn't actually that short

The API design / routing could be reduced further. Also the domain name I've bound is my own, and isn't that short on it's own! But, it proves the concept.

## Positives

On the flip side, there's some positives:

- Using Cloudflare Workers is serverless, so less to worry about in terms of scaling
- Using Cloudflare D1, also serverless (SQLite) with automatic read replicas

The Wrangler tooling also works very nicely for local development.
