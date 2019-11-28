import { AxiosRequestConfig, AxisoPromise, AxiosResponse } from './type'
import {parseHeaders} from './helper/headers'

export default function xhr(config: AxiosRequestConfig): AxisoPromise {
  return new Promise((resolve, reject) => {
    const { method = 'get', data = null, param, url, headers,responseType,timeout } = config

    const request = new XMLHttpRequest()

    if(responseType){
        request.responseType = responseType;
    }

    if(timeout){
      request.timeout = timeout;
    }

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = function handleLoad(){
        if(request.readyState !== 4){
            return 
        }

        if(request.status === 0){
          return 
        }

        const requestHeaders = parseHeaders(request.getAllResponseHeaders());
        const requestData  = responseType === 'text' ? request.response:request.responseText
        const response:AxiosResponse = {
            data:requestData,
            status:request.status,
            statusText:request.statusText,
            headers:requestHeaders,
            config,
            request
        }
        handleResponse(response)
    };

    request.onerror = function handleError(){
      reject(new Error('Network error'))
    }

    request.ontimeout = function handleTimeout(){
      reject(new Error(`Timeout of ${timeout} ms exceed`));
    }

    Object.keys(headers).forEach(name => {
      if (data == null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      }
      request.setRequestHeader(name, headers[name])
    })

    request.send(data)

    function handleResponse(response:AxiosResponse):void{
        if(response.status>=200 && response.status<300){
          resolve(response);
        }else{
          reject(new Error(`Request failed with status code ${response.status}`))
        }
    }

  })
}