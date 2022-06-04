/**
 * Wait 2 seconds before each test.
 * This is required to prevent flakiness.
 * Otherwise, the client might fail to login.
 */
beforeEach(async () => {
  await new Promise<void>((resolve) => setTimeout(resolve, 2000))
})

jest.setTimeout(10000)
