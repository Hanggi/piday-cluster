"use client";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  Table as TableRoot,
  TableRow,
} from "@/src/components/Table";
import { WrapperCard } from "@/src/components/WrapperCard";
import PiCoinLogo from "@/src/components/piday-ui/PiCoinLogo";
import { useGetVirtualEstateTransactionRecordsQuery } from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { cn } from "@/src/utils/cn";
import { format } from "date-fns";

import Typography from "@mui/joy/Typography";

import { useTranslation } from "react-i18next";

interface Props {
  hexID: string;
}

export function VirtualEstateTradingHisory({ hexID }: Props) {
  const { t } = useTranslation(["map", "virtual-estate"]);

  const { data: virtualEstateTransactionRecords } =
    useGetVirtualEstateTransactionRecordsQuery({ hexID, page: 1, size: 20 });

  return (
    <WrapperCard className={cn("w-full mb-6 container")}>
      <h4 className="text-xl font-semibold">{t("landHistory")}</h4>
      <TableRoot className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Typography>{t("virtual-estate:table.transactionID")}</Typography>
            </TableHead>
            <TableHead>
              <Typography>{t("virtual-estate:table.price")}</Typography>
            </TableHead>
            <TableHead>
              <Typography>{t("virtual-estate:table.user")}</Typography>
            </TableHead>
            <TableHead>
              <Typography>{t("virtual-estate:table.createdAt")}</Typography>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {virtualEstateTransactionRecords?.map((record, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Typography></Typography>
                {record.transactionID}
              </TableCell>
              <TableCell className="flex gap-2 items-center">
                <div className="w-6 h-6 relative">
                  <PiCoinLogo />
                </div>
                <Typography level="title-sm">{record.price}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{record.buyer.username}</Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  {format(new Date(record?.createdAt), "PPpp")}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </WrapperCard>
  );
}
