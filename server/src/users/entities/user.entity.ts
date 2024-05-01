import { Column, Table, DataType, Model, HasOne } from 'sequelize-typescript';
import { Group } from 'src/groups/entities/group.entity';
import { Praepostor } from 'src/groups/entities/praepostor.entity';

interface ICreateUser {
  tgId: number;
  username: string;
  fullName: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, ICreateUser> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    unique: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  tgId: number;

  @Column({
    type: DataType.STRING,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'none',
    allowNull: false,
  })
  role: string;

  @HasOne(() => Group)
  group: Group;

  @HasOne(() => Praepostor, { onDelete: 'CASCADE' })
  praepostor: Praepostor;
}
