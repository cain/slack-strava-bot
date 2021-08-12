var axios = require('axios');
import { connectToDatabase } from '../util/mongodb';

interface StravaToken {
  _id: string;
  athlete_id: number;
  access_token: string;
  athlete: object;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

interface StravaActivity {
  _id: string;
  id: number;
  achievement_count: number;
  athlete: object
  athlete_count: number;
  available_zones: Array<any>;
  average_cadence: number;
  average_heartrate: number;
  average_speed: number;
  average_temp: number;
  best_efforts: Array<any>;
  calories: number;
  comment_count: number;
  commute: boolean;
  description: string;
  device_name: string;
  display_hide_heartrate_option: boolean;
  distance: number;
  elapsed_time: number;
  elev_high: number;
  elev_low: number;
  embed_token: string;
  end_latlng: Array<any>;
  external_id: string;
  flagged: boolean;
  from_accepted_tag: boolean;
  gear_id: null | string;
  has_heartrate: boolean;
  has_kudoed: boolean;
  heartrate_opt_out: boolean;
  hide_from_home: boolean;
  kudos_count: number;
  laps: Array<any>;
  location_city: null | string;
  location_country: null | string;
  location_state: null | string;
  manual: boolean;
  map?: string;
  max_heartrate: number;
  max_speed: number;
  moving_time: number;
  name: string;
  perceived_exertion: any;
  photo_count: number;
  photos: object;
  pr_count: number;
  prefer_perceived_exertion: any;
  private: boolean;
  resource_state: number;
  segment_efforts: Array<any>;
  similar_activities: object;
  splits_metric: Array<any>;
  splits_standard: Array<any>;
  start_date: string;
  start_date_local: string;
  start_latitude: number;
  start_latlng: Array<any>;
  start_longitude: number;
  stats_visibility: Array<any>;
  timezone: string;
  total_elevation_gain: number;
  total_photo_count: number;
  trainer: boolean;
  type: string;
  upload_id: number;
  upload_id_str: string;
  utc_offset: number;
  visibility: string;
  workout_type: null | string;
}

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
          .collection('tokens').updateOne(query, update, { upsert: true })

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
        .collection('tokens')
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