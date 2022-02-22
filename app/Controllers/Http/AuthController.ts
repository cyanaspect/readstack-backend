import Hash from "@ioc:Adonis/Core/Hash";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

// Note:
// Backend: params handles /, request.qs() handles query
// Frontend: route handles /, params handles query

// Convention:
// We use snake_case whenever frontend talks to backend, or backend talks to db
// In all other cases, we use camelCase

export default class AuthController {
  public async login({ request, response }: HttpContextContract) {
    // Ref: https://docs.adonisjs.com/guides/security/hashing

    const data = await request.validate({
      // Note: schema.create defines the data object
      // e.g. we only need request's username and password, but not "remember me"
      schema: schema.create({
        username: schema.string({ trim: true }, [
          rules.required(),
          rules.maxLength(255),
        ]),
        password: schema.string({ trim: true }, [
          rules.required(),
          rules.maxLength(255),
        ]),
      }),
    });

    const user = await User.findBy("username", data.username);
    
    if (!user) {
      return response.status(401).json({
        message: "Username or password incorrect",
      });
    }

    const verified = await Hash.verify(user.password, data.password);
    
    if (!verified) {
      return response.status(401).json({
        message: "Username or password incorrect",
      });
    }

    return response.status(200).json({
      data: {
        token: user.id,
        username: user.username,
      },
    });
  }

  public async register({ request, response }: HttpContextContract) {
    // Todo
    // Validate username and password
    // Check if username exist in database
    const data = await request.validate({
      schema: schema.create({
        username: schema.string({ trim: true }, [
          rules.required(),
          rules.maxLength(255),
          rules.unique({ table: "users", column: "username" }),
        ]),
        email: schema.string({ trim: true }, [
          rules.required(),
          rules.maxLength(255),
          rules.unique({ table: "users", column: "email" }),
        ]),
        password: schema.string({ trim: true }, [
          rules.required(),
          rules.maxLength(255),
        ]),
      }),
    });

    const user = await User.create({
      username: data.username,
      email: data.email,
      password: await Hash.make(data.password),
    });

    return response.status(200).json({
      message: "User created successfully",
      data: {
        token: user.id,
        username: user.username,
      },
    });
  }
}
