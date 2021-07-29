var axios = require('axios');

export async function exchangeToken(code) {
  return new Promise((res, rej) => {
    const config = {
      method: 'post',
      url: 'https://www.strava.com/oauth/token',
      data: {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_SECRET,
        code,
        grant_type: 'authorization_code',
      }
    };

    /*
    *
    expires_at
      integer	The number of seconds since the epoch when the provided access token will expire
    expires_in
      integer	Seconds until the short-lived access token will expire
    refresh_token
      string	The refresh token for this user, to be used to get the next access token for this user. Please expect that this value can change anytime you retrieve a new access token. Once a new refresh token code has been returned, the older code will no longer work.
    athlete
      string	A summary of athlete information
    */
    
    axios(config)
      .then(function (response) {
        // console.log('RESPONSE', JSON.stringify(response.data));
        res(response.data);
      })
      .catch(function (error) {
        // console.log(error.response.data.errors);
        rej(error);
      });
  })
}

export async function getActivity(id: number, token: string) {
  return new Promise((res, rej) => {

    if(!id || !token) {
      rej(new Error('Id or token not valid'));
      return;
    }

    var config = {
      method: 'get',
      url: `https://www.strava.com/api/v3/activities/${id}?include_all_efforts=`,
      headers: { 
        'Authorization': 'Bearer ' + token
      }
    };
    
    axios(config)
      .then(function (response) {
        // console.log('RESPONSE', JSON.stringify(response.data));
        res(response.data);
      })
      .catch(function (error) {
        // console.log(error);
        rej(error);
      });
  })
}