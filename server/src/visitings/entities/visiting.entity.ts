import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Group } from 'src/groups/entities/group.entity';
import { Student } from 'src/groups/entities/student.entity';

interface ICreateVisiting {
  studentId: string;
  isVisit: boolean;
  isRespectfulReason: boolean;
  groupId: string;
  isEat: boolean;
  date?: Date;
  isVisitPractice?: boolean;
}

@Table({ tableName: 'visitings', timestamps: false })
export class Visiting extends Model<Visiting, ICreateVisiting> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    unique: true,
  })
  id: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isVisit: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  })
  isEat: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  })
  isRespectfulReason: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  })
  isVisitPractice: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.DATE,
  })
  date: Date;

  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  groupId: string;

  @BelongsTo(() => Student)
  student: Student;

  @BelongsTo(() => Group)
  group: Group;
}
