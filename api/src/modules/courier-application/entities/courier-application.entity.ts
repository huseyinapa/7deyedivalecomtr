import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "courier_application" })
export class CourierApplication {
  @ApiProperty({ description: "Unique identifier" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ description: "Application UID" })
  @Column({ nullable: true })
  uid: string;

  @ApiProperty({ description: "First name" })
  @Column()
  firstName: string;

  @ApiProperty({ description: "Last name" })
  @Column()
  lastName: string;

  @ApiProperty({ description: "Email address" })
  @Column()
  email: string;

  @ApiProperty({ description: "Phone number" })
  @Column()
  phone: string;

  @ApiProperty({ description: "City" })
  @Column()
  city: string;

  @ApiProperty({ description: "District" })
  @Column({ nullable: true })
  district: string;

  @ApiProperty({ description: "Address" })
  @Column({ type: "text", nullable: true })
  address: string;

  @ApiProperty({ description: "Birth date" })
  @Column({ nullable: true })
  birthDate: string;

  @ApiProperty({ description: "Gender" })
  @Column({ nullable: true })
  gender: string;

  @ApiProperty({ description: "Nationality" })
  @Column({ nullable: true })
  nationality: string;

  @ApiProperty({ description: "ID Number" })
  @Column({ nullable: true })
  idNumber: string;

  @ApiProperty({ description: "Marital status" })
  @Column({ nullable: true })
  maritalStatus: string;

  @ApiProperty({ description: "Military status" })
  @Column({ nullable: true })
  militaryStatus: string;

  @ApiProperty({ description: "Education level" })
  @Column({ nullable: true })
  education: string;

  @ApiProperty({ description: "License class" })
  @Column({ nullable: true })
  licenseClass: string;

  @ApiProperty({ description: "Vehicle type" })
  @Column({ nullable: true })
  vehicleType: string;

  @ApiProperty({ description: "Work period" })
  @Column({ nullable: true })
  workPeriod: string;

  @ApiProperty({ description: "Has vehicle" })
  @Column({ type: "boolean", default: false })
  hasVehicle: boolean;

  @ApiProperty({ description: "Courier experience" })
  @Column({ type: "text", nullable: true })
  courierExperience: string;

  @ApiProperty({ description: "Work experiences" })
  @Column({ type: "text", nullable: true })
  workExperiences: string;

  @ApiProperty({ description: "References" })
  @Column({ type: "text", nullable: true })
  references: string;

  @ApiProperty({ description: "Application status" })
  @Column({ default: "pending" })
  status: string;

  @ApiProperty({ description: "Additional notes" })
  @Column({ type: "text", nullable: true })
  notes: string;

  @ApiProperty({ description: "Creation date" })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: "Last update date" })
  @UpdateDateColumn()
  updatedAt: Date;
}
