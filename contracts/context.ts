import { AuthContract } from "@ioc:Adonis/Addons/Auth";

declare module "@ioc:Adonis/Core/HttpContext" {
  interface HttpContextContract {
    auth: AuthContract;
  }
}
