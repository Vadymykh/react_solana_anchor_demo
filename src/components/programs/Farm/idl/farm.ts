export type Farm = {
    "version": "0.1.0",
    "name": "farm",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "farmAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "stakeToken",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rewardToken",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "rewardsPerSecond",
            "type": "u64"
          }
        ]
      },
      {
        "name": "setRewardsPerSecond",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "farmAccount",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "rewardsPerSecond",
            "type": "u64"
          }
        ]
      },
      {
        "name": "initializeDeposit",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "depositAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmAccount",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "deposit",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "depositAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "token",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "stakeToken",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rewardToken",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userStakeTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmStakeTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userRewardTokenAccount",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "depositAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdraw",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "depositAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "token",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "stakeToken",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rewardToken",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userStakeTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmStakeTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userRewardTokenAccount",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "withdrawAmount",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "farmData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "rewardsPerSecond",
              "type": "u64"
            },
            {
              "name": "totalStaked",
              "type": "u64"
            },
            {
              "name": "lastRewardTimestamp",
              "type": "u64"
            },
            {
              "name": "accTokensPerStake",
              "type": "u128"
            },
            {
              "name": "stakeToken",
              "type": "publicKey"
            },
            {
              "name": "rewardToken",
              "type": "publicKey"
            },
            {
              "name": "authority",
              "type": "publicKey"
            }
          ]
        }
      },
      {
        "name": "depositData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "staked",
              "type": "u64"
            },
            {
              "name": "lastUpdateAccTokensPerStake",
              "type": "u128"
            }
          ]
        }
      }
    ],
    "events": [
      {
        "name": "DepositEvent",
        "fields": [
          {
            "name": "account",
            "type": "publicKey",
            "index": true
          },
          {
            "name": "depositAmount",
            "type": "u64",
            "index": false
          },
          {
            "name": "rewardsAmount",
            "type": "u64",
            "index": false
          }
        ]
      },
      {
        "name": "WithdrawalEvent",
        "fields": [
          {
            "name": "account",
            "type": "publicKey",
            "index": true
          },
          {
            "name": "withdrawAmount",
            "type": "u64",
            "index": false
          },
          {
            "name": "rewardsAmount",
            "type": "u64",
            "index": false
          }
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "NothingToDeposit",
        "msg": "Zero deposit amount"
      },
      {
        "code": 6001,
        "name": "AuthorityOnly",
        "msg": "Not an authority"
      },
      {
        "code": 6002,
        "name": "AlreadySet"
      }
    ]
  };
  
  export const IDL: Farm = {
    "version": "0.1.0",
    "name": "farm",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "farmAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "stakeToken",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rewardToken",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "rewardsPerSecond",
            "type": "u64"
          }
        ]
      },
      {
        "name": "setRewardsPerSecond",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "farmAccount",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "rewardsPerSecond",
            "type": "u64"
          }
        ]
      },
      {
        "name": "initializeDeposit",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "depositAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmAccount",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "deposit",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "depositAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "token",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "stakeToken",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rewardToken",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userStakeTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmStakeTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userRewardTokenAccount",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "depositAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdraw",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "depositAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "token",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "stakeToken",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rewardToken",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userStakeTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmStakeTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userRewardTokenAccount",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "withdrawAmount",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "farmData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "rewardsPerSecond",
              "type": "u64"
            },
            {
              "name": "totalStaked",
              "type": "u64"
            },
            {
              "name": "lastRewardTimestamp",
              "type": "u64"
            },
            {
              "name": "accTokensPerStake",
              "type": "u128"
            },
            {
              "name": "stakeToken",
              "type": "publicKey"
            },
            {
              "name": "rewardToken",
              "type": "publicKey"
            },
            {
              "name": "authority",
              "type": "publicKey"
            }
          ]
        }
      },
      {
        "name": "depositData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "staked",
              "type": "u64"
            },
            {
              "name": "lastUpdateAccTokensPerStake",
              "type": "u128"
            }
          ]
        }
      }
    ],
    "events": [
      {
        "name": "DepositEvent",
        "fields": [
          {
            "name": "account",
            "type": "publicKey",
            "index": true
          },
          {
            "name": "depositAmount",
            "type": "u64",
            "index": false
          },
          {
            "name": "rewardsAmount",
            "type": "u64",
            "index": false
          }
        ]
      },
      {
        "name": "WithdrawalEvent",
        "fields": [
          {
            "name": "account",
            "type": "publicKey",
            "index": true
          },
          {
            "name": "withdrawAmount",
            "type": "u64",
            "index": false
          },
          {
            "name": "rewardsAmount",
            "type": "u64",
            "index": false
          }
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "NothingToDeposit",
        "msg": "Zero deposit amount"
      },
      {
        "code": 6001,
        "name": "AuthorityOnly",
        "msg": "Not an authority"
      },
      {
        "code": 6002,
        "name": "AlreadySet"
      }
    ]
  };
  