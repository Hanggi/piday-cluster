export interface User {
  email: string;
  name: string;
  username: string;
  givenName: string;
  familyName: string;
  preferredUsername: string;
  sid: string;
  emailVerified: boolean;

  roles: string[];
}
