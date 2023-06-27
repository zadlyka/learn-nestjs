import { User } from '../user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    await userRepository.save({
      email: 'ggg@gmail.com',
      name: 'sfvs',
      password: '123',
    });
  }
}
