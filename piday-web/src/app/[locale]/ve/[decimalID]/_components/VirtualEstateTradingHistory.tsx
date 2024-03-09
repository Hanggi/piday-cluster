"use client";

import { WrapperCard } from "@/src/components/WrapperCard";
import PiCoinLogo from "@/src/components/piday-ui/PiCoinLogo";
import { useGetVirtualEstateTransactionRecordsQuery } from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { cn } from "@/src/utils/cn";
import { format } from "date-fns";

import Table from "@mui/joy/Table";
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
      <Table className="mt-5" hoverRow noWrap stripe="odd">
        <thead>
          <tr>
            <th>
              <Typography>{t("virtual-estate:table.transactionID")}</Typography>
            </th>
            <th>
              <Typography>{t("virtual-estate:table.price")}</Typography>
            </th>
            <th>
              <Typography>{t("virtual-estate:table.user")}</Typography>
            </th>
            <th>
              <Typography>{t("virtual-estate:table.createdAt")}</Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {virtualEstateTransactionRecords?.map((record, idx) => (
            <tr key={idx}>
              <td>
                <Typography></Typography>
                {record.transactionID}
              </td>
              <td className="flex gap-2 items-center">
                <div className="w-6 h-6 relative">
                  <PiCoinLogo />
                </div>
                <Typography level="title-sm">{record.price}</Typography>
              </td>
              <td>
                <Typography>{record.buyer.username}</Typography>
              </td>
              <td>
                <Typography>
                  {format(new Date(record?.createdAt), "PPpp")}
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </WrapperCard>
  );
}
