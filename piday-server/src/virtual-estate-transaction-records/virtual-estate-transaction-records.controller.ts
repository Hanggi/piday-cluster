import { Controller } from "@nestjs/common";

import { VirtualEstateTransactionRecordsService } from "./virtual-estate-transaction-records.service";

@Controller("virtual-estate-transaction-records")
export class VirtualEstateTransactionRecordsController {
  constructor(
    private readonly virtualEstateTransactionRecordsService: VirtualEstateTransactionRecordsService,
  ) {}
}
