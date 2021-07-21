var axios = require('axios');

export async function exchangeToken(code) {
  return new Promise((res, rej) => {
    var config = {
      method: 'post',
      url: 'https://www.strava.com/oauth/token',
      data: {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_SECRET,
        code,
        grant_type: 'authorization_code',
      }
    };
    
    axios(config)
      .then(function (response) {
        console.log('RESPONSE', JSON.stringify(response.data));
        res(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error.data.errors);
        rej(error);
      });
  })
}

export async function getActivity() {
  return new Promise((res, rej) => {
    var config = {
      method: 'get',
      url: 'https://www.strava.com/api/v3/activities/5651244361?include_all_efforts=',
      headers: { 
        'Authorization': 'Bearer 5c027849983ae85412c5589e8d6b689af1b528e8'
      }
    };
    
    axios(config)
      .then(function (response) {
        console.log('RESPONSE', JSON.stringify(response.data));
        res(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
        rej(error);
      });
  })
}