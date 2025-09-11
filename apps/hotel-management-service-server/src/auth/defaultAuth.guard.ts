import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class DefaultAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Stub guard always passes. In production, implement real auth logic.
    return true;
  }
}
