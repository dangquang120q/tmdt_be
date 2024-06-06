module.exports = {
  ORDER_STATUS: [
    {
      id: 0,
      value: "All",
    },
    {
      id: 1,
      value: "Processing",
    },
    {
      id: 2,
      value: "Delivering",
    },
    {
      id: 3,
      value: "Completed",
    },
    {
      id: 4,
      value: "Cancelled",
    },
  ],
  WORKER_INPUTS: [
    {
      indexed: false,
      internalType: "string",
      name: "internalTx",
      type: "string",
    },
    {
      indexed: false,
      internalType: "address",
      name: "user",
      type: "address",
    },
    {
      indexed: false,
      internalType: "uint256",
      name: "amountIn",
      type: "uint256",
    },
    {
      indexed: false,
      internalType: "uint256",
      name: "amountOut",
      type: "uint256",
    },
    {
      indexed: false,
      internalType: "bytes",
      name: "userSignature",
      type: "bytes",
    },
  ],
};
