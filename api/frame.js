// api/frame.js - Farcaster Frame Handler
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
      // Initial frame HTML
      const frameHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Farcaster Frame</title>
            
            <!-- Frame Meta Tags -->
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${process.env.VERCEL_URL || 'https://your-domain.vercel.app'}/api/frame/image" />
            <meta property="fc:frame:button:1" content="Click Me!" />
            <meta property="fc:frame:button:2" content="Mint NFT" />
            <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL || 'https://your-domain.vercel.app'}/api/frame" />
            
            <!-- Open Graph -->
            <meta property="og:title" content="My Farcaster Frame" />
            <meta property="og:description" content="Interactive Farcaster Frame" />
            <meta property="og:image" content="${process.env.VERCEL_URL || 'https://your-domain.vercel.app'}/api/frame/image" />
            
            <!-- Twitter Card -->
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="My Farcaster Frame" />
            <meta name="twitter:description" content="Interactive Farcaster Frame" />
            <meta name="twitter:image" content="${process.env.VERCEL_URL || 'https://your-domain.vercel.app'}/api/frame/image" />
          </head>
          <body>
            <h1>Farcaster Frame</h1>
            <p>This is a Farcaster Frame. View it in a Farcaster client to interact with it.</p>
          </body>
        </html>
      `;
      
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(frameHtml);
      
    } else if (req.method === 'POST') {
      // Handle frame interaction
      const { untrustedData, trustedData } = req.body;
      
      console.log('Frame interaction:', { untrustedData, trustedData });
      
      // Get button pressed
      const buttonId = untrustedData?.buttonIndex || 1;
      
      let responseHtml;
      
      if (buttonId === 1) {
        // Button 1 pressed - Show success message
        responseHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${process.env.VERCEL_URL || 'https://your-domain.vercel.app'}/api/frame/success" />
              <meta property="fc:frame:button:1" content="Back" />
              <meta property="fc:frame:button:2" content="Share" />
              <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL || 'https://your-domain.vercel.app'}/api/frame" />
            </head>
            <body>
              <h1>Success!</h1>
              <p>You clicked the button!</p>
            </body>
          </html>
        `;
      } else if (buttonId === 2) {
        // Button 2 pressed - Redirect to mint
        responseHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta property="fc:frame" content="vNext" />
              <meta property="fc:frame:image" content="${process.env.VERCEL_URL || 'https://your-domain.vercel.app'}/api/frame/mint-image" />
              <meta property="fc:frame:button:1" content="Mint Now" />
              <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL || 'https://your-domain.vercel.app'}/api/mint" />
            </head>
            <body>
              <h1>Ready to Mint!</h1>
              <p>Click Mint Now to proceed</p>
            </body>
          </html>
        `;
      }
      
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(responseHtml);
      
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('Frame handler error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
