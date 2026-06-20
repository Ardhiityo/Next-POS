export type SignInState = {
  success: boolean;
  errors?: { [key: string]: string[] } | string;
};
