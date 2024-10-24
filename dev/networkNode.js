const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const axiosRequest = require("axios");
const uuid = require("uuid").v1; 
const port = process.argv[2];

const nodeAddress = uuid().split("-").join("");
const frw = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

// get entire blockchain
app.get('/blockchain', function (req, res) {
	res.send(frw);

});
// create a new transaction
app.post('/transaction', function(req, res){
  const newTransaction = req.body ;
  const blockIndex = frw.addTransactionToPendingTransactions(newTransaction);
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });

});

// broadcast transaction
app.post('/transaction/broadcast', function(req, res) {
   const newTransaction = frw.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
   frw.addTransactionToPendingTransactions(newTransaction); 
     const regNodesPromises = [];
   frw.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/transaction',
      method: 'POST',
      body: JSON.stringify(newTransaction),
      headers: { 'Content-Type': 'application/json' }
    
    };
      regNodesPromises.push(fetch( requestOptions.uri, requestOptions));
   });

   Promise.all(regNodesPromises)
   .then(data => {
    res.json({ note: 'Transaction created and broadcast successfully.'})
   });
});
// mine a block
app.get('/mine', function(req, res){
	const lastBlock = frw.getLastBlock();
	const previousBlockHash = lastBlock['hash']; 
	const currentBlockData = {
		transactions: frw.pendingTransactions,
		index: lastBlock['index'] + 1
	};
	const nonce = frw.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = frw.hashBlock(previousBlockHash, currentBlockData, nonce);
	const newBlock = frw.createNewBlock(nonce, previousBlockHash, blockHash);

  const regNodePromises = [];
  frw.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
     
      uri: networkNodeUrl + '/receive-new-block',
      method: 'POST',
      body: JSON.stringify({newBlock: newBlock}),
      headers: { 'Content-Type': 'application/json' }

    };
     regNodePromises.push( fetch(requestOptions.uri, requestOptions));
  });
  Promise.all(regNodePromises)
  .then(data => {
    const requestOptions = {

      uri: frw.currentNodeUrl + '/transaction/broadcast',
      method: 'POST',
      body: JSON.stringify({
            amount: 12.5,
            sender: "10.0.2.21",
            recipient: "10.0.2.14"


      }),
      headers: { 'Content-Type': 'application/json' }
    };
    return fetch(requestOptions.uri, requestOptions);
  })
  .then(data => {
    res.json({
    note: 'New block mined & broadcast successfully',
    block: newBlock

    });

  });
	
});

app.post('/receive-new-block', function (req, res) {
  const newBlock = req.body.newBlock;
  const lastBlock = frw.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

  if(correctHash && correctIndex) {
    frw.chain.push(newBlock);
    frw.pendingTransactions = [];
    res.json({
      note:'New block received and accepted.',
      newBlock: newBlock

    });
  } else {
    res.json({
      note: 'New block rejected.',
      newBlock: newBlock

    });
  }
});

//register a node and broadcast it the network
app.post('/register-and-broadcast-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl
 
  if (frw.networkNodes.indexOf(newNodeUrl) == -1) {
    frw.networkNodes.push(newNodeUrl)
  }
  const regNodePromises = [];
  frw.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: JSON.stringify({ newNodeUrl: newNodeUrl}),
      headers: { 'Content-Type': 'application/json' }
      
    };

//Push fetch promises to the array with uri as fetch first parameter by accessing requestOptions, and requestOptions itself as the fetch options
    regNodePromises.push(fetch(requestOptions.uri, requestOptions))
  })
 
  Promise.all(regNodePromises)
    .then((data) => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: 'POST',
        body:JSON.stringify({allNetworkNodes: [...frw.networkNodes, frw.currentNodeUrl]
      }),
        
        headers: { 'Content-Type': 'application/json' }
        
      }
//return fetch with uri as first parameter by accessing bulkRegisterOptions, and bulkRegisterOptions itself as the fetch options
      return fetch(bulkRegisterOptions.uri, bulkRegisterOptions)
    })
    .then((data) => {
      res.json({
        Note: `New node registered with network successfully.`
      })
    })
})
 
