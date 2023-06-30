import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Role } from '../../authentication/role/entities/role.entity';
import { RoleId } from '../../authentication/role/enums/role-id.enum';
import { Permission } from '../../authentication/role/enums/permission.enum';

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const roleRepository = dataSource.getRepository(Role);
    await roleRepository.save({
      id: RoleId.Admin,
      name: 'Admin',
      permissions: [Permission.ManageAll],
    });

    await roleRepository.save({
      id: RoleId.User,
      name: 'User',
      permissions: [Permission.ReadUser, Permission.ReadRole],
    });
  }
}
