import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsDateString,
} from "class-validator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: "Full name is required" })
  fullName!: string;

  @IsDateString({}, { message: "Birth date must be a valid date (YYYY-MM-DD)" })
  @IsNotEmpty({ message: "Birth date is required" })
  birthDate!: string;

  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters" })
  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}
