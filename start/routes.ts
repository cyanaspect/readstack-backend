/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.post("/users", "UsersController.create");
Route.get("/users", "UsersController.list").middleware("auth");
Route.get("/users/:id", "UsersController.retrieve");
Route.put("/users/:id", "UsersController.update").middleware("auth");
Route.delete("/users/:id", "UsersController.delete").middleware("auth");

Route.post("/stacks", "StacksController.create").middleware("auth");
Route.get("/stacks", "StacksController.list");
Route.get("/stacks/:id", "StacksController.retrieve");
Route.put("/stacks/:id", "StacksController.update").middleware("auth");
Route.delete("/stacks/:id", "StacksController.delete").middleware("auth");

Route.post("/books", "BooksController.create").middleware("auth");
Route.get("/books", "BooksController.list");
Route.get("/books/:id", "BooksController.retrieve");
Route.delete("/books/:id", "BooksController.delete").middleware("auth");

Route.post("/register", "AuthController.register");
Route.post("/login", "AuthController.login");

Route.get("/:username", "ProfileController.retrieve");
