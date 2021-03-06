import { isDate, isPlainObject, isUrlSearchParams } from './utils'

interface URLOrigin {
  protocol: string
  host: string
}

export function isAbsolutePath(url:string):boolean{
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

export function combineURL(baseURL:string,relative?:string):string{
  return relative ? baseURL.replace(/\/+$/,'') + '/'+ relative.replace(/^\/+/,''): baseURL
}

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(
  url: string,
  params: any,
  paramSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }

  let serializedParams

  if (paramSerializer) {
    serializedParams = paramSerializer(params)
  } else if (isUrlSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []

    Object.keys(params).forEach(key => {
      const val = params[key]
      if (val == null) {
        return
      }

      let values = []
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }

      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })
    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    const hashIndex = url.indexOf('#')
    if (hashIndex !== -1) {
      url = url.slice(0, hashIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '') + serializedParams
  }
  return url
}

export function isURLSameOrigin(requestURL: string): boolean {
  const pastOrigin = resolveURL(requestURL)
  return currentOrigin.protocol === pastOrigin.protocol && pastOrigin.host === currentOrigin.host
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

//get protocol and host by creating an a tag
function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}
