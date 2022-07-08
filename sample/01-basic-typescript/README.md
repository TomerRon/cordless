## Basic TypeScript sample

Minimal code sample for creating a cordless bot with TypeScript.

#### Setup

1. Follow [docs/setup.md](https://github.com/TomerRon/cordless/blob/master/docs/setup.md) to create a new bot in the Discord developer portal.
2. Copy the `.env` file and add your bot token:

```bash
cp .example.env .env
```

```
# .env
BOT_TOKEN=your.bot.token
```

3. Install the dependencies:

```bash
yarn
# or: npm i
```

4. Start the bot:

```bash
yarn start
# or: npm start
```

5. Run the unit tests:

```bash
yarn test
# or: npm test
```
