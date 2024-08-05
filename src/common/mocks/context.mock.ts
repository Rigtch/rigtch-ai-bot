import type { ExecutionContext } from '@nestjs/common'
import { mock } from 'vitest-mock-extended'

export function contextMockFactory(result: unknown) {
  return mock<ExecutionContext>({
    getArgByIndex: vi.fn().mockReturnValue(result),
  })
}
