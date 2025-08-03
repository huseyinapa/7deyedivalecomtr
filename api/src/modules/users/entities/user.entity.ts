import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

@Entity("users")
export class User {
  @ApiProperty({ description: "Unique identifier" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "User name" })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: "User email" })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: "User password" })
  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({ description: "Is user active" })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: "Creation date" })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: "Last update date" })
  @UpdateDateColumn()
  updatedAt: Date;
}
