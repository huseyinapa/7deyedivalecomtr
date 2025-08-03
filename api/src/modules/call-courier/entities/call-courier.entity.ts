import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "call_courier" })
export class CallCourier {
  @ApiProperty({ description: "Unique identifier" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ description: "Call unique identifier" })
  @Column({ nullable: true })
  uid: string;

  @ApiProperty({ description: "Sender's name" })
  @Column()
  senderName: string;

  @ApiProperty({ description: "Sender's phone number" })
  @Column()
  senderPhone: string;

  @ApiProperty({ description: "Sender's address" })
  @Column({ type: "text" })
  senderAddress: string;

  @ApiProperty({ description: "Receiver's name" })
  @Column()
  receiverName: string;

  @ApiProperty({ description: "Receiver's phone number" })
  @Column()
  receiverPhone: string;

  @ApiProperty({ description: "Receiver's address" })
  @Column({ type: "text" })
  receiverAddress: string;

  @ApiProperty({ description: "Package description" })
  @Column({ type: "text", nullable: true })
  packageDescription: string;

  @ApiProperty({ description: "Package weight in kg" })
  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  packageWeight: number;

  @ApiProperty({ description: "Package value" })
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  packageValue: number;

  @ApiProperty({ description: "Additional notes" })
  @Column({ type: "text", nullable: true })
  notes: string;

  @ApiProperty({ description: "Call status" })
  @Column({ default: "pending" })
  status: string;

  @ApiProperty({ description: "Creation date" })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: "Last update date" })
  @UpdateDateColumn()
  updatedAt: Date;
}
