import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('users')
export class AppController {
  constructor(private readonly service: AppService) {}

  @Post()
  create() {
    return this.service.createUser();
  }
}
