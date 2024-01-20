export type SimpleCounter = {
    "version": "0.1.0",
    "name": "simple_counter",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "counterData",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": true
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
        "name": "increment",
        "accounts": [
          {
            "name": "counterData",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "setCounter",
        "accounts": [
          {
            "name": "counterData",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "newValue",
            "type": "u128"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "simpleCounterData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "data",
              "type": "u128"
            }
          ]
        }
      }
    ]
  };
  
  export const IDL: SimpleCounter = {
    "version": "0.1.0",
    "name": "simple_counter",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "counterData",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": true
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
        "name": "increment",
        "accounts": [
          {
            "name": "counterData",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "setCounter",
        "accounts": [
          {
            "name": "counterData",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "newValue",
            "type": "u128"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "simpleCounterData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "data",
              "type": "u128"
            }
          ]
        }
      }
    ]
  };
  