// Register a new node on the network
app.post('/register-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl
  const nodeNotAlreadyPresent = frw.networkNodes.indexOf(newNodeUrl) == -1
  const notCurrentNode = frw.currentNodeUrl !== newNodeUrl
  if (nodeNotAlreadyPresent && notCurrentNode) {
    frw.networkNodes.push(newNodeUrl)
    res.json({ note: 'New node registered successfully.' })
  } else {
    res.json({ Note: 'Node already exist' })
  }
})
 
//Register multiple nodes on the network
app.post('/register-nodes-bulk', function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes
  allNetworkNodes.forEach((networkNodeUrl) => {
    const nodeNotAlreadyPresent =
      frw.networkNodes.indexOf(networkNodeUrl) === -1
 
    const notCurrentNode = frw.currentNodeUrl !== networkNodeUrl
 
    if (nodeNotAlreadyPresent && notCurrentNode)
      frw.networkNodes.push(networkNodeUrl)
  })
  res.json({ Note: 'Bulk Registration Successful' })
});


//   consensus old
// app.get('/consensus', async function(req, res) {
//   const regNodePromises = [];
//
//   frw.networkNodes.forEach(networkNodeUrl => {
//     const requestOptions = {
//
//       uri: networkNodeUrl + '/blockchain',
//
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' }
//     };
//
//     regNodePromises.push(fetch(requestOptions.uri, requestOptions));
//   });
//
//   Promise.all(regNodePromises)
//
//   .then(blockchains => {
//
//     const currentChainLength = frw.chain.length;
//     let maxChainLength = currentChainLength;
//     let newLongestChain = null;
//     let newPendingTransactions = null;
//
//     blockchains.forEach(blockchain => {
//         if (blockchain.length > maxChainLength) {
//             maxChainLength = blockchain.length;
//             newLongestChain = blockchain.chain;
//             newPendingTransactions = blockchain.pendingTransactions;
//         }
//     });
//
//    for (const networkNodeUrl of frw.networkNodes){
//     const blockchain =  axiosRequest.get(networkNodeUrl + '/blockchain').blockchains
//     regNodePromises.push(blockchain);
// }
//     if (!newLongestChain || (newLongestChain && !frw.chainIsValid(newLongestChain))) {
//       res.json({
//         note: 'Current chain has not been replaced.',
//         chain: frw.length
//       })
//     }
//     else {
//       frw.chain = newLongestChain;
//       frw.pendingTransactions = newPendingTransactions;
//       res.json({
//         note: 'This chain has been replaced.',
//         chain: frw.length
//       });
//
//     }
//   });
//
// });

//   consensus new
app.get('/consensus', async function(req, res) {
  const requestPromises = [];

  frw.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/blockchain',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    requestPromises.push(fetch(requestOptions.uri, requestOptions).then(response => response.json()));
  });

  Promise.all(requestPromises)
      .then(blockchains => {

        const currentChainLength = frw.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;

        blockchains.forEach(blockchain => {
          if (blockchain.chain.length > maxChainLength) {
            maxChainLength = blockchain.chain.length;
            newLongestChain = blockchain.chain;
            newPendingTransactions = blockchain.pendingTransactions;
          }
        });

        if (!newLongestChain || (newLongestChain && !frw.chainIsValid(newLongestChain))) {
          res.json({
            note: 'Current chain has not been replaced.',
            chain: frw.chain
          });
        } else {
          frw.chain = newLongestChain;
          frw.pendingTransactions = newPendingTransactions;
          res.json({
            note: 'This chain has been replaced.',
            chain: frw.chain
          });
        }
      });
});

// localhost: 3001/block/ hash of block
app.get('/block/:blockHash', function(req, res) {
  const blockHash = req.params.blockHash;
  const correctBlock = frw.getBlock(blockHash);
  res.json({
    block: correctBlock
  });
});


app.get('/transaction/:transactionId', function(req, res) {
  const transactionId = req.params.transactionId;
  const transactionData = frw.getTransaction(transactionId);
  res.json({
    transaction: transactionData.transaction,
    block: transactionData.block
  });
});


app.get('/address/:address', function(req, res) {
  const address = req.params.address;
  const addressData = frw.getAddressData(address);
  res.json({
    addressData: addressData
  });
});

app.get('/block-explorer', function(req, res) {
  res.sendFile('./block-explorer/index.html', { root: __dirname });
});

app.listen(port, function(){
 	console.log(`Listening on port ${port}...`);

});
