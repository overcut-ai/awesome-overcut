import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class DefaultAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Allow all for testing/stub purposes
    return true;
  }
}
