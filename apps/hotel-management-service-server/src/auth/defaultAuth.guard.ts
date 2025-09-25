import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class DefaultAuthGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    // Stub guard that always allows access in test environment
    return true;
  }
}
