import {
  AxiosPromise,
  AxiosRequestConfig,
  Method,
  AxiosResponse,
  ResolvedFn,
  RejectedFn
} from '../type'
import dispatchRequest, { transformUrl } from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

export default class Axios {
  interceptors: Interceptors
  defaults: AxiosRequestConfig

  constructor(initCofig: AxiosRequestConfig) {
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
    this.defaults = initCofig
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    mergeConfig(this.defaults, config)

    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('get', url, config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('delete', url, config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('head', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('post', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('patch', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithData('put', url, data, config)
  }

  getUri(config?:AxiosRequestConfig):string{
    config = mergeConfig(this.defaults,config)
    return transformUrl(config);
  }

  _requestWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return dispatchRequest(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }

  _requestWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return dispatchRequest(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}
