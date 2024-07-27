import { useGetBalanceQuery } from "@/src/features/account/api/accountAPI";
import { useLazyGetUserInfoQuery } from "@/src/features/user/api/userAPI";
import { myUserValue } from "@/src/features/user/user-slice";
import { useCreateWithdrawRequestMutation } from "@/src/features/withdraw/api/withdrawAPI";
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

export default function WithdrawRequestModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const myUser = useSelector(myUserValue);
  useEffect(() => {
    if (myUser && !myUser.isPaymentPasswordSet) {
      toast.warn("请先设置支付密码");
    }
  }, [myUser]);

  const [paymentPassword, setPaymentPassword] = useState("");

  const { data: balance } = useGetBalanceQuery({});

  const [createWithdraw, createWithdrawResult] =
    useCreateWithdrawRequestMutation();

  const [amount, setAmount] = useState(0);

  const handleSubmit = useCallback(() => {
    if (amount <= 0) {
      toast.error("Amount can never be less than 0");
      return;
    }

    if (amount > balance) {
      toast.error("Not enough balance");
    }

    createWithdraw({ amount: JSON.stringify(amount), paymentPassword });
    setPaymentPassword("");
    setAmount(0);
  }, [amount, paymentPassword, createWithdraw]);

  useEffect(() => {
    if (createWithdrawResult.isSuccess) {
      createWithdrawResult.reset();
      onSuccess?.();
      toast.success("Withdraw request created successfully");
      onClose();
    }
  }, [
    onClose,
    onSuccess,
    createWithdrawResult,
    createWithdrawResult.isSuccess,
  ]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <ModalClose />

        <DialogTitle>Withdraw Balance</DialogTitle>
        <DialogContent>
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
                createWithdrawResult.isLoading ||
                amount <= 0 ||
                amount > balance ||
                !paymentPassword
              }
              onClick={handleSubmit}
            >
              Withdraw
            </Button>
          </div>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}
