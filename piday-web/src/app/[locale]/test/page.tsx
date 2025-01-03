"use client";

import axios from "axios";

import Button from "@mui/joy/Button";

import Script from "next/script";

import TestButtons from "./_component/TestButtons";

type Direction = "user_to_app" | "app_to_user";

type AppNetwork = "Pi Network" | "Pi Testnet";

type PaymentDTO = {
  // Payment data:
  identifier: string; // payment identifier
  user_uid: string; // user's app-specific ID
  amount: number; // payment amount
  memo: string; // a string provided by the developer, shown to the user
  metadata: Object; // an object provided by the developer for their own usage
  from_address: string; // sender address of the blockchain transaction
  to_address: string; // recipient address of the blockchain transaction
  direction: Direction; // direction of the payment
  created_at: string; // payment's creation timestamp
  network: AppNetwork; // a network of the payment

  // Status flags representing the current state of this payment
  status: {
    developer_approved: boolean; // Server-Side Approval
    transaction_verified: boolean; // blockchain transaction verified
    developer_completed: boolean; // server-Side Completion
    cancelled: boolean; // cancelled by the developer or by Pi Network
    user_cancelled: boolean; // cancelled by the user
  };

  // Blockchain transaction data:
  transaction: null | {
    // This is null if no transaction has been made yet
    txid: string; // id of the blockchain transaction
    verified: boolean; // true if the transaction matches the payment, false otherwise
    _link: string; // a link to the operation on the Blockchain API
  };
};

export default function TestPage() {
  const signIn = async () => {
    const scopes = ["username", "payments"];
    const authResponse = await window.Pi.authenticate(
      scopes,
      onIncompletePaymentFound,
    );

    console.log(authResponse);
    alert(JSON.stringify(authResponse));
    // /* pass obtained data to backend */
    // await signInUser(authResponse);

    // /* use the obtained data however you want */
    // setUser(authResponse.user);
  };

  const onIncompletePaymentFound = (payment: PaymentDTO) => {
    console.log("onIncompletePaymentFound", payment);
    // return axiosClient.post("/incomplete", { payment }, config);
  };

  // 执行检测函数
  checkCookieSupport();
  checkLocalStorageSupport();

  return (
    <div className="container">
      <div>test</div>

      <div className="py-4">
        <Button onClick={signIn}>Sign In</Button>
      </div>

      <div className="py-4">
        <Button
          onClick={async () => {
            try {
              const payment = await window.Pi.createPayment(
                {
                  amount: 0.001,
                  memo: "Test Payment",
                  metadata: {
                    amount: 0.001,
                  },
                },
                {
                  onReadyForServerApproval: async (paymentId: string) => {
                    alert("onReadyForServerApproval: " + paymentId);
                    try {
                      await axios.post(
                        "https://api.minepi.com/v2/payments/" +
                          paymentId +
                          "/approve",
                        {},
                        {
                          headers: {
                            Authorization:
                              "Key zpzupknil4d3v9okfdvxoj1lyfnwvthuko4vb97ecfy4dd9dkjzckqpldjfi4jqo",
                          },
                        },
                      );
                      alert("Approved");
                    } catch (error) {
                      alert(error);
                    }
                  },
                  onReadyForServerCompletion: async (
                    paymentId: string,
                    txid: string,
                  ) => {
                    alert("onReadyForServerCompletion");
                    try {
                      await axios.post(
                        "https://api.minepi.com/v2/payments/" +
                          paymentId +
                          "/complete",
                        { txid },
                        {
                          headers: {
                            Authorization:
                              "Key zpzupknil4d3v9okfdvxoj1lyfnwvthuko4vb97ecfy4dd9dkjzckqpldjfi4jqo",
                          },
                        },
                      );
                      alert("Approved");
                    } catch (error) {
                      alert(error);
                    }
                  },
                  onCancel: () => {
                    alert("onCancel");
                  },
                  onError: (error: any) => {
                    alert(error);
                  },
                },
              );
              console.log("payment", payment);
            } catch (error) {
              alert(error);
            }
          }}
        >
          Create Payment
        </Button>
      </div>

      <div className="py-8">
        <Button
          onClick={async () => {
            const res = await axios.get(
              "https://api.minepi.com/v2/payments/CRGWI0LdO0HcSfGTSW6iqg6NlyWo",

              {
                headers: {
                  Authorization:
                    "Key zpzupknil4d3v9okfdvxoj1lyfnwvthuko4vb97ecfy4dd9dkjzckqpldjfi4jqo",
                },
              },
            );
            console.log(res);
          }}
        >
          Check Order
        </Button>
      </div>

      <div className="py-8">
        <Button
          onClick={async () => {
            const res = await axios.post(
              "https://api.minepi.com/v2/payments/CRGWI0LdO0HcSfGTSW6iqg6NlyWo/complete",
              {
                txid: "7b23ab38196cff2ce9fb86a1adebefca50d23be3cf4f681dc240c0c03b534caf",
              },
              {
                headers: {
                  Authorization:
                    "Key zpzupknil4d3v9okfdvxoj1lyfnwvthuko4vb97ecfy4dd9dkjzckqpldjfi4jqo",
                },
              },
            );
            console.log(res);
          }}
        >
          Complete
        </Button>
      </div>

      <TestButtons />

      <Script
        src="https://sdk.minepi.com/pi-sdk.js"
        onLoad={() => {
          // @ts-ignore
          (Pi as any).init({ version: "2.0" });
        }}
      />
    </div>
  );
}
// 检测 Cookies 支持
function checkCookieSupport() {
  // 尝试创建一个 cookie
  document.cookie = "testcookie";
  let cookiesEnabled = document.cookie.indexOf("testcookie") !== -1;
  if (!cookiesEnabled) {
    // 如果 cookie 创建失败，显示警告
    alert("Your browser does not support cookies or they are disabled.");
  }
}

// 检测 localStorage 支持
function checkLocalStorageSupport() {
  try {
    // 尝试使用 localStorage
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    // 如果没有抛出错误，则支持 localStorage
  } catch (e) {
    // 如果有错误发生，表示不支持或已禁用 localStorage
    alert("Your browser does not support Local Storage or it is disabled.");
  }
}
