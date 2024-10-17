// types.d.ts
import { userModel } from "../infrastructure/database/models/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: User; // Define the type for req.user, can also be `any` if you want flexibility
    }
  }
}
