import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const [error, setError] = useState(false);
  const { polyline } = router.query

  useEffect(() => {
    setError(false)
    // Update the document title using the browser API
    var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

    if(!polyline) {
      setError('No polyline')
      return;
    }

    var mapboxPolyline = require('@mapbox/polyline');
    // returns an array of lat, lon pairs
    const pairs = mapboxPolyline.toGeoJSON(polyline);
    // const pairs = polyline.toGeoJSON('vw}mEyuvy[Ok@OmA?UBGLEJA|AIVK^e@xCuClAcAVGzBHnBBPJLf@Th@f@d@d@Vd@@vD`@`@MZc@Ns@By@Eg@[_@}BOe@QsAq@QEs@Ac@McAiAo@yA_@i@MOK@OHGJGl@Q`AoAlC?ZL`@nA?b@Bl@JpB@FJNn@Rd@z@r@NF`@AdALpATd@?TMLQPi@D_@?u@I]GMa@We@G}@Gc@M}Aw@sAEc@Si@q@Yc@Yu@We@[_@IAOFGHMfAOx@oAdCAJDTA`@gCzBa@b@eBdBa@LqAF]?GEIOEk@Cu@BcANi@ZU^Sf@Mh@@ZTZf@^|@\\ZJBBAPO`BcBPW`@SfCPl@Gl@?^BPTTz@\\\\b@Z`@NX?x@JhBXP?VKVg@Fi@Bu@Ko@W[[GaAAg@KiAu@g@WqAAYOmA_Bg@aAiAyAWa@WW_@Qe@M_BWUIc@w@e@k@Qa@EUEgAOc@g@s@QIc@Ky@Gc@Je@`@KRSp@El@@NLj@T\\PN`@RPD`ABRAb@Kd@[To@Bu@Km@[o@e@a@]Im@Gg@?e@HWNMNUfACn@Jv@LN');

    const maxX = pairs.coordinates.reduce((acc, val) => (val[0] > acc || !acc) ? val[0] : acc, undefined)
    const minX = pairs.coordinates.reduce((acc, val) => (val[0] < acc || !acc) ? val[0] : acc, undefined)
    const maxY = pairs.coordinates.reduce((acc, val) => (val[1] > acc || !acc) ? val[1] : acc, undefined)
    const minY = pairs.coordinates.reduce((acc, val) => (val[1] < acc || !acc) ? val[1] : acc, undefined)

    // m = (x1+x2/2, y1+y2/2)
    const midpoint = [(minX+maxX)/2, (minY+maxY)/2];
    debugger;

    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FpbmhhbGwiLCJhIjoiY2tyYjY4bDB5MzR4cDMwdGNya3l2amVxOSJ9.FQ5rgpmZzrxZMB8ChU9ISQ';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [midpoint[0], midpoint[1]],
      zoom: 14.5,
      preserveDrawingBuffer: true,
    });
    map.on('load', function () {
      map.addSource('route', {
      'type': 'geojson',
      'data': {
      'type': 'Feature',
      'properties': {},
      'geometry': {
      'type': 'LineString',
      'coordinates': pairs.coordinates
      }
      }
      });
      map.addLayer({
      'id': 'route',
      'type': 'line',
      'source': 'route',
      'layout': {
      'line-join': 'round',
      'line-cap': 'round'
      },
      'paint': {
      'line-color': 'red',
      'line-width': 5
      }
      });
      // var content = map.getCanvas().toBlob();
      // console.log(content)
      window.mapboxLoaded = true;

      setTimeout(() => {
      }, 5000)
    });
  }, [polyline]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css' rel='stylesheet' />
      </Head>

      {error && <div>{error}</div>}
      <div id="map" />

    </div>
  )
}
