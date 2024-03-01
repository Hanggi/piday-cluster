"use client";

import Button from "@mui/joy/Button";

import Script from "next/script";

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
    // /* pass obtained data to backend */
    // await signInUser(authResponse);

    // /* use the obtained data however you want */
    // setUser(authResponse.user);
  };

  const onIncompletePaymentFound = (payment: PaymentDTO) => {
    console.log("onIncompletePaymentFound", payment);
    // return axiosClient.post("/incomplete", { payment }, config);
  };

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
                  onReadyForServerApproval: () => {
                    alert("onReadyForServerApproval");
                  },
                  onReadyForServerCompletion: () => {
                    alert("onReadyForServerCompletion");
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
