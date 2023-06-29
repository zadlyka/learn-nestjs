import * as bcrypt from 'bcrypt';
import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { User } from '../entities/user.entity';
import { RoleId } from '../../role/enums/role-id.enum';

export default setSeederFactory(User, async (faker: Faker) => {
  const user = new User();
  user.name = faker.person.fullName();
  user.email = faker.internet.email();
  user.password = await bcrypt.hash('not-set', 10);
  user.roles = [
    {
      id: RoleId.User,
      name: 'User',
      permissions: null,
      createdAt: null,
      updatedAt: null,
    },
  ];
  return user;
});
