import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;

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
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((createUserDto: CreateUserDto) =>
                Promise.resolve({ id: 'uuid', ...createUserDto }),
              ),
            findAll: jest.fn().mockResolvedValue(manyUser),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id,
                ...oneUser,
              }),
            ),
            remove: jest
              .fn()
              .mockImplementation((id: string) => Promise.resolve({ id })),
            update: jest
              .fn()
              .mockImplementation((id: string, updateUserDto: UpdateUserDto) =>
                Promise.resolve({ id, ...updateUserDto }),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should get an array of user', async () => {
      await expect(
        controller.findAll({
          path: '',
        }),
      ).resolves.toEqual(manyUser);
    });
  });

  describe('findOne', () => {
    it('should get a single user', async () => {
      await expect(controller.findOne('uuid')).resolves.toEqual({
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
      await expect(controller.create(createUserDto)).resolves.toEqual({
        id: 'uuid',
        ...createUserDto,
      });
    });
  });

  describe('update', () => {
    it('should update a new user', async () => {
      const updateUserDto: UpdateUserDto = {
        ...oneUser,
        password: '123',
        roles: [],
      };
      await expect(controller.update('uuid', updateUserDto)).resolves.toEqual({
        id: 'uuid',
        ...updateUserDto,
      });
    });
  });

  describe('delete', () => {
    it('should return that it deleted a user', async () => {
      await expect(controller.remove('uuid')).resolves.toEqual({
        id: 'uuid',
      });
    });
  });
});
