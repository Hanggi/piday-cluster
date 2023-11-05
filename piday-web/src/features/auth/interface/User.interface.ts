export interface User {
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  preferredUsername: string;
  sid: string;
  emailVerified: boolean;

  roles: string[];
}
