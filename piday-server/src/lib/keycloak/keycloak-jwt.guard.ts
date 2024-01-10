import * as jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class KeycloakJwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false; // 没有提供 Authorization 头部
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      return false; // 格式不正确
    }
    // const certs = await fetch(process.env.KEYCLOAK_CERTS_URL);
    const client = jwksClient({
      jwksUri: process.env.KEYCLOAK_CERTS_URL,
    });

    console.log(client);
    function getKey(header, callback: jwt.SigningKeyCallback) {
      client.getSigningKey(header.kid, function (err, key: any) {
        console.log("key", key);
        const signingKey =
          key?.getPublicKey() || key?.publicKey || key?.rsaPublicKey;
        callback(null, signingKey);
      });
    }

    // const certsJson = await certs.json();
    // const rs256Key = certsJson.keys.find(
    //   (key) => key.use === "sig" && key.alg === "RS256",
    // );
    // const secret = `-----BEGIN CERTIFICATE-----\n${rs256Key.x5c[0]}\n-----END CERTIFICATE-----`;

    try {
      const decoded = await verifyToken(token, getKey);
      // const decoded = jwt.verify(token, secret);

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

function verifyToken(
  token: string,
  secretOrPublicKey: jwt.Secret | jwt.GetPublicKeyOrSecret,
  options?: jwt.VerifyOptions,
): Promise<jwt.JwtPayload | string> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, options, (err, decodedToken) => {
      if (err) {
        reject(err);
      } else {
        resolve(decodedToken);
      }
    });
  });
}
