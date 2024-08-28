import { IsEmail } from "class-validator";

export class CreateSessionInput {
  @IsEmail()
  email!: string;
}
