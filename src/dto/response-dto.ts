import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  constructor(statusCode: number, data: any, message: string) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  data: any;
  @ApiProperty()
  message: string;
}
