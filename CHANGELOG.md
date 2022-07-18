# [3.0.0-beta.4](https://github.com/TomerRon/cordless/compare/v3.0.0-beta.3...v3.0.0-beta.4) (2022-07-18)


### Features

* **commands:** allow commands to receive subcommands ([14449ae](https://github.com/TomerRon/cordless/commit/14449aee71eda44a922c0b26ee00b5632bfa87de))

# [3.0.0-beta.3](https://github.com/TomerRon/cordless/compare/v3.0.0-beta.2...v3.0.0-beta.3) (2022-07-17)


### Features

* **client:** modify initialization behavior to return a logged-in client ([bdc902a](https://github.com/TomerRon/cordless/commit/bdc902a3c222dd7c98ae2f811976270f387f4980))


### BREAKING CHANGES

* **client:** The init method now returns a `Promise<Discord.Client<true>>`. You now need to `await init()` if you want to use the returned client.

# [3.0.0-beta.2](https://github.com/TomerRon/cordless/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2022-07-17)


### Features

* **commands:** allow commands to receive options ([f283a00](https://github.com/TomerRon/cordless/commit/f283a00e989a1673d4731893373fcae9e3b7e70c))

# [3.0.0-beta.1](https://github.com/TomerRon/cordless/compare/v2.2.0...v3.0.0-beta.1) (2022-07-16)


### Features

* **commands:** Add Application Commands integration ([cb3a55f](https://github.com/TomerRon/cordless/commit/cb3a55fdc27bf4068172eb01190c6ed4884d72b2))


### BREAKING CHANGES

* **commands:** With the introduction of Application Commands, the bot token must now be passed into the initialization method (even if you are not using commands).
Also, the client now logs in automatically, so you should not call `.login(token)` anymore.

# [2.2.0](https://github.com/TomerRon/cordless/compare/v2.1.0...v2.2.0) (2022-07-02)


### Features

* **functions:** allow functions to subscribe to any Discord event, not just messageCreate ([cd2887b](https://github.com/TomerRon/cordless/commit/cd2887b1cd192af137e3d6edb25baa3e7a186586))

# [2.1.0](https://github.com/TomerRon/cordless/compare/v2.0.0...v2.1.0) (2022-06-04)


### Features

* **client:** add gateway intents ([bb79b53](https://github.com/TomerRon/cordless/commit/bb79b53f15bdb5339b1e6f279036adf425b6b1f0))

# [2.0.0](https://github.com/TomerRon/cordless/compare/v1.3.1...v2.0.0) (2022-06-01)


### chore

* **deps:** upgrade discord.js to v13 ([52234a1](https://github.com/TomerRon/cordless/commit/52234a19b3551208ef4d74f53968467f618b5f97))


### BREAKING CHANGES

* **deps:** Discord.js has been upgraded to v13.
Please be aware there are breaking changes in discord.js@13, see: https://discordjs.guide/additional-info/changes-in-v13.html
The minimum required Node version is now v16.5.0.

## [1.3.1](https://github.com/TomerRon/cordless/compare/v1.3.0...v1.3.1) (2021-03-03)


### Bug Fixes

* **functions:** fix return type for async function callbacks ([0bbe9c2](https://github.com/TomerRon/cordless/commit/0bbe9c2a93430696ffba9929c8a37337e399e319))

# [1.3.0](https://github.com/TomerRon/cordless/compare/v1.2.0...v1.3.0) (2021-02-18)


### Features

* **context:** add base context and custom context ([948c81d](https://github.com/TomerRon/cordless/commit/948c81dad39ebe3847462ac438116d130153c13a))

# [1.2.0](https://github.com/TomerRon/cordless/compare/v1.1.0...v1.2.0) (2021-02-15)


### Features

* **help:** add built-in help function ([0312dcf](https://github.com/TomerRon/cordless/commit/0312dcf7e4110e5f13346726beaca45f9030a11b))

# [1.1.0](https://github.com/TomerRon/cordless/compare/v1.0.0...v1.1.0) (2021-02-14)


### Features

* **name:** change package name to cordless (trigger release) ([da6fed3](https://github.com/TomerRon/cordless/commit/da6fed3e27a264a353076f83481c5e80b184e6ec))

# 1.0.0 (2021-02-14)


### Features

* add base functionality ([b533cce](https://github.com/TomerRon/cordless/commit/b533cce2933d7687b03ed635e0717b4a4722512c))
