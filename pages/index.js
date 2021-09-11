import Head from 'next/head'
import axios from 'axios';
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { connectToDatabase } from '../util/mongodb'
import { useRouter } from 'next/router'

export default function Home({ isConnected, activities }) {
  const [status, setStatus] = useState(false);

  const router = useRouter()
  const { code, scope, state } = router.query

  const STRAVA_AUTH_URL = `https://www.strava.com/oauth/authorize?client_id=44322&response_type=code&redirect_uri=${process.env.WEB_URL}?&approval_prompt=force&scope=activity:read_all,activity:read&state=strava`;
  const SLACK_AUTH_URL = `https://slack.com/oauth/v2/authorize?client_id=955952242691.2269147690049&scope=channels:read,chat:write,chat:write.public,commands&user_scope=&state=slack`;

  useEffect(() => {
    if (state === 'strava' && code) {
      setStatus('authorizing');
      // Check scopes of auth return
      if(scope.indexOf('read,activity:read') > -1) {
        // Exchange token for long lasting token
        axios.get('/api/strava/auth', { params: { code } })
          .then(() => {
            setStatus('success');
            router.replace('/');
          })
          .catch(() => {
            setStatus('fail');
            router.replace('/');
          })
      } else {
        setStatus('invalid-scope');
      }
    } else if(state === 'slack' && code) {
      setStatus('authorizing');
      axios.get('/api/slack/auth', { params: { code } })
        .then(() => {
          setStatus('success');
          router.replace('/');
        })
        .catch(() => {
          setStatus('fail');
          router.replace('/');
        })
    }
  }, [code, router, scope, state])


  return (
    <div className={styles.container}>
      <Head>
        <title>Strava bot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      Strava bot 🏃
      <br />
      <br />
      <br />
      <a href={STRAVA_AUTH_URL}>
        Auth strava
      </a>
      <a href={SLACK_AUTH_URL}>
        <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
      </a>

      {status && <p>status: { status }</p>}
      <br />
      <br />
      <br />
      {activities && activities.map((x, i) => <div key={i}>Name: {x.name}, Distance: {x.distance}, Start: {x.start_date}</div>)}

    </div>
  )
}

export async function getServerSideProps(context) {
  const { client } = await connectToDatabase()
  // console.log(client)
  const cursor = await client.db("strava-bot").collection('activity').find({});
  const allValues = await cursor.toArray();
  await cursor.close();

  const isConnected = true;

  return {
    props: { activities: allValues.map((x) => {
    delete x._id;
    return x;
  }) },
  }
}