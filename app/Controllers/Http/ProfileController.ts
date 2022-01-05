import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Stack from "App/Models/Stack";
import User from "App/Models/User";

export default class ProfileController {
  public async retrieve({ response, params }: HttpContextContract) {
    const user = await User.query().where("username", params.username).first();

    if (!user) {
      return response.status(404);
    }

    const stacks = await Stack.findBy("user_id", user.id);

    return response.status(200).json({
      data: stacks,
    });
  }
}
