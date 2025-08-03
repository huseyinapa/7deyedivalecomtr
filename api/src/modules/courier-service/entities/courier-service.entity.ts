import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "courier_service" })
export class CourierService {
  @ApiProperty({ description: "Unique identifier" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ description: "Company name" })
  @Column()
  companyName: string;

  @ApiProperty({ description: "Contact person name" })
  @Column()
  contactName: string;

  @ApiProperty({ description: "Contact email" })
  @Column()
  contactEmail: string;

  @ApiProperty({ description: "Contact phone number" })
  @Column()
  contactPhone: string;

  @ApiProperty({ description: "Business sector" })
  @Column({ nullable: true })
  sector: string;

  @ApiProperty({ description: "Number of branches" })
  @Column({ type: "int", nullable: true })
  branchCount: number;

  @ApiProperty({ description: "Requested start date" })
  @Column({ nullable: true })
  startDate: string;

  @ApiProperty({ description: "Type of courier service needed" })
  @Column({ nullable: true })
  courierType: string;

  @ApiProperty({ description: "Number of couriers needed" })
  @Column({ type: "int", nullable: true })
  courierCount: number;

  @ApiProperty({ description: "Service city" })
  @Column()
  city: string;

  @ApiProperty({ description: "Service district" })
  @Column()
  district: string;

  @ApiProperty({ description: "Company address" })
  @Column({ type: "text", nullable: true })
  address: string;

  @ApiProperty({ description: "Additional notes" })
  @Column({ type: "text", nullable: true })
  additionalNotes: string;

  @ApiProperty({ description: "Service request status" })
  @Column({ default: "pending" })
  status: string;

  @ApiProperty({ description: "Unique identifier" })
  @Column({ nullable: true, unique: true })
  uid: string;

  @ApiProperty({ description: "Creation date" })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: "Last update date" })
  @UpdateDateColumn()
  updatedAt: Date;
}
