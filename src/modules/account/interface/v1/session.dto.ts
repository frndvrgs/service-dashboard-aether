import { IsEmail, IsString, IsOptional } from "class-validator";

export class CreateSessionInput {
  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  password?: string;
}
