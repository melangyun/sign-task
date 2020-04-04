import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { TestModule } from "../test.module";
import { INestApplication } from '@nestjs/common';

describe('ROOT', () => {

  let app:INestApplication;

  beforeAll( async () => {
    const module = await Test.createTestingModule({
      imports: [TestModule]
    })
    .compile();
  
    app = module.createNestApplication();
    await app.init();

  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

});