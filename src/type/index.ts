export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  param?: any
  headers?: any
  responseType?:XMLHttpRequestResponseType,
  time?:number
}

export interface AxiosResponse {
    data:any
    status:number
    statusText:string
    headers:any
    config:AxiosRequestConfig
    request:any
}

export interface AxisoPromise extends Promise<AxiosResponse>{
    
}