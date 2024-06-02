import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { Praepostor } from './praepostor.entity';
import { Student } from './student.entity';
import { Visiting } from 'src/visitings/entities/visiting.entity';

interface ICreateGroup {
  name: string;
  curatorId?: string;
}

@Table({ tableName: 'groups' })
export class Group extends Model<Group, ICreateGroup> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    unique: true,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isBudget: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  curatorId: string;

  @BelongsTo(() => User)
  curator: User;

  @HasMany(() => Praepostor, { onDelete: 'CASCADE' })
  praepostors: Praepostor[];

  @HasMany(() => Student, { onDelete: 'CASCADE' })
  students: Student[];

  @HasMany(() => Visiting, { onDelete: 'CASCADE' })
  visitings: Visiting[];
}
