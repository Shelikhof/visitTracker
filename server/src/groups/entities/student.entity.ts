import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Group } from './group.entity';
import { Visiting } from 'src/visitings/entities/visiting.entity';

interface ICreateStudent {
  groupId: string;
  fullName: string;
  isIP: boolean;
  job: string | null;
}

@Table({ tableName: 'students' })
export class Student extends Model<Student, ICreateStudent> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    unique: true,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  fullName: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isIP: boolean;

  @Column({
    type: DataType.STRING,
  })
  job: string;

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID })
  groupId: string;

  @BelongsTo(() => Group)
  group: Group;

  @HasMany(() => Visiting, { onDelete: 'CASCADE' })
  visitings: Visiting[];
}
