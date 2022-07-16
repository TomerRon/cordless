### Context and State Management

You can share business logic and state between your functions using context.

In this document we will see how to use the default context, how to extend the context with your own custom context, and how to implement a basic state management solution in your bot.

#### Default context

By default, the context contains the `discord.js` client and the current list of functions.

For example, this function uses the `context.client` to describe the bot client:

```ts
const describeSelf: BotFunction = {
  condition: (msg) => msg.content === 'Who are you?',
  callback: async (msg, context) => {
    const { client } = context

    await msg.reply(
      `My name is ${client.user?.username} and I live in ${client.guilds.cache.size} servers.`,
    )
  },
}
```

This function uses the `context.functions` to describe the bot functions:

```ts
const describeFunctions: BotFunction = {
  condition: (msg) => msg.content === 'What are the functions?',
  callback: async (msg, context) => {
    const { functions } = context

    const fnNames = functions.map((f) => f.name || 'unnamed').join(', ')

    await msg.reply(
      `I have ${functions.length} functions in total. They are: ${fnNames}`,
    )
  },
}
```

#### Custom context

You can extend the default context with your own custom context.

For example, here we are passing a simple `foo` string to our functions:

```ts
// TypeScript
type MyCustomContext = {
  foo: string
}

const customContext: MyCustomContext = {
  foo: 'bar',
}

const getFoo: BotFunction<'messageCreate', MyCustomContext> = {
  condition: (msg) => msg.content === 'What is foo?',
  callback: async (msg, context) => {
    const { foo } = context

    await msg.reply(`foo is ${foo}.`)
  },
}

init<MyCustomContext>({
  context: customContext,
  functions: [getFoo],
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
  functions: [getFoo],
  token: 'token',
})
```

#### State management

Consider the following basic state management solution. The "count" is persisted between function calls.

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

const getTheCount: BotFunction<'messageCreate', CounterState> = {
  condition: (msg) => msg.content === "What's the count?",
  callback: async (msg, { getCount }) => {
    await msg.reply(`The count is ${getCount()}`)
  },
}

const increment: BotFunction<'messageCreate', CounterState> = {
  condition: (msg) => msg.content === 'increment',
  callback: async (msg, { getCount, setCount }) => {
    setCount((c) => c + 1)

    await msg.reply(`Okay. The count is now ${getCount()}`)
  },
}

init<CounterState>({
  context: state,
  functions: [getTheCount, increment],
  token: 'token',
})
```
