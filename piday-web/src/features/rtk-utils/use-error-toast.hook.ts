// import { SerializedError } from "@reduxjs/toolkit";
// import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import { toast } from "react-toastify";

export function useErrorToast(
  error: any,
  // FetchBaseQueryError | SerializedError | undefined,
  optional?: { message: string },
) {
  useEffect(() => {
    console.log("error", error);
    if (error) {
      toast.error(`${optional?.message || error?.message || error}`);
    }
  }, [error, optional, optional?.message]);
}

export function useSuccessToast(
  isSuccess: boolean,
  message: string,
  callback?: () => void,
) {
  useEffect(() => {
    if (isSuccess) {
      toast.success(message);
      callback && callback();
    }
    // ignore callback changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, message]);
}
