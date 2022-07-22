### Command Options

You can allow your command to receive options (arguments) by adding an `options` array.

Each option must have a `type`, which can be one of the following:

```
STRING | INTEGER | BOOLEAN | USER | CHANNEL | ROLE | MENTIONABLE | NUMBER | ATTACHMENT
```

Options are not required by default, but can be marked as required by passing `required: true`. Required options must appear before non-required options (according to the Discord API requirements).

You can access the provided options by getting them from the interaction:

```ts
const language = interaction.options.getString('language', true)
```

#### Basic example

The following example takes a required string input and yells it back:

```ts
import { BotCommand } from 'cordless'
import { ApplicationCommandOptionType } from 'discord.js'

const yell: BotCommand = {
  name: 'yell',
  description: 'Yells back your input.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'input',
      description: 'The input to yell back.',
      required: true,
    },
  ],
  handler: ({ interaction }) => {
    const input = interaction.options.getString('input', true)

    interaction.reply(input.toUpperCase())
  },
}
```

#### Advanced usage

Options of type `STRING | INTEGER | NUMBER` can receive a list of `choices`. If provided with a list of `choices`, the user will only be able to select from one of the choices.

```ts
{
  type: ApplicationCommandOptionType.String,
  name: 'language',
  choices: [
    {
      name: 'English',
      value: 'en',
    },
    {
      name: 'Deutsch',
      value: 'de',
    },
    {
      name: 'Français',
      value: 'fr',
    },
  ],
}
```

Options of type `INTEGER | NUMBER` can receive an optional minimum and maximum value:

```ts
import { BotCommand } from 'cordless'
import { ApplicationCommandOptionType } from 'discord.js'

const double: BotCommand = {
  name: 'double',
  description: 'Doubles the given number.',
  options: [
    {
      type: ApplicationCommandOptionType.Number,
      name: 'num',
      required: true,
      min: 1,
      max: 50,
    },
  ],
  handler: ({ interaction }) => {
    const num = interaction.options.getNumber('num', true)

    interaction.reply(`${num * 2}`)
  },
}
```
