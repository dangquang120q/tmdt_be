module.exports = {
  BINANCE_API_URL: "https://api.binance.com/api/v3/klines",
  BTCUSDT_SYMBOL: "BTCUSDT",
  REDIS_URL: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  WHEEL_PERCENT_1: [
    {
      amount: "1000",
      weight: 30,
      pos: 0,
    },
    {
      amount: "2000",
      weight: 15,
      pos: 1,
    },
    {
      amount: "3000",
      weight: 10,
      pos: 2,
    },
    {
      amount: "5000",
      weight: 9,
      pos: 3,
    },
    {
      amount: "7000",
      weight: 8,
      pos: 4,
    },
    {
      amount: "8000",
      weight: 7,
      pos: 5,
    },
    {
      amount: "9000",
      weight: 6,
      pos: 6,
    },
    {
      amount: "10000",
      weight: 5,
      pos: 7,
    },
    {
      amount: "20000",
      weight: 4,
      pos: 8,
    },
    {
      amount: "30000",
      weight: 3,
      pos: 9,
    },
    {
      amount: "40000",
      weight: 2,
      pos: 10,
    },
    {
      amount: "50000",
      weight: 1,
      pos: 11,
    },
  ],
  WHEEL_PERCENT_2: [
    {
      amount: "300",
      weight: 30,
      pos: 0,
    },
    {
      amount: "600",
      weight: 15,
      pos: 1,
    },
    {
      amount: "900",
      weight: 10,
      pos: 2,
    },
    {
      amount: "1200",
      weight: 9,
      pos: 3,
    },
    {
      amount: "1500",
      weight: 8,
      pos: 4,
    },
    {
      amount: "1800",
      weight: 7,
      pos: 5,
    },
    {
      amount: "2100",
      weight: 6,
      pos: 6,
    },
    {
      amount: "2400",
      weight: 5,
      pos: 7,
    },
    {
      amount: "2700",
      weight: 4,
      pos: 8,
    },
    {
      amount: "3000",
      weight: 3,
      pos: 9,
    },
    {
      amount: "3300",
      weight: 2,
      pos: 10,
    },
    {
      amount: "3600",
      weight: 1,
      pos: 11,
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
  ROYAL_PASS_TYPE: [
    {
      goldEarn: 1666,
      eifhEarn: 1666,
      spinEarn: 1,
      type: "RPST",
    },
    {
      goldEarn: 3333,
      eifhEarn: 3333,
      spinEarn: 2,
      type: "RPBR",
    },
    {
      goldEarn: 10200,
      eifhEarn: 10000,
      spinEarn: 3,
      type: "RPSV",
    },
    {
      goldEarn: 17083,
      eifhEarn: 16666,
      spinEarn: 4,
      type: "RPGD",
    },
    {
      goldEarn: 35000,
      eifhEarn: 34000,
      spinEarn: 5,
      type: "RPPL",
    },
    {
      goldEarn: 55000,
      eifhEarn: 52000,
      spinEarn: 6,
      type: "RPDM",
    },
    {
      goldEarn: 76666,
      eifhEarn: 70666,
      spinEarn: 7,
      type: "RPSL",
    },
    {
      goldEarn: 130000,
      eifhEarn: 110000,
      spinEarn: 8,
      type: "RPCM",
    },
  ],
  EVENT_NFT_TYPE: [
    {
      goldEarn: 0,
      eifhEarn: 0,
      spinEarn: 2,
      type: "BEFT",
    },
    {
      goldEarn: 0,
      eifhEarn: 0,
      spinEarn: 3,
      type: "LCFT",
    }
  ],
  CHEST_TYPE: [
    {
      CHEST_PERCENT:[
          {
            amount: "Common",
            gold: 0,
            token: 0,
            weight: 4,
            type: 1
          },
          {
            amount: "Gold",
            gold: 2000,
            token: 0,
            weight: 80
          },
          {
            amount: "Token",
            gold: 0,
            token: 2000,
            weight: 16
          }
      ],
      type: "CCNFT"
    },
    {
      CHEST_PERCENT:[
        {
          amount: "Common",
          gold: 0,
          token: 0,
          weight: 95,
          type: 1
        },
        {
          amount: "Rare",
          gold: 0,
          token: 0,
          weight: 3,
          type: 2
        },
        {
          amount: "Elite",
          gold: 0,
          token: 0,
          weight: 2,
          type: 3
        }
      ],
      type: "RCNFT"
    },
    {
      CHEST_PERCENT:[
        {
          amount: "Common",
          gold: 0,
          token: 0,
          weight: 93,
          type: 1
        },
        {
          amount: "Rare",
          gold: 0,
          token: 0,
          weight: 5,
          type: 2
        },
        {
          amount: "Elite",
          gold: 0,
          token: 0,
          weight: 2,
          type: 3
        }
      ],
      type: "ECNFT"
    },
    {
      CHEST_PERCENT:[
        {
          amount: "Common",
          gold: 0,
          token: 0,
          weight: 93,
          type: 1
        },
        {
          amount: "Rare",
          gold: 0,
          token: 0,
          weight: 5,
          type: 2
        },
        {
          amount: "Elite",
          gold: 0,
          token: 0,
          weight: 2,
          type: 3
        }
      ],
      type: "VICECNFT"
    },
    {
      CHEST_PERCENT:[
        {
          amount: "Common",
          gold: 0,
          token: 0,
          weight: 90,
          type: 1
        },
        {
          amount: "Rare",
          gold: 0,
          token: 0,
          weight: 6,
          type: 2
        },
        {
          amount: "Elite",
          gold: 0,
          token: 0,
          weight: 3,
          type: 3
        },
        {
          amount: "Legendary",
          gold: 0,
          token: 0,
          weight: 1,
          type: 4
        }
      ],
      type: "LCNFT"
    }
  ],
  RANK_LEVEL: [100000, 200000, 300000, 400000],
  MILESTONE: [100000, 500000, 1000000, 2000000, 3000000],
  RedisConnected: 0
};
