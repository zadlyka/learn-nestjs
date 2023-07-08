import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../authentication/user/entities/user.entity';
import { RoleId } from '../../authentication/role/enums/role-id.enum';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    await userRepository.save({
      email: 'admin@mail.com',
      name: 'admin',
      password: await bcrypt.hash('not-set', 10),
      roles: [
        {
          id: RoleId.User,
        },
      ],
    });
    await factoryManager.get(User).saveMany(5);
  }
}
