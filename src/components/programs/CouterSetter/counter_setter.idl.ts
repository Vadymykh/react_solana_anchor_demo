export type CounterSetter = {
    "version": "0.1.0",
    "name": "counter_setter",
    "instructions": [
      {
        "name": "setCounters",
        "accounts": [
          {
            "name": "simpleCounterProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "data",
            "type": "u128"
          }
        ]
      }
    ]
  };
  
  export const IDL: CounterSetter = {
    "version": "0.1.0",
    "name": "counter_setter",
    "instructions": [
      {
        "name": "setCounters",
        "accounts": [
          {
            "name": "simpleCounterProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "data",
            "type": "u128"
          }
        ]
      }
    ]
  };
  