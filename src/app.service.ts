import { Injectable } from '@nestjs/common';
import { ORMService } from './orm/orm.service';

@Injectable()
export class AppService {
  constructor(private readonly orm: ORMService) {}

  createUser() {
    return this.orm.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe!example.com',
        password: 'password',
      },
    });
  }
}
