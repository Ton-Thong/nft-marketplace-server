import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    console.log('Hello World  ')
    return 'Hello World'
  }
}