import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../type'
import { parseHeaders } from '../helper/headers'
import { createError } from '../helper/error'
import { isURLSameOrigin } from '../helper/url'
import { isFormData } from '../helper/utils'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      method = 'get',
      data = null,
      url,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownLoadProgress,
      onUpLoadProgress,
      auth,
      validateStatus,
    } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    configRequest();
    
    addEvents();

    processHeaders();

    processCancel();

    request.send(data)

    function configRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }

      if (timeout) {
        request.timeout = timeout
      }

      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    function addEvents(): void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }
        if (request.status === 0) {
          return
        }
        const requestHeaders = parseHeaders(request.getAllResponseHeaders())
        const requestData =
          responseType && responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: requestData,
          status: request.status,
          statusText: request.statusText,
          headers: requestHeaders,
          config,
          request
        }
        handleResponse(response)
      }
      request.onerror = function handleError() {
        reject(createError('Network error', config, null, request))
      }

      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceed`, config, 'ECONNABORTED', request))
      }

      if (onDownLoadProgress) {
        request.onprogress = onDownLoadProgress
      }

      if (onUpLoadProgress) {
        request.upload.onprogress = onUpLoadProgress
      }
    }

    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfVal = cookie.read(xsrfCookieName)
        if (xsrfVal && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfVal
        }
      }

      if(auth){
        headers['Authorization'] = 'Basic' + btoa(`${auth.username}:${auth.password}`)
      }

      Object.keys(headers).forEach(name => {
        if (data == null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        }
        request.setRequestHeader(name, headers[name])
      })
    }

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
