import Head from 'next/head'
import axios from 'axios';
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

export default function Home() {
  const [status, setStatus] = useState(false);

  const router = useRouter()
  const { code, scope } = router.query

  const SLACK_AUTH_URL = `https://www.strava.com/oauth/authorize?client_id=44322&response_type=code&redirect_uri=${process.env.WEB_URL}&approval_prompt=force&scope=activity:read_all,activity:read`;

  useEffect(() => {
    if (code) {
      setStatus('authorizing');
      // Check scopes of auth return
      if(scope.indexOf('read,activity:read') > -1) {
        // Exchange token for long lasting token
        axios.get('/api/strava-auth', { params: { code } })
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
    }
  }, [code, router, scope])


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
      <a href={SLACK_AUTH_URL}>
        Auth strava
      </a>

      {status && <p>status: { status }</p>}

    </div>
  )
}
