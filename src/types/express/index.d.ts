import type { AuthUser } from "../../modules/auth/auth.type";

import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}
