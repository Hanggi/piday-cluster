export function getReason(reason: string): string {
  const reasonPairs = {
    TRANSFER_BALANCE: "RECEIVE_BALANCE",
    SELL_ASK: "BUY_BID",
    RECEIVE_BALANCE: "TRANSFER_BALANCE",
    BUY_BID: "SELL_ASK",
  };
  return reasonPairs[reason];
}

export function getWhereClause(record, externalID) {
  const commonWhere = {
    externalID: externalID,
    NOT: {
      ownerID: record.ownerID,
    },
  };

  if (
    ["BUY_BID", "SELL_ASK", "TRANSFER_BALANCE", "RECEIVE_BALANCE"].includes(
      record.reason,
    )
  ) {
    const reasonCheck = getReason(record.reason);
    return {
      ...commonWhere,
      reason: reasonCheck,
    };
  }

  return commonWhere;
}
