### Context and State Management

You can share business logic and state between your event handlers using context.

In this document we will see how to use the default context, how to extend the context with your own custom context, and how to implement a basic state management solution in your bot.

#### Default context

By default, the context contains the `discord.js` client and the current list of event handlers.

For example, this event handler uses the `context.client` to describe the bot client:

```ts
const describeSelf: BotEventHandler = {
  condition: (msg) => msg.content === 'Who are you?',
  callback: async (msg, context) => {
    const { client } = context

    await msg.reply(
      `My name is ${client.user.username} and I live in ${client.guilds.cache.size} servers.`,
    )
  },
}
```

This basic example shows how to describe the bot's event handlers using the `context.handlers`:

```ts
const describeHandlers: BotEventHandler = {
  condition: (msg) => msg.content === 'How many handlers?',
  callback: async (msg, context) => {
    const { handlers } = context

    await msg.reply(`I have ${handlers.length} handlers in total.`)
  },
}
```

#### Custom context

You can extend the default context with your own custom context.

For example, here we are passing a simple `foo` string to our event handlers:

```ts
// TypeScript
type MyCustomContext = {
  foo: string
}

const customContext: MyCustomContext = {
  foo: 'bar',
}

const getFoo: BotEventHandler<'messageCreate', MyCustomContext> = {
  condition: (msg) => msg.content === 'What is foo?',
  callback: async (msg, context) => {
    const { foo } = context

    await msg.reply(`foo is ${foo}.`)
  },
}

init<MyCustomContext>({
  context: customContext,
  handlers: [getFoo],
  token: 'token',
})
```

```js
// JavaScript
const customContext = {
  foo: 'bar',
}

const getFoo = {
  condition: (msg) => msg.content === 'What is foo?',
  callback: async (msg, context) => {
    const { foo } = context

    await msg.reply(`foo is ${foo}.`)
  },
}

cordless.init({
  context: customContext,
  handlers: [getFoo],
  token: 'token',
})
```

#### State management

Consider the following basic state management solution. The "count" is persisted between handler calls.

```ts
let count = 0

type CounterState = {
  getCount: () => number
  setCount: (callback: (prevCount: number) => number) => void
}

const state: CounterState = {
  getCount: () => count,
  setCount: (callback) => {
    count = callback(count)
  },
}

const getTheCount: BotEventHandler<'messageCreate', CounterState> = {
  condition: (msg) => msg.content === "What's the count?",
  callback: async (msg, { getCount }) => {
    await msg.reply(`The count is ${getCount()}`)
  },
}

const increment: BotEventHandler<'messageCreate', CounterState> = {
  condition: (msg) => msg.content === 'increment',
  callback: async (msg, { getCount, setCount }) => {
    setCount((c) => c + 1)

    await msg.reply(`Okay. The count is now ${getCount()}`)
  },
}

init<CounterState>({
  context: state,
  handlers: [getTheCount, increment],
  token: 'token',
})
```
