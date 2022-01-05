import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Stack from "App/Models/Stack";
import User from "App/Models/User";

export default class StacksController {
  public async list({ request, response }: HttpContextContract) {
    const query = request.qs();
    let stackQuery = Stack.query();

    if (query.username) {
      const user = await User.findBy("username", query.username);
      if (!user) {
        return response.status(404).json({
          message: "User not found",
        });
      }
      stackQuery.where("user_id", user.id);
    }

    const stacks = await stackQuery;

    return response.status(200).json({
      data: stacks,
    });
  }

  public async retrieve({ response, params }: HttpContextContract) {
    const stack = await Stack.find(params.id);

    if (!stack) {
      return response.status(404).json({
        message: "Stack not found",
      });
    }

    return response.status(200).json({
      message: "Stack retrieved successfully",
      data: stack,
    });
  }

  public async create(ctx: HttpContextContract) {
    // ref: https://docs.adonisjs.com/guides/validator/introduction

    const data = await ctx.request.validate({
      schema: schema.create({
        name: schema.string({ trim: true }, [
          rules.required(),
          rules.maxLength(255),
        ]),
      }),
    });

    const stack = await Stack.create({
      name: data.name,
      userId: ctx.auth.id,
    });

    return ctx.response.status(200).json({
      message: "Stack created successfully",
      data: stack,
    });
  }

  public async update(ctx: HttpContextContract) {
    const data = await ctx.request.validate({
      schema: schema.create({
        name: schema.string({ trim: true }, [
          rules.required(),
          rules.maxLength(255),
        ]),
      }),
    });

    const stack = await Stack.find(ctx.params.id);

    if (!stack || ctx.auth.id !== stack.userId) {
      return ctx.response.status(404).json({
        message: "Stack not found",
      });
    }

    stack.name = data.name;
    await stack.save();

    return ctx.response.status(200).json({
      message: "Stack updated successfully",
    });
  }

  public async delete(ctx: HttpContextContract) {
    const stack = await Stack.find(ctx.params.id);

    if (!stack || ctx.auth.id !== stack.userId) {
      return ctx.response.status(404).json({
        message: "Stack not found",
      });
    }
    console.log("delete attempted");
    console.log(stack);
    await stack.delete();
    console.log("delete done");
    return ctx.response.status(200).json({
      message: "Stack deleted successfully",
    });
  }
}
