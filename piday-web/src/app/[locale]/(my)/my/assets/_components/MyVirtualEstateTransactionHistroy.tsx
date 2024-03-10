"use client";

import { useGetAllTransactionRecordsForUserQuery } from "@/src/features/virtual-estate-transaction-record/api/virtualEstateTransactionRecordAPI";
import { format } from "date-fns";

import Card from "@mui/joy/Card";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import { useTranslation } from "react-i18next";

interface Props {}

export function MyVirtualEstateTransactionHistroy({}: Props) {
  const { t } = useTranslation(["asset-center"]);

  const { data: transactionRecords } = useGetAllTransactionRecordsForUserQuery({
    side: "both",
  });

  return (
    <div className="">
      <Card size="lg">
        <Table hoverRow noWrap stripe="even">
          <thead>
            <tr>
              <th>ID</th>
              <th>
                <Typography level="title-md">
                  {t("asset-center:table.transactionID")}
                </Typography>
              </th>
              <th>
                <Typography level="title-md">
                  {t("asset-center:table.hashValue")}
                </Typography>
              </th>
              <th>
                <Typography level="title-md">
                  {t("asset-center:table.amount")}
                </Typography>
              </th>
              <th>
                <Typography level="title-md">
                  {t("asset-center:table.createdAt")}
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {transactionRecords?.map((record, i) => (
              <tr key={i}>
                <td>
                  <Typography>{i + 1}</Typography>
                </td>
                <td>
                  <Typography>{record?.transactionID}</Typography>
                </td>
                <td>
                  <Typography>{record?.virtualEstateID}</Typography>
                </td>
                <td>
                  <Typography>{record?.price}</Typography>
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
      </Card>
    </div>
  );
}
