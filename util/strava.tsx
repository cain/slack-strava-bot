var axios = require('axios');
import { connectToDatabase } from '../util/mongodb';
import { StravaToken, StravaActivity } from '../typscript/InterfaceStrava';


export async function exchangeToken(code: string) {
  return new Promise<StravaToken>((res, rej) => {
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

// Access tokens expire six hours after they are created, so they must be refreshed in order for an application to maintain access to a user’s resources.
// Every time you get a new access token, we return a new refresh token as well. If you need to make a request, we recommend checking to see if the short-lived access token has expired. If it has expired, request a new short-lived access token with the last received refresh token.
// https://developers.strava.com/docs/authentication/#refreshing-expired-access-tokens
export async function refreshToken(tokenObject) {
  return new Promise<StravaToken>((res, rej) => {
    const config = {
      method: 'post',
      url: 'https://www.strava.com/oauth/token',
      data: {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_SECRET,
        refresh_token: tokenObject.refresh_token,
        grant_type: 'refresh_token',
      }
    };
    
    axios(config)
      .then(async function (response: any) {
        const { data } = response;
        data.athlete_id = tokenObject.athlete_id;

        const { db } = await connectToDatabase();
        const query = { athlete_id: data.athlete_id };
        const update = { $set: data };
        await db
          .collection('strava-tokens').updateOne(query, update, { upsert: true })

        res(data);
      })
      .catch(function (error) {
        // console.log(error.response.data.errors);
        rej(error);
      });
  })
}


export async function getActivity(id: number, token: string) {
  return new Promise<StravaActivity>((res, rej) => {

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

export function getAthleteToken(athleteId: number) {
  return new Promise<StravaToken>(async(res, rej) => {
    try {

      if(!athleteId) {
        rej(new Error('Id not valid'));
        return;
      }
      const { db } = await connectToDatabase();

      let token = await db
        .collection('strava-tokens')
        .findOne({ athlete_id: Number(athleteId) });

      // refresh token
      if (token && new Date(token.expires_at * 1000).valueOf() < new Date().valueOf()) {
        token = await refreshToken(token);
      }
      
      res(token);
    } catch (error) {
      rej(error);
    }
  })
}