import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module'; // Adjust the path based on your project structure
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

describe('GroupsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/groups/create (POST)', async () => {
    const createGroupDto: CreateGroupDto = {
      name: 'your_group_name',
      // Provide necessary properties for createGroupDto
    };

    return request(app.getHttpServer())
      .post('/groups/create')
      .send(createGroupDto)
      .expect(HttpStatus.CREATED);
  });

  it('/groups (GET)', async () => {
    return request(app.getHttpServer()).get('/groups').expect(HttpStatus.OK);
  });

  it('/groups/:id (GET)', async () => {
    const groupId = 'your_group_id'; // Provide an existing group ID

    return request(app.getHttpServer())
      .get(`/groups/${groupId}`)
      .expect(HttpStatus.OK);
  });

  it('/groups/:id (PATCH)', async () => {
    const groupId = 'your_group_id'; // Provide an existing group ID
    const updateGroupDto: UpdateGroupDto = {
      // Provide necessary properties for updateGroupDto
    };

    return request(app.getHttpServer())
      .patch(`/groups/${groupId}`)
      .send(updateGroupDto)
      .expect(HttpStatus.OK);
  });

  it('/groups/:id (DELETE)', async () => {
    const groupId = 'your_group_id'; // Provide an existing group ID

    return request(app.getHttpServer())
      .delete(`/groups/${groupId}`)
      .expect(HttpStatus.OK);
  });
});
