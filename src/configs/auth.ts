export default {
  meEndpoint: "/auth/me",
  loginEndpoint: "/jwt/login",
  registerEndpoint: "/jwt/register",
  storageTokenKeyName: "access_token",
  onTokenExpiration: "refresh_token", // logout | refreshToken
  userData: "user_data",
};
