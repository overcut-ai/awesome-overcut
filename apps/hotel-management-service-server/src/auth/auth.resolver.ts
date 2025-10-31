import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { CredentialsInput } from "./credentials.input";
import { LoginResponse } from "./login-response.object";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { Res } from "@nestjs/common";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args("credentials") credentials: CredentialsInput,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponse> {
    const { username, password } = credentials;
    const accessToken = await this.authService.validateUser(username, password).then(() => this.authService.login(username));

    // Set HttpOnly cookie for access token
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      path: "/",
      maxAge: Number(process.env.JWT_COOKIE_MAX_AGE ?? 1000 * 60 * 60 * 24), // default 1 day
    });

    return { accessToken };
  }

  @Mutation(() => Boolean)
  async logout(@Res({ passthrough: true }) res: Response): Promise<boolean> {
    res.clearCookie("accessToken", { path: "/" });
    return true;
  }
}
