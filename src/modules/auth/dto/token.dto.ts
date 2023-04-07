import { User } from 'src/entities/user.entity';

export class LoginResponseVO {
  constructor(private token?: string, private user?: Partial<User>) {}

  getToken() {
    return this.token;
  }
  setToken(token: string) {
    this.token = token;
  }

  getUser() {
    return this.user;
  }
  setUser(user: Partial<User>) {
    this.user = user;
  }
}
