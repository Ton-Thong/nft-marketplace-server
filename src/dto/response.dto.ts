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

export class ResponseDtoT<T> {
  constructor(statusCode: number, data: T, message: string) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  public statusCode: number;
  public data: T;
  public message: string;
}
