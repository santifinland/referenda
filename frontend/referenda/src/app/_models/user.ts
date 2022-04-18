export class User {
    username: string;
    token: string;
    origin: string;
    constructor(username, token, origin) {
      this.username = username;
      this.token = token;
      this.origin = origin;
    }
}
