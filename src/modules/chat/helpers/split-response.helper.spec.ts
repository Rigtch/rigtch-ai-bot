import { splitResponse } from './split-response.helper'

describe('splitResponse', () => {
  test('should split response', async () => {
    const response = Array.from({ length: 10 })
      .map(() => Array.from({ length: 1000 }).join('a'))
      .join('\n\n')

    const splittedResponse = await splitResponse(response)

    expect(splittedResponse).toHaveLength(5)
  })
})
