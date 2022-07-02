import { ClientEvents } from 'discord.js'

/**
 * For a given event and user ID,
 * returns true if the event has an author
 * and the author's ID is the same as the user ID.
 *
 * This is helpful to prevent the bot from responding to itself,
 * which may cause infinite loops.
 *
 * @param eventArgs The arguments of the event
 * @param userId The user ID to check against the eventArgs
 */
const isSelfEvent = <E extends keyof ClientEvents>(
  eventArgs: ClientEvents[E],
  userId: string,
): boolean =>
  eventArgs[0] !== null &&
  typeof eventArgs[0] === 'object' &&
  'author' in eventArgs[0] &&
  !!eventArgs[0].author &&
  eventArgs[0].author.id === userId

export default isSelfEvent
