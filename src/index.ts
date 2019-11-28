import {AxiosRequestConfig,AxisoPromise, AxiosResponse} from './type';
import xhr from './xhr';
import {buildURL} from './helper/url';
import { transformRequest, transformResponse } from "./helper/data";
import { processHeaders} from './helper/header';

function axios(config:AxiosRequestConfig):AxisoPromise{
    //TODO
    processConfig(config);
    return xhr(config).then(res => {
       return transformResponseData(res); 
    });
}

function processConfig(config:AxiosRequestConfig):void{
    config.url = transformUrl(config);
    config.headers = transformHeaders(config);
    config.data = transformRequestData(config);
}

function transformUrl(config:AxiosRequestConfig):string{
    const {url, param} = config;
    return buildURL(url,param);
}

function transformRequestData(config:AxiosRequestConfig):any{
    return transformRequest(config.data);
}

function transformHeaders(config:AxiosRequestConfig):any{
    const {headers ={},data} = config;
    return processHeaders(headers,data);
}

function transformResponseData(res:AxiosResponse):AxiosResponse{
    res.data = transformResponse(res.data);
    return res;
}

export default axios;