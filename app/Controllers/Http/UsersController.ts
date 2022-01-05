import Hash from "@ioc:Adonis/Core/Hash";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

export default class UsersController {
  public async list(_: HttpContextContract) {
    return await User.all();
  }

  public async retrieve({ response, params }: HttpContextContract) {
    const user = await User.findOrFail(params.id);
    if (!user) {
      return response.status(404).json({
        message: "User not found",
      });
    }
  }

  public async create({ request, response }: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        username: schema.string({ trim: true }, [
          rules.required(),
          rules.maxLength(255),
        ]),
        email: schema.string({ trim: true }, [
          rules.required(),
          rules.maxLength(255),
        ]),
        password: schema.string({}, [rules.required(), rules.maxLength(255)]),
      }),
    });

    const user = await User.create({
      username: data.username,
      email: data.email,
      password: data.password,
    });

    return response.status(200).json({
      message: "User created successfully",
      data: user,
    });
  }

  public async update({ request, response, params }: HttpContextContract) {
    // update password
    const data = await request.validate({
      schema: schema.create({
        old_password: schema.string({}, [
          rules.required(),
          rules.maxLength(255),
        ]),
        new_password: schema.string({}, [
          rules.required(),
          rules.maxLength(255),
        ]),
      }),
    });

    const user = await User.findBy("user_id", params.userId);

    if (!user) {
      return response.status(404).json({
        message: "User not found",
      });
    }

    const verified = await Hash.verify(user.password, data.old_password);

    if (!verified) {
      return response.status(401).json({
        message: "Username or password incorrect",
      });
    }

    user.password = await Hash.make(data.new_password);
    await user.save();

    return response.status(200).json({
      message: "User updated successfully",
    });
  }

  public async delete({ response, params }: HttpContextContract) {
    const user = await User.find(params.id);

    if (!user) {
      return response.status(404).json({
        message: "User not found",
      });
    }

    await user.delete();

    return response.status(200).json({
      message: "User deleted successfully",
    });
  }
}
