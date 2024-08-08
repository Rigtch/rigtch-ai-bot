import { ApiProperty } from '@nestjs/swagger'

export abstract class SuccessDocument {
  @ApiProperty({
    type: Boolean,
  })
  success: boolean
}
