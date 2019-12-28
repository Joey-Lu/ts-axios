import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../type'
import xhr from './xhr'
import { buildURL } from '../helper/url'
import { transformRequest, transformResponse } from '../helper/data'
import { processHeaders, flattenHeaders } from '../helper/headers'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  //TODO
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

function transformUrl(config: AxiosRequestConfig): string {
  const { url, param } = config
  return buildURL(url!, param)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}
