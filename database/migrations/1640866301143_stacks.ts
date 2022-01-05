import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Stacks extends BaseSchema {
  protected tableName = "stacks";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.integer("user_id").references("id").inTable("users");
      table.string("name");

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
