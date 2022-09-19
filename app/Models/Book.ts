import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Stack from "./Stack";

export default class Book extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public author: string;

  @column()
  public coverPhotoUrl: string;

  @column()
  public stackId: number;

  @belongsTo(() => Stack)
  public stack: BelongsTo<typeof Stack>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
