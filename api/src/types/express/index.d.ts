import { UserEntity } from 'src/user/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: Omit<UserEntity, 'hashedPassword'>;
    }
  }
}
