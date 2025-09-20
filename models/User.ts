import { Role, UserData } from "../helpers/types";

export class User {
  id: string;
  name: string;
  email: string;
  role: Role;

  constructor(data: UserData) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
  }

  toJSON(): UserData {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
}
