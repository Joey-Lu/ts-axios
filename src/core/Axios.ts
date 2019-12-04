import { AxiosPromise, AxiosRequestConfig, Method } from '../type'
import dispatchRequest from './dispatchRequest'

export default class Axios {
  request(config: AxiosRequestConfig): AxiosPromise {
    return dispatchRequest(config)
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutMethod('get', url, config)
  }

  delete(url: string, config?:AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutMethod('delete', url, config)
  }

  _requestWithoutMethod(method: Method, url: string, config?: AxiosRequestConfig) {
    return dispatchRequest(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }
}
