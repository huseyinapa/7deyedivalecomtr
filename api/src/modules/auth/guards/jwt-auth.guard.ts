import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // @Public() decorator ile işaretlenmiş endpoint'lere erişime izin ver
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Diğer tüm endpoint'ler için JWT doğrulama
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // Hata varsa veya kullanıcı bulunamadıysa, yetkilendirme hatası fırlat
    if (err || !user) {
      throw err || new UnauthorizedException("Lütfen giriş yapın");
    }
    return user;
  }
}
