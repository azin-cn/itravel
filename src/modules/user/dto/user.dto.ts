export class UserCreateDTO {
  readonly username: string;
  readonly password: string;
  readonly description: string;
}

export class UserEditDTO {
  readonly username: string;
  readonly password: string;
  readonly description: string;
}