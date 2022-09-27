import {useEffect, useState} from 'react'
import {useCurrentUser} from '../_exports/hooks'
import config from 'config:sanity' //gives you the entire config in v2

// If we want to use the useCurrentUser-hook, the telemetryclient should be turned into a hook. This code demonstrates that this can be done
// export const useFetch = ({event, metadata = {}}: TelemetryPayload) => {
//   const [data, setData] = useState()
//   const [error, setError] = useState()
//   const [loading, setLoading] = useState(false)
//   const PROXY_ENDPOINT = 'https://www.sanity.io/intake/dp/v1/track'
//   const sanityUserId = useCurrentUser()

//   /* eslint-disable no-process-env */
//   const disableTelemetry = process.env.SANITY_STUDIO_TELEMETRY //Can turn off the telemetry globally by setting an env variable called SANITY_STUDIO_TELEMETRY = 1.

//   console.log(disableTelemetry)

//   console.log(config)

//   useEffect(() => {
//     setLoading(true)
//     fetch(PROXY_ENDPOINT, {
//       method: 'POST', // or 'PUT'
//       headers: {
//         authorization: 'Basic MXBiSk5jRUpIV09lM0R2ZFB5SXA3WERJQ0o0Og==',
//       },
//       body: JSON.stringify({
//         userId: sanityUserId,
//         event: 'studio-telemetry',
//         properties: {
//           eventAction: event,
//           ...metadata,
//         },
//         context: {
//           // ip: '14.5.67.21',
//           library: {
//             name: 'http',
//           },
//         },
//         timestamp: new Date().toISOString(),
//       }),
//     })
//       .then((response) => response.json())
//       .then(setData)
//       .catch(setError)
//       .finally(() => setLoading(false))
//   }, [event, metadata])

//   return {data, error, loading}
// }

interface TelemetryPayload {
  event: TELEMETRY_EVENT
  metadata?: Record<string, string>
}

export enum TELEMETRY_EVENT {
  DOCUMENT_PUBLISHED = 'documentPublished',
  BUTTON_CLICK = 'buttonClick',
  //DOCUMENT_DELETED = 'documentDeleted',
  //PERFORMANCE_XXXX = 'performanceWhatever',
}

// In the future we might have a separate one for telemetry
// const PROXY_ENDPOINT = 'https://telemetry.sanity.io/event'
const PROXY_ENDPOINT = 'https://www.sanity.io/intake/dp/v1/track'

// Get from session
const sanityUserId = 'xxx'

const getPayload = ({event, metadata = {}}: TelemetryPayload) =>
  JSON.stringify({
    userId: sanityUserId,
    event: 'studio-telemetry',
    properties: {
      eventAction: event,
      ...metadata,
    },
    context: {
      // ip: '14.5.67.21',
      library: {
        name: 'http',
      },
    },
    timestamp: new Date().toISOString(),
  })

const disableTelemetry = process.env.SANITY_STUDIO_TELEMETRY //Can turn off the telemetry globally by setting an env variable called SANITY_STUDIO_TELEMETRY=1.
export const telemetryClient = ({event, metadata}: TelemetryPayload) => {
  if (disableTelemetry !== '1') {
    //If you set the env variable to 1, you will turn the tracking off. Anything else, and this fetch will run
    fetch(PROXY_ENDPOINT, {
      method: 'POST', // or 'PUT'
      headers: {
        authorization: 'Basic MXBiSk5jRUpIV09lM0R2ZFB5SXA3WERJQ0o0Og==',
      },
      body: getPayload({event, metadata}),
    })
  }
}

// export const telemetryClient = ({event, metadata}: TelemetryPayload) => {
//   console.log(config)
//   fetch(PROXY_ENDPOINT, {
//     method: 'POST', // or 'PUT'
//     headers: {
//       authorization: 'Basic MXBiSk5jRUpIV09lM0R2ZFB5SXA3WERJQ0o0Og==',
//     },
//     body: getPayload({event, metadata}),
//   })
// }

// export const telemetryClient = ({event, metadata}: TelemetryPayload) => {
//   const blob = new Blob([getPayload({event, metadata})], headers)
//   navigator.sendBeacon(PROXY_ENDPOINT, blob)
// }

// telemetryClient({
//   event: TELEMETRY_EVENT.DOCUMENT_PUBLISHED,
//   metadata: {
//     name: 'publishButton',
//   },
// })

// telemetryClient({
//   event: TELEMETRY_EVENT.PERFORMANCE_XXXX,
//     metadata: {
//         measured: 1.2
//     }
// })

// telemetryClient({
//   event: TELEMETRY_EVENT.ERROR_
//     metadata: {
//         errorMessage: 'errror message'
//         stackTrace,
//     }
// })

/*
Payload from Hello Sanity - should remove unnecessary bits
{
  "channel": "web",
  "context": {
    "app": {
      "build": "1.0.0",
      "name": "RudderLabs JavaScript SDK",
      "namespace": "com.rudderlabs.javascript",
      "version": "2.3.2"
    },
    "traits": {},
    "library": { "name": "RudderLabs JavaScript SDK", "version": "2.3.2" },
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
    "os": { "name": "", "version": "" },
    "locale": "nb-NO",
    "screen": {
      "density": 2,
      "width": 1792,
      "height": 1120,
      "innerWidth": 782,
      "innerHeight": 1016
    },
    "campaign": {},
  },
  "type": "track",
  "messageId": "74bea455-ddb0-4383-96f3-a64e81085d77",
  "originalTimestamp": "2022-09-15T09:47:08.349Z",
  "anonymousId": "2c572a9a-a634-41d3-aafd-fb2401166fe3",
  "userId": "",
  "event": "studio-telemetry",
  "properties": { "eventAction": "Setup: Auth select screen" },
  "integrations": { "All": true },
  "sentAt": "2022-09-15T09:47:08.350Z"
}

*/
