fetch('https://myblog-test-apims-euw-01.azure-api.net/api/v1.0/HttpTrigger', {
  method: 'GET',
  headers: {'ocp-apim-subscription-key': 'e61d13780ee34ed89c7f6f2c552fcb8d',
            'content-type': 'application/json'
    }
}).then(response => {
  console.log('RAW Response:', response);
  return response.json();
}).then(data => {
  console.log('JSON Response:', data)
})
;
