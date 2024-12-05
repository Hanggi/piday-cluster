import {
  useGetBalanceQuery,
  useTransferBalanceMutation,
} from "@/src/features/account/api/accountAPI";
import { useLazyGetUserInfoQuery } from "@/src/features/user/api/userAPI";
import { myUserValue } from "@/src/features/user/user-slice";
import { debounce } from "lodash";

import Button from "@mui/joy/Button";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TransferBalanceModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const myUser = useSelector(myUserValue);
  useEffect(() => {
    if (myUser && !myUser.isPaymentPasswordSet) {
      toast.warn("请先设置支付密码!");
    }
  }, [myUser]);

  const [paymentPassword, setPaymentPassword] = useState("");

  const { data: balance } = useGetBalanceQuery({});

  const [transferBalance, transferBalanceResult] = useTransferBalanceMutation();

  const [amount, setAmount] = useState(0);
  const [transferTo, setTransferTo] = useState(""); // email, userID, piAddress
  const [getUserInfoTrigger, { data: userInfo, isLoading: userInfoIsLoading }] =
    useLazyGetUserInfoQuery();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const piWalletRegex = /^[A-Z0-9]{56}$/; // 假设格式

      if (uuidRegex.test(value.trim())) {
        getUserInfoTrigger({ userID: value });
        return "UUID";
      } else if (emailRegex.test(value.trim())) {
        getUserInfoTrigger({ email: value });
        return "Email";
      } else if (piWalletRegex.test(value.trim())) {
        getUserInfoTrigger({ walletAddress: value });
        return "PI Wallet Address";
      } else {
        return "Unknown Format";
      }
    }, 500),
    [],
  );
  const handleInputChange = useCallback(
    (value: string) => {
      setTransferTo(value);

      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleSubmit = useCallback(() => {
    if (amount <= 0) {
      toast.error("转账金额必须大于0");
      return;
    }

    transferBalance({
      amount,
      to: transferTo.trim(),
      paymentPassword,
    });
  }, [amount, paymentPassword, transferBalance, transferTo]);

  useEffect(() => {
    if (transferBalanceResult.isSuccess) {
      transferBalanceResult.reset();
      onSuccess?.();
      toast.success("转账成功");
      onClose();
    }
  }, [
    onClose,
    onSuccess,
    transferBalanceResult,
    transferBalanceResult.isSuccess,
  ]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <ModalClose />

        <DialogTitle>转账</DialogTitle>
        <DialogContent>
          <FormControl className="mb-4">
            <FormLabel>转账地址</FormLabel>
            <Input
              placeholder="请输入转账地址"
              onChange={(e) => {
                handleInputChange(e.target.value);
              }}
            />
          </FormControl>

          <FormControl className="mb-4">
            <FormLabel>转账金额</FormLabel>
            <Input
              endDecorator={
                <div>
                  <Typography>余额: {balance || 0}</Typography>
                </div>
              }
              placeholder="请输入转账金额"
              type="number"
              value={amount}
              onChange={(e) => {
                if (+e.target.value >= 0) {
                  setAmount(+e.target.value);
                }
              }}
            />
          </FormControl>

          {myUser?.isPaymentPasswordSet ? (
            <FormControl className="mb-4">
              <FormLabel>支付密码</FormLabel>
              <Input
                placeholder="请输入支付密码"
                type="password"
                value={paymentPassword}
                onChange={(e) => {
                  setPaymentPassword(e.target.value);
                }}
              />
            </FormControl>
          ) : (
            <div></div>
          )}

          <div className="mt-4">
            <Button
              disabled={
                transferBalanceResult.isLoading ||
                amount <= 0 ||
                amount > balance ||
                !transferTo
              }
              onClick={handleSubmit}
            >
              转账
            </Button>
          </div>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}
