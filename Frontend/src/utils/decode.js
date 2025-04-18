import { jwtDecode } from "jwt-decode";

export function decodeJwt(token) {
  const decoded = jwtDecode(token);
  return decoded;
}