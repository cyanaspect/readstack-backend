import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Book from "App/Models/Book";
import Stack from "App/Models/Stack";

export default class BooksController {
  public async list({ request, response }: HttpContextContract) {
    const query = request.qs();
    let bookQuery = Book.query();

    // no 404 error for privacy purpose
    if (query.stack_id) {
      bookQuery.where("stack_id", query.stack_id);
    }

    const books = await bookQuery;

    return response.status(200).json({
      data: books,
    });
  }

  public async retrieve({ response, params }: HttpContextContract) {
    const book = await Book.find(params.id);

    if (!book) {
      return response.status(404).json({
        message: "Book not found",
      });
    }

    return response.status(200).json({
      message: "Book retrieved successfully",
      data: book,
    });
  }

  public async create(ctx: HttpContextContract) {
    // ref: https://docs.adonisjs.com/guides/validator/introduction/
    // after validation, the type of the properties will change (rather than any)
    const data = await ctx.request.validate({
      schema: schema.create({
        title: schema.string({ trim: true }, [
          rules.required(),
          rules.maxLength(255),
        ]),
        author: schema.string({ trim: true }, [
          rules.required(),
          rules.maxLength(255),
        ]),
        cover_photo_url: schema.string({}, [rules.required()]),
        stack_id: schema.number([
          rules.required(),
          rules.exists({ table: "stacks", column: "id" }),
        ]),
      }),
    });

    const stack = await Stack.findBy("id", data.stack_id);

    if (ctx.auth.id !== stack?.userId) {
      return ctx.response.status(404).json({
        message: "Stack not found",
      });
    }

    const book = await Book.create({
      title: data.title,
      author: data.author,
      coverPhotoUrl: data.cover_photo_url,
      stackId: data.stack_id,
    });

    return ctx.response.status(200).json({
      message: "Book created successfully",
      data: book,
    });
  }

  public async delete(ctx: HttpContextContract) {
    const book = await Book.find(ctx.params.id);

    if (!book) {
      return ctx.response.status(404).json({
        message: "Book not found",
      });
    }

    const stack = await Stack.find(book.stackId);

    if (ctx.auth.id !== stack?.userId) {
      // user has attempted to delete stack that he doesn't own
      return ctx.response.status(404).json({
        message: "Book not found",
      });
    }

    await book.delete();

    return ctx.response.status(200).json({
      message: "Book deleted successfully",
    });
  }
}
