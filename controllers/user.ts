import * as fs from "fs";
import { User } from "../models/User";

class UserManager {
  private filePath = "../database/user.json";
  private users: User[] = [];

  constructor() {
    this.loadUsers();
    }
    

  private loadUsers(): void {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, "utf-8");
      const userData = JSON.parse(data);
      this.users = userData.map((userObj: User) => {
        const user = new User(userObj.name, userObj.email, userObj.role);
        (user as any).id = userObj.id;
        return user;
      });

      if (this.users.length > 0) {
        const maxId = Math.max(...this.users.map((t) => t.id));
        User.SetNextID(maxId + 1);
      }
    }
  }
}
