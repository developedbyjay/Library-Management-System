import { Role, UserData } from "../helpers/types";

export class User {
  static IDcounter: number = 1;
  id: number;
  name: string;
  email: string;
  role: Role;

  constructor(data: UserData) {
    this.id = User.IDcounter++;
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
