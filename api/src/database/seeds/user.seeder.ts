import { User } from "../../modules/users/entities/user.entity";
import { EntityManager } from "typeorm";
import * as bcrypt from "bcrypt";

export class UserSeeder {
  async run(entityManager: EntityManager): Promise<void> {
    const adminUser = {
      name: "Admin User",
      email: "admin@example.com",
      password: await bcrypt.hash("adminPassword123", 10),
      isActive: true,
    };

    // Check if admin user already exists
    const existingAdmin = await entityManager.findOne(User, {
      where: { email: adminUser.email },
    });

    if (!existingAdmin) {
      await entityManager.save(User, adminUser);
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }
  }
}
