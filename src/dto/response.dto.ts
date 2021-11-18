export class ResponseDto {
  constructor(statusCode: number, data: any, message: string) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  public statusCode: number;
  public data: any;
  public message: string;
}
