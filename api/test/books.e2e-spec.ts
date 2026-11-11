import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import 'reflect-metadata';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { BooksController } from '../src/books/books.controller';
import { BooksService } from '../src/books/books.service';

let app: INestApplication;
const booksService = {
  findAll: async () => ({
      data: [{ id: 1, title: 'The Hobbit', author: 'J.R.R. Tolkien' }],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    }),
};

before(async () => {
  Reflect.defineMetadata('design:paramtypes', [BooksService], BooksController);
  const moduleRef = await Test.createTestingModule({
    controllers: [BooksController],
    providers: [{ provide: BooksService, useValue: booksService }],
  }).compile();

  app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
});

after(async () => {
  await app.close();
});

test('books endpoint serves a paginated catalog response over HTTP', async () => {
  const response = await request(app.getHttpServer())
    .get('/books')
    .query({ page: '1', limit: '10' })
    .expect(200);

  assert.equal(response.body.data.length, 1);
  assert.equal(response.body.data[0].title, 'The Hobbit');
  assert.equal(response.body.meta.total, 1);
});
