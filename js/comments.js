// Configuration
const APIM_ENDPOINT = 'https://myblog-test-apims-euw-01.azure-api.net/api/v1.0/HttpTrigger';
const APIM_SUBSCRIPTION_KEY = 'e61d13780ee34ed89c7f6f2c552fcb8d'; // Store this securely

// Main function to fetch data from Cosmos DB via APIM
async function debugCosmosRequest() {
    const startTime = performance.now();
    
    try {
      console.log('Starting request to:', APIM_ENDPOINT);
      
      const response = await fetch(APIM_ENDPOINT, {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': APIM_SUBSCRIPTION_KEY,
          'Content-Type': 'application/json',
          'X-Debug-Mode': 'true'
        }
      });
      
      console.log('Response');
      const latency = performance.now() - startTime;
      console.log(`Request completed in ${latency.toFixed(2)}ms`);
      console.log('Status:', response.status, response.statusText);
  
      const text = await response.text();
      console.log('Raw response:', text);
  
      if (!response.ok) {
        console.error('Response headers:', Object.fromEntries(response.headers.entries()));
        throw new Error(`HTTP ${response.status}`);
      }
  
      if (!text) {
        throw new Error('Empty response body');
      }
  
      try {
        const data = JSON.parse(text);
        console.log('Parsed JSON:', data);
        return data;
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        return text; // Return raw text if not JSON
      }
      
    } catch (error) {
      console.error('Full error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
  
  // Usage
  debugCosmosRequest().then(data => {
    console.log('Final data:', data);
    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
  });