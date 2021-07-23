import Head from 'next/head'
import axios from 'axios';
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

export default function Home() {
  // const [authSuccess, setAuthSuccess] = useState(false);
  const [status, setStatus] = useState(false);

  const router = useRouter()
  const { code, scope } = router.query

  useEffect(() => {
    if (code) {
      setStatus('authorizing');
      if(scope.indexOf('read,activity:read') > -1) {
        axios.get('/api/strava-auth', { params: { code } })
          .then(() => {
            setStatus('success');
          })
          .catch(() => {
            setStatus('fail');
          })
      } else {
        setStatus('invalid-scope');
      }
    }
  }, [code, scope])


  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css' rel='stylesheet' />
      </Head>

      homepage

      <a href="https://www.strava.com/oauth/authorize?client_id=44322&response_type=code&redirect_uri=http://slack-strava-bot.vercel.app&approval_prompt=force&scope=activity:read_all,activity:read">Auth strava</a>

      <p>status: { status }</p>

    </div>
  )
}
