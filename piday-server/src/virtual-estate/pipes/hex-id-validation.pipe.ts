import * as h3 from "h3-js";

import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class HexIdValidationPipe implements PipeTransform {
  transform(value: any): any {
    if (!h3.h3IsValid(value) || h3.h3GetResolution(value) !== 12) {
      console.error("Invalid Hex ID: ", value);
      throw new BadRequestException("Invalid Hex ID");
    }
    return value;
  }
}
