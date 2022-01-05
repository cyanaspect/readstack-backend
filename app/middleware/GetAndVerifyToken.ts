import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

// Ref: https://docs.adonisjs.com/guides/middleware#middleware-classes
// Get token from request Authorization header
// Ref: https://docs.adonisjs.com/guides/request#request-headers
// Check if token is valid
// Find user by token in database
// Add user to context
// Ref: https://docs.adonisjs.com/guides/context#extending-context

// created using node ace make:middleware GetToken
export default class GetToken {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const token = ctx.request.headers().authorization;

    if (!token) {
      return ctx.response.status(401).json({
        message: "Invalid token",
      });
    }

    const user = await User.findBy("id", token);

    if (!user) {
      return ctx.response.status(401).json({
        message: "Invalid token",
      });
    }

    ctx.auth = user;
    await next();
  }
}
