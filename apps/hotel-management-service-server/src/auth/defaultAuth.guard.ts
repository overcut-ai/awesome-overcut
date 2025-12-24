import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class DefaultAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    if (request && !request.user) {
      request.user = { roles: [] };
    }

    return true;
  }
}
