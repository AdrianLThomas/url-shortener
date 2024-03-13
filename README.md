A Cloudflare Worker that utilises D1 (SQLite) to create a short url for a provided long url.

This project is an excuse to try out some new tools (namely Cloudflare Workers and D1). However, it also serves as an example of how you can build, deploy and test via CI.

# Building
`.github/workflows` describes the process in a repeatable way. 

# Local Development
`package.json` contains some commands for local development. `npm i && npm start` _should_ just work.

# The Design
## Architecture
TODO add diagram

## Shortfalls
### Hashing algorithm
Some decisions have been made in order to keep the project fun, but which would limit real life usage:
- MD5 hashing used (known to eventually conflict)
- The MD5 hash is also split to reduce the size, further increasing the risk of conflict

I may improve this at some point as it's own challenge, but the problem stands today.

## Positives
On the flip side, there's some positives:
- Using Cloudflare Workers is serverless, so less to worry about in terms of scaling
- Using Cloudflare D1, also serverless (SQLite) with automatic read replicas

The Wrangler tooling also works very nicely for local development.


