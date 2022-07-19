import {
  ClientEvents,
  Message,
  PartialMessage,
  Presence,
  TextChannel,
} from 'discord.js'
import isSelfEvent from './isSelfEvent'

describe('isSelfEvent', () => {
  const mockUserId = 'user-id'

  describe("when the event's first argument is null", () => {
    const eventArgs: ClientEvents['presenceUpdate'] = [null, {} as Presence]

    it('returns false', () => {
      expect(isSelfEvent(eventArgs, mockUserId)).toBe(false)
    })
  })

  describe("when the event's first argument is not an object", () => {
    const eventArgs: ClientEvents['warn'] = ['test-warn']

    it('returns false', () => {
      expect(isSelfEvent(eventArgs, mockUserId)).toBe(false)
    })
  })

  describe("when the event's first argument is an object", () => {
    describe("when the object does not have an 'author' key", () => {
      const eventArgs: ClientEvents['channelCreate'] = [
        { type: 'GUILD_TEXT' } as TextChannel,
      ]

      it('returns false', () => {
        expect(isSelfEvent(eventArgs, mockUserId)).toBe(false)
      })
    })

    describe("when the object has a falsy 'author' key", () => {
      const eventArgs: ClientEvents['messageDelete'] = [
        { author: null, content: 'test' } as PartialMessage,
      ]

      it('returns false', () => {
        expect(isSelfEvent(eventArgs, mockUserId)).toBe(false)
      })
    })

    describe('when the object has an author with a different ID than the given user ID', () => {
      const eventArgs: ClientEvents['messageCreate'] = [
        { author: { id: 'some-other-id' }, content: 'test' } as Message,
      ]

      it('returns false', () => {
        expect(isSelfEvent(eventArgs, mockUserId)).toBe(false)
      })
    })

    describe('when the object has an author with the same ID as the given user ID', () => {
      const eventArgs: ClientEvents['messageCreate'] = [
        { author: { id: mockUserId }, content: 'test' } as Message,
      ]

      it('returns true', () => {
        expect(isSelfEvent(eventArgs, mockUserId)).toBe(true)
      })
    })
  })
})
