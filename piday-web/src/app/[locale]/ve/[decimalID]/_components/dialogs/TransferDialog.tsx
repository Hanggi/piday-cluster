"use client";

import { NumericFormatAdapter } from "@/src/components/numeric-format/NumericFormatAdapter";
import ConfirmDialog from "@/src/components/piday-ui/confirm-dialog/ConfirmDialog";
import { useSuccessToast } from "@/src/features/rtk-utils/use-error-toast.hook";
import { useLazyGetUserInfoQuery } from "@/src/features/user/api/userAPI";
import { useTransferVirtualEstateToUserMutation } from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { debounce } from "lodash";

import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  hexID: string;
  onClose: () => void;
}

export default function TransferVirtualEstateDialog({
  open,
  hexID,
  onClose,
}: Props) {
  const { t } = useTranslation(["virtual-estate"]);

  const [userInput, setUserInput] = useState(""); // email, userID, piAddress

  const debouncedSearch = debounce((value: string) => {
    // setDebouncedValue(value);
    // 这里可以放置你的数据请求逻辑
    console.log("请求数据:", value);
  }, 500); // 500 毫秒的延迟

  // TODO: Remove this
  const [getUserInfoTrigger] = useLazyGetUserInfoQuery();

  const [trnasferVirtualEstateToUser, trnasferVirtualEstateToUserResponse] =
    useTransferVirtualEstateToUserMutation();

  // useEffect(() => {
  //   data?.id &&
  //     trnasferVirtualEstateToUser({
  //       hexID: "8c4243a5b5b69ff",
  //       receiverID: data.id,
  //     });
  // }, [data, trnasferVirtualEstateToUser]);

  return (
    <div>
      <ConfirmDialog
        open={open}
        title={t("virtual-estate:button.transfer")}
        onCancel={() => {
          onClose();
        }}
        onConfirm={() => {
          onClose();
        }}
      >
        <div className="mt-4">
          <div className="mb-2">
            <FormControl>
              <FormLabel>
                {t("virtual-estate:label.transferVirtualEstate")}:
              </FormLabel>
              <Input
                placeholder={t(
                  "virtual-estate:placeholder.transferVirtualEstatePlaceholder",
                )}
                slotProps={{
                  input: {
                    component: NumericFormatAdapter,
                  },
                }}
                onChange={(e) => {
                  setUserInput(e.target.value);
                  debouncedSearch(e.target.value);
                }}
              />
            </FormControl>
          </div>
        </div>
      </ConfirmDialog>
    </div>
  );
}
