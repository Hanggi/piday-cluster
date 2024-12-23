"use client";

import axios from "axios";

import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";

import { useState } from "react";

export default function TestButtons() {
  const [userUid, setUserUid] = useState("");

  return (
    <div>
      <div className="py-8">
        <Input
          onChange={(event) => {
            setUserUid(event.target.value);
          }}
        />
        <Button
          onClick={async () => {
            const apiUrl = "https://api.minepi.com/v2/payments";
            const appSecret = process.env.PI_APP_SECRET; // 在环境变量中存储你的 App Secret

            try {
              const response = await axios.post(
                apiUrl,
                {
                  amount: 0.01, // 支付金额
                  memo: "Test U2A payment", // 支付备注
                  metadata: {
                    amount: 0.01,
                  }, // 自定义元数据
                  uid: userUid, // 接收支付的用户 UID
                },
                {
                  headers: {
                    Authorization: `Key zpzupknil4d3v9okfdvxoj1lyfnwvthuko4vb97ecfy4dd9dkjzckqpldjfi4jqo`,
                  },
                },
              );
              console.log("Payment initiated:", response.data);
              return response.data;
            } catch (error: any) {
              alert(JSON.stringify(error));
              throw error;
            }
          }}
        >
          A2U Payment
        </Button>

        <Button
          onClick={async () => {
            const payment = await window.Pi.createPayment({
              amount: 0.001,
              memo: "Test Payment",
              metadata: {
                amount: 0.001,
              },
              uid: userUid, // 接收支付的用户 UID
            });
          }}
        ></Button>
      </div>
    </div>
  );
}
