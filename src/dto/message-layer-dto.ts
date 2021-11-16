import { ApiProperty } from '@nestjs/swagger';

export class MessageLayerDto {
  constructor(ok: boolean, data: any, message: string) {
    this.ok = ok;
    this.data = data;
    this.message = message;
  }

  @ApiProperty()
  ok: boolean;
  @ApiProperty()
  data: any;
  @ApiProperty()
  message: string;
}
