import { HttpException, HttpStatus } from "@nestjs/common";

export default function commonControllerErrorHandler(errorCode?: string): void {
  switch (errorCode) {
    case "NOT_ENOUGH_BALANCE":
      throw new HttpException(
        "Not enough balance",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
  }

  throw new HttpException(
    "Internal Server Error",
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
