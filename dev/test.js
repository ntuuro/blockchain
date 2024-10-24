const Blockchain = require('./blockchain');

const frw = new Blockchain();

const bc1 = {
    "chain": [
        {
            "index": 1,
            "timestamp": 1729765391252,
            "transactions": [],
            "nonce": 100,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1729765397908,
            "transactions": [],
            "nonce": 18140,
            "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1729765723560,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "10.0.2.21",
                    "recipient": "10.0.2.14",
                    "transactionId": "fc646b0091f111ef80de23d9d502f463"
                },
                {
                    "amount": 10,
                    "sender": "FFKIURDEGYEGHJDJDGD85757",
                    "recipient": "57589IUOSFUIG854687445985",
                    "transactionId": "a157e56091f211ef80de23d9d502f463"
                },
                {
                    "amount": 20,
                    "sender": "FFKIURDEGYEGHJDJDGD85757",
                    "recipient": "57589IUOSFUIG854687445985",
                    "transactionId": "a618c8d091f211ef80de23d9d502f463"
                },
                {
                    "amount": 30,
                    "sender": "FFKIURDEGYEGHJDJDGD85757",
                    "recipient": "57589IUOSFUIG854687445985",
                    "transactionId": "aa9c552091f211ef80de23d9d502f463"
                }
            ],
            "nonce": 108834,
            "hash": "00009620ed70bf6d826f87fe54ade62138b30cfee02e0d23ce89696c8f583543",
            "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
        },
        {
            "index": 4,
            "timestamp": 1729765830974,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "10.0.2.21",
                    "recipient": "10.0.2.14",
                    "transactionId": "be7b27b091f211ef80de23d9d502f463"
                },
                {
                    "amount": 40,
                    "sender": "FFKIURDEGYEGHJDJDGD85757",
                    "recipient": "57589IUOSFUIG854687445985",
                    "transactionId": "ee98a8f091f211ef80de23d9d502f463"
                },
                {
                    "amount": 50,
                    "sender": "FFKIURDEGYEGHJDJDGD85757",
                    "recipient": "57589IUOSFUIG854687445985",
                    "transactionId": "f2fc031091f211ef80de23d9d502f463"
                },
                {
                    "amount": 60,
                    "sender": "FFKIURDEGYEGHJDJDGD85757",
                    "recipient": "57589IUOSFUIG854687445985",
                    "transactionId": "f5483d0091f211ef80de23d9d502f463"
                },
                {
                    "amount": 70,
                    "sender": "FFKIURDEGYEGHJDJDGD85757",
                    "recipient": "57589IUOSFUIG854687445985",
                    "transactionId": "fb8f4b4091f211ef80de23d9d502f463"
                }
            ],
            "nonce": 52347,
            "hash": "0000be9b1eaddbd3a49f2942548bcf269cee300cefadff293cd990be5c7d3b67",
            "previousBlockHash": "00009620ed70bf6d826f87fe54ade62138b30cfee02e0d23ce89696c8f583543"
        },
        {
            "index": 5,
            "timestamp": 1729765890425,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "10.0.2.21",
                    "recipient": "10.0.2.14",
                    "transactionId": "fe81893091f211ef80de23d9d502f463"
                }
            ],
            "nonce": 10126,
            "hash": "00009803e0f11d2d7ae5fe31c2bd4fb343433d8f9a649cb16feac26a22846642",
            "previousBlockHash": "0000be9b1eaddbd3a49f2942548bcf269cee300cefadff293cd990be5c7d3b67"
        },
        {
            "index": 6,
            "timestamp": 1729765892765,
            "transactions": [
                {
                    "amount": 12.5,
                    "sender": "10.0.2.21",
                    "recipient": "10.0.2.14",
                    "transactionId": "21f0e2d091f311ef80de23d9d502f463"
                }
            ],
            "nonce": 82602,
            "hash": "0000dbb2000e4d28626d9b908aacb6e2bcc9e62634bdfb580965054faaae3f17",
            "previousBlockHash": "00009803e0f11d2d7ae5fe31c2bd4fb343433d8f9a649cb16feac26a22846642"
        }
    ],
    "pendingTransactions": [
        {
            "amount": 12.5,
            "sender": "10.0.2.21",
            "recipient": "10.0.2.14",
            "transactionId": "2355a2f091f311ef80de23d9d502f463"
        }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
}


console.log('VALID: ', frw.chainIsValid(bc1.chain));

