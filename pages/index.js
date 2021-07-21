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
  }, [code])
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css' rel='stylesheet' />
      </Head>

      homepage

      <p>status: { status }</p>

    </div>
  )
}
