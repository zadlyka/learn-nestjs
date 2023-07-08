import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/authentication/user/user.service';

describe('User', () => {
  let app: INestApplication;
  let accessToken: string;

  const user = {
    id: 'e3534893-d505-4975-babd-3e26959d40ce',
    profileId: null,
    identityCardId: null,
    name: 'test',
    email: 'admin@mail.com',
    password: '$2b$10$qF6NihfnTstqZVGi0wFGcuJCWLIVb9YNAUR4fOQYRCFU30j1aLOoa',
    createdAt: '2023-07-07T15:20:32.704Z',
    updatedAt: '2023-07-07T15:20:32.704Z',
    deletedAt: null,
    roles: [
      {
        id: 'fb662ff0-e6ed-4868-8967-f3d5fbb70ec9',
        name: 'User',
        permissions: [202, 102],
        createdAt: '2023-07-03T13:06:49.790Z',
        updatedAt: '2023-07-07T15:20:32.637Z',
        deletedAt: null,
      },
    ],
    profile: null,
    identityCard: null,
  };

  const userService = {
    findAll: () => [user],
    findOne: () => user,
    findOneByUsername: () => user,
    create: () => user,
    update: () => user,
    remove: () => user,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer())
      .post('/auth')
      .send({ username: 'admin@mail.com', password: 'not-set' });

    accessToken = response.body.data.accessToken;
  });

  it(`/GET user`, () => {
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK)
      .expect({
        statusCode: HttpStatus.OK,
        data: userService.findAll(),
      });
  });

  it(`/GET/:id User`, () => {
    return request(app.getHttpServer())
      .get(`/user/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK)
      .expect({
        statusCode: HttpStatus.OK,
        data: userService.findOne(),
      });
  });

  it(`/POST User`, () => {
    return request(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(user)
      .expect(HttpStatus.CREATED)
      .expect({
        statusCode: HttpStatus.CREATED,
        data: userService.create(),
      });
  });

  it(`/PATCH/:id User`, () => {
    return request(app.getHttpServer())
      .patch(`/user/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(user)
      .expect(HttpStatus.OK)
      .expect({
        statusCode: HttpStatus.OK,
        data: userService.update(),
      });
  });

  it(`/DELETE/:id User`, () => {
    return request(app.getHttpServer())
      .delete(`/user/${user.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(user)
      .expect(HttpStatus.OK)
      .expect({
        statusCode: HttpStatus.OK,
        data: userService.remove(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
