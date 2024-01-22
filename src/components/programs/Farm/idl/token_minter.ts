export type TokenMinter = {
    "version": "0.1.0",
    "name": "token_minter",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "minterAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "maxBalance",
            "type": "u64"
          }
        ]
      },
      {
        "name": "setMaxBalance",
        "accounts": [
          {
            "name": "minterAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "newMaxBalance",
            "type": "u64"
          }
        ]
      },
      {
        "name": "mint",
        "accounts": [
          {
            "name": "minterAccount",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "destination",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "minterData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "maxBalance",
              "type": "u64"
            },
            {
              "name": "authority",
              "type": "publicKey"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "OverTheLimit",
        "msg": "User already has enough tokens"
      }
    ]
  };
  
  export const IDL: TokenMinter = {
    "version": "0.1.0",
    "name": "token_minter",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "minterAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "maxBalance",
            "type": "u64"
          }
        ]
      },
      {
        "name": "setMaxBalance",
        "accounts": [
          {
            "name": "minterAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "newMaxBalance",
            "type": "u64"
          }
        ]
      },
      {
        "name": "mint",
        "accounts": [
          {
            "name": "minterAccount",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "destination",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "minterData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "maxBalance",
              "type": "u64"
            },
            {
              "name": "authority",
              "type": "publicKey"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "OverTheLimit",
        "msg": "User already has enough tokens"
      }
    ]
  };
  