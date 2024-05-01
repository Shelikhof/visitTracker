import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { Group } from './group.entity';

@Table({ tableName: 'praepostors' })
export class Praepostor extends Model<Praepostor> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    unique: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID, allowNull: false })
  groupId: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Group)
  group: Group;
}
