import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { AttachmentService } from '../../attachment/services/attachment.service';
import { CustomLogger } from '../../common/services/custom-logger.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;

  const manyUser = [
    {
      name: 'Test 1',
      email: 'test1@mail.com',
    },
    {
      name: 'Test 2',
      email: 'test2@mail.com',
    },
  ];

  const oneUser = manyUser[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        CustomLogger,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn().mockResolvedValue(manyUser),
            del: jest.fn(),
          },
        },
        {
          provide: AttachmentService,
          useValue: '',
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneByOrFail: jest.fn().mockImplementation((param) =>
              Promise.resolve({
                ...param,
                ...oneUser,
              }),
            ),
            create: jest
              .fn()
              .mockImplementation((createUserDto: CreateUserDto) =>
                Promise.resolve({ id: 'uuid', ...createUserDto }),
              ),
            save: jest.fn(),
            update: jest
              .fn()
              .mockImplementation((id: string, updateUserDto: UpdateUserDto) =>
                Promise.resolve({ id, updateUserDto }),
              ),
            softRemove: jest.fn().mockImplementation((param) =>
              Promise.resolve({
                ...param,
              }),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should get an array of user', async () => {
      await expect(
        service.findAll({
          path: '',
        }),
      ).resolves.toEqual(manyUser);
    });
  });

  describe('findOne', () => {
    it('should get a single user', async () => {
      await expect(service.findOne('uuid')).resolves.toEqual({
        ...oneUser,
        id: 'uuid',
      });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        ...oneUser,
        password: '123',
        roles: [],
      };
      await expect(service.create(createUserDto)).resolves.toEqual(oneUser);
    });
  });

  describe('update', () => {
    it('should update a new user', async () => {
      const updateUserDto: UpdateUserDto = {
        ...oneUser,
        password: '123',
        roles: [],
      };
      await expect(service.update('uuid', updateUserDto)).resolves.toEqual({
        id: 'uuid',
        ...oneUser,
      });
    });
  });

  describe('delete', () => {
    it('should return that it deleted a user', async () => {
      await expect(service.remove('uuid')).resolves.toEqual({
        id: 'uuid',
        ...oneUser,
      });
    });
  });
});
