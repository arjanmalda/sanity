import {createBrowserHistory, createMemoryHistory, History} from 'history'
import {Observable} from 'rxjs'
import {share} from 'rxjs/operators'
import {isRecord} from '../../../util/isRecord'
import {LocationInterceptor, LocationEvent} from './types'
import {ActionFunctor, createAction} from './utils/action'

export interface LocationStore {
  event$: Observable<LocationEvent>
  intercept: (i: LocationInterceptor) => void
  navigate: ActionFunctor<{path: string; replace?: boolean}>
}

const noop = () => undefined

const createHistory = () =>
  typeof document === 'undefined' ? createMemoryHistory() : createBrowserHistory()

interface LocationStoreOptions {
  history?: History
}

export function createLocationStore({
  history = createHistory(),
}: LocationStoreOptions = {}): LocationStore {
  const interceptors: LocationInterceptor[] = []

  function readLocation() {
    return new URL(document.location.href)
  }

  const locationChange$ = new Observable<LocationEvent>((observer) => {
    return history.listen(() =>
      observer.next({
        type: 'change',
        location: readLocation(),
      })
    )
  }).pipe(share())

  const event$ = new Observable<LocationEvent>((observer) => {
    const subscription = locationChange$.subscribe(observer)

    observer.next({
      type: 'snapshot',
      location: readLocation(),
    })

    return subscription
  })

  const navigate = createAction(
    'navigate',
    function navigate(opts: {
      path: string
      replace?: boolean
    }): {progress: Observable<unknown>} | undefined {
      if (!isRecord(opts)) {
        throw new Error('navigation options must be an object')
      }

      const currentUrl = readLocation()

      if (interceptors.length > 0) {
        let cancelled = false

        const nextNavigation = {
          path: opts.path,
          cancel() {
            cancelled = true
          },
        }

        interceptors.some((interceptor) => {
          interceptor(nextNavigation)

          return !cancelled
        })

        if (cancelled) {
          return {progress: new Observable(noop)}
        }

        return undefined
      }

      // Make debug params sticky
      const debugParams = (currentUrl.hash || '')
        .substring(1)
        .split(';')
        .filter((param: string) => param.startsWith('_debug_'))

      const finalUrl = opts.path + (debugParams.length > 0 ? `#${debugParams.join(';')}` : '')

      if (opts?.replace) {
        history.replace(finalUrl)
      } else {
        history.push(finalUrl)
      }

      return {progress: new Observable(noop)}
    }
  )

  function intercept(interceptor: LocationInterceptor) {
    interceptors.push(interceptor)

    return () => {
      const idx = interceptors.indexOf(interceptor)

      if (idx > -1) {
        interceptors.splice(idx, 1)
      }
    }
  }

  return {event$, intercept, navigate}
}