import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Book from "App/Models/Book";
import Stack from "App/Models/Stack";
import User from "App/Models/User";

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.create({
      username: "test",
      email: "test@test.com",
    });
    await User.create({
      username: "admin",
      email: "admin@test.com",
    });

    await Stack.createMany([
      {
        name: "test",
        userId: 1,
      },
      {
        name: "test2",
        userId: 1,
      },
      {
        name: "test-admin-1",
        userId: 2,
      },
      {
        name: "test-admin-2",
        userId: 2,
      },
    ]);

    await Book.createMany([
      {
        title: "test",
        author: "test",
        coverPhotoUrl: "https://i.imgur.com/fZBreBJ.jpeg",
        stackId: 1,
      },
    ]);
    // Write your database queries inside the run method
  }
}
