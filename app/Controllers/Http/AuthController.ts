import Hash from "@ioc:Adonis/Core/Hash";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";


export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {

    const data = await request.validate({
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

    try {
      const token = await auth.use("api").attempt(data.username, data.password, {
        expiresIn: '1 day'
      })
      return response.status(200).json({
        data: {
          token: token.token,
          username: user.username
        }
      })
    } catch {
      return response.unauthorized("Invalid credentials")
    }
  }

  public async register({ auth, request, response }: HttpContextContract) {
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

    const token = await auth.use("api").attempt(data.username, data.password, {
      expiresIn: '1 day'
    })

    return response.status(200).json({
      message: "User created successfully",
      data: {
        token: token.token,
        username: user.username,
      },
    });
  }
}
