import { Column, DataType, IsEmail, Model, Table } from 'sequelize-typescript';

@Table({ timestamps: true })
export class User extends Model {
  @Column
  name: string;

  @IsEmail
  @Column({
    type: DataType.STRING,
  })
  email: string;

  @Column
  password: string;
}
