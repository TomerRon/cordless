/**
 * Wait 1 second before each test.
 * This is required to prevent flakiness.
 * Otherwise, the client might fail to login.
 */
beforeEach(async () => {
  await new Promise<void>((resolve) => setTimeout(resolve, 1000))
})
