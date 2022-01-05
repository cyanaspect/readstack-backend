import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import User from "./User";

export default class Stack extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  // note: Adonis will convert camelCase to snake_case in models (but not in validate!)
  @column()
  public userId: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
