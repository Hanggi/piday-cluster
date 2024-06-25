export interface User {
  id: string;

  email: string;
  name: string;
  username: string;
  givenName: string;
  familyName: string;
  preferredUsername: string;
  sid: string;
  emailVerified: boolean;
  nationality?: string;
  piWalletAddress: string;
  piWalletAddressUpdatedAt?: string;

  inviterID?: string;

  roles: string[];

  createdAt: string;

  // relations
  balance?: number;
  vid?: string;

  // Additional fields
  isPaymentPasswordSet?: boolean;
}
