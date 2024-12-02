export type AuthResult = {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
};
