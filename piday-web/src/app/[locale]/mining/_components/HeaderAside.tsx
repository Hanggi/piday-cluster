"use client";

import {
  useCheckInMutation,
  useGetMyPointInfoQuery,
  useGetMyPointQuery,
} from "@/src/features/point/api/pointAPI";

import { Button, CircularProgress } from "@mui/joy";

import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const HeaderAside = () => {
  const { t } = useTranslation("mining");

  const { data: myPoint, isLoading: isLoadingMyPoint } = useGetMyPointQuery();
  const { data: myPointInfo, isLoading: isLoadingMyPointInfo } =
    useGetMyPointInfoQuery();
  const [checkIn, checkInResult] = useCheckInMutation();

  const handleCheckIn = useCallback(() => {
    checkIn();
  }, [checkIn]);

  useEffect(() => {
    if (checkInResult.isSuccess) {
      toast.success("领取成功");
    }
  }, [checkInResult.isSuccess]);

  return (
    <aside className="min-w-[300px] aspect-square flex flex-col p-5 h-full bg-neutral-100 rounded-2xl">
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <h4 className="text-secondary text-6xl font-bold">
          {myPoint} {isLoadingMyPoint && <CircularProgress />}
        </h4>
        <p className="text-black/40">当前积分</p>
      </div>
      {/* <Modal
        Content={
          <>
            <Image
              alt="success"
              height={120}
              src={"/img/mining/receive-success.png"}
              width={130}
            />
            <p className="text-xl font-medium">领取成功</p>
          </>
        }
        className="flex flex-col gap-2 items-center min-h-[375px] justify-center"
      ></Modal> */}
      <Button
        className="w-full"
        disabled={isLoadingMyPointInfo || myPointInfo?.checkedInToday}
        onClick={handleCheckIn}
      >
        签到领积分
      </Button>
    </aside>
  );
};
