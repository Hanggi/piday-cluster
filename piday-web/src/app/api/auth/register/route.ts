import { StatusCodes } from "http-status-codes";

export async function POST(request: Request, res: Response) {
  const req = await request.json();

  try {
    // 获取管理员访问令牌
    const tokenResponse = await fetch(
      `${process.env.KEYCLOAK_BASE_URL}/realms/piday/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_CLIENT_ID as string,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET as string,
          grant_type: "client_credentials",
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    const body = {
      username: req.username,
      email: req.email,
      enabled: true,
      // emailVerified: true,
      // firstName: req.username,
      // lastName: req.username,
      credentials: [
        {
          type: "password",
          value: req.password,
          temporary: false,
        },
      ],
    };

    // 使用管理员令牌创建新用户
    const createUserUrl = `${process.env.KEYCLOAK_BASE_URL}/admin/realms/piday/users`;
    const createUserResponse = await fetch(createUserUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      body: JSON.stringify(body),
    });

    if (createUserResponse.status === StatusCodes.CREATED) {
      const locationHeader = createUserResponse.headers.get("Location");
      if (locationHeader) {
        const userId = locationHeader.split("/").pop();
        const verifyEmailURL = `${process.env.KEYCLOAK_BASE_URL}/admin/realms/piday/users/${userId}/send-verify-email`;
        console.log(verifyEmailURL);
        const verifyRes = await fetch(verifyEmailURL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.access_token}`,
          },
          body: JSON.stringify(body),
        });
        console.log("verifyRes:", verifyRes);
      }
      return new Response(
        JSON.stringify({ message: "User registered successfully." }),
        {
          status: StatusCodes.OK,
        },
      );
    } else {
      // 处理创建用户时的错误
      const errorData = await createUserResponse.json();
      console.error("register:", errorData);
      return new Response(JSON.stringify("User registration failed"), {
        status: createUserResponse.status,
      });
    }
  } catch (error) {
    console.error("User registration failed!!", error);
    return new Response(JSON.stringify("User registration failed"), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
