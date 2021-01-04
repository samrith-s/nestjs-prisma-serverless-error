import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('user')
export class AppController {
  constructor(private readonly service: AppService) {}

  @Post('/')
  create() {
    return this.service.createUser();
  }
}
