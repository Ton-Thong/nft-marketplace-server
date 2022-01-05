
export class MessageLayerDto {
  public ok: boolean;
  public data: any;
  public message: string;
}

export class MessageLayerDtoT<T> {
  public ok: boolean;
  public data: T;
  public message: string;
}