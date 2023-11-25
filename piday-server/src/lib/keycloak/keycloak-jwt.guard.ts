import * as jwt from "jsonwebtoken";

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class KeycloakJwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log(request);
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false; // 没有提供 Authorization 头部
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      return false; // 格式不正确
    }

    const certs = await fetch(process.env.KEYCLOAK_CERTS_URL);
    const certsJson = await certs.json();

    const rs256Key = certsJson.keys.find(
      (key) => key.use === "sig" && key.alg === "RS256",
    );

    const secret = `-----BEGIN CERTIFICATE-----\n${rs256Key.x5c[0]}\n-----END CERTIFICATE-----`;

    try {
      const decoded = jwt.verify(token, secret);

      console.log("decoded: ", decoded);
      const userID = decoded.sub;

      request.user = {
        userID,
      };

      return true; // 验证成功
    } catch (error) {
      console.error(error);
      return false; // 验证失败
    }
  }
}
