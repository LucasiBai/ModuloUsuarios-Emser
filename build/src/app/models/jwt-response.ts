export interface JwtResponseInterface {
  token: string;
  'refresh-token': string;
  user: object;
  message: string;
}
