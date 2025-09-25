// api/mint.js - NFT Mint Handler
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Show mint page
      const mintHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Mint NFT</title>
            
            <!-- Frame Meta Tags -->
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${process.env.VERCEL_URL || 'https://your-domain.vercel.app'}/api/mint/image" />
            <meta property="fc:frame:button:1" content="Mint NFT" />
            <meta property="fc:frame:button:2" content="Back to Frame" />
            <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL || 'https://your-domain.vercel.app'}/api/mint" />
            
            <style>
              body {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
              }
              .mint-container {
                background: #f0f0f0;
                padding: 30px;
                border-radius: 10px;
                margin: 20px 0;
              }
              .mint-button {
                background: #007bff;
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 5px;
                font-size: 18px;
                cursor: pointer;
                margin: 10px;
              }
              .mint-button:hover {
                background: #0056b3;
              }
            </style>
          </head>
          <body>
            <h1>🎨 Mint Your NFT</h1>
            <div class="mint-container">
              <p>Ready to mint your exclusive NFT?</p>
              <p>This will create a unique digital collectible for you.</p>
              <button class="mint-button" onclick="mintNFT()">Mint Now</button>
            </div>
            
            <script>
              function mintNFT() {
                alert('Minting feature will be implemented with smart contract integration');
                // Here you would integrate with your NFT contract
              }
            </script>
          </body>
        </html>
      `;
      
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(mintHtml);
      
    } else if (req.method === 'POST') {
      // Handle mint request from frame
      const { untrustedData, trustedData } = req.body;
      
      console.log('Mint request:', { untrustedData, trustedData });
      
      // Get user's FID (Farcaster ID) from trustedData if available
      const userFid = trustedData?.messageBytes ? 'authenticated' : 'anonymous';
      const buttonId = untrustedData?.buttonIndex || 1;
      
      if (buttonId === 1) {
        // Mint button pressed
        try {
          // Here you would implement actual minting logic
          // For now, we'll simulate a successful mint
          const mintResult = await simulateMint(userFid);
          
          const successHtml = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta property="fc:frame" content="vNext" />
                <meta property="fc:frame:image" content="${process.env.VERCEL_URL || 'https://your-domain.vercel.app'}/api/mint/success" />
                <meta property="fc:frame:button:1" content="View NFT" />
                <meta property="fc:frame:button:2" content="Mint Another" />
                <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL || 'https://your-domain.vercel.app'}/api/mint" />
              </head>
              <body>
                <h1>🎉 Mint Successful!</h1>
                <p>Your NFT has been minted successfully!</p>
                <p>Token ID: ${mintResult.tokenId}</p>
                <p>Transaction: ${mintResult.txHash}</p>
              </body>
            </html>
          `;
          
          res.setHeader('Content-Type', 'text/html');
          res.status(200).send(successHtml);
          
        } catch (mintError) {
          console.error('Mint error:', mintError);
          
          const errorHtml = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta property="fc:frame" content="vNext" />
                <meta property="fc:frame:image" content="${process.env.VERCEL_URL || 'https://your-domain.vercel.app'}/api/mint/error" />
                <meta property="fc:frame:button:1" content="Try Again" />
                <meta property="fc:frame:button:2" content="Back" />
                <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL || 'https://your-domain.vercel.app'}/api/mint" />
              </head>
              <body>
                <h1>❌ Mint Failed</h1>
                <p>Sorry, there was an error minting your NFT.</p>
                <p>Please try again later.</p>
              </body>
            </html>
          `;
          
          res.setHeader('Content-Type', 'text/html');
          res.status(200).send(errorHtml);
        }
        
      } else if (buttonId === 2) {
        // Back to frame
        res.redirect(302, '/api/frame');
      }
      
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('Mint handler error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Simulate minting process (replace with actual smart contract interaction)
async function simulateMint(userFid) {
  // Simulate async minting process
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    tokenId: Math.floor(Math.random() * 10000) + 1,
    txHash: '0x' + Math.random().toString(16).substr(2, 40),
    userFid: userFid,
    timestamp: new Date().toISOString()
  };
}

// Example function for real smart contract integration
async function mintNFT(userAddress, metadata) {
  // This is where you'd integrate with your smart contract
  // Example using ethers.js:
  /*
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.mint(userAddress, metadata);
  const receipt = await tx.wait();
  return {
    tokenId: receipt.events[0].args.tokenId,
    txHash: receipt.transactionHash
  };
  */
  
  throw new Error('Smart contract integration not implemented');
}
