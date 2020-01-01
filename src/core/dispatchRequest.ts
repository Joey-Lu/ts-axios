import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../type'
import xhr from './xhr'
import { buildURL, isAbsolutePath, combineURL } from '../helper/url'
import { transformRequest, transformResponse } from '../helper/data'
import { processHeaders, flattenHeaders } from '../helper/headers'
import transform from './transform'
import Axios from './Axios'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  //TODO
  throwIfCancelRequsted(config)
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformUrl(config: AxiosRequestConfig): string {
  let { url, param, paramSerializer,baseURL } = config
  if(baseURL && !isAbsolutePath(url!)){
    url = combineURL(baseURL,url)
  }
  return buildURL(url!, param, paramSerializer)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancelRequsted(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
