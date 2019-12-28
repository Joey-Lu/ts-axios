import { AxiosRequestConfig } from "./type";
import { processHeaders } from "./helper/headers";
import { transformRequest, transformResponse } from "./helper/data";

const defaults:AxiosRequestConfig = {
    method:'get',
    timeout:0,
    headers:{
        common:{
            Accept:'application/json,text/plain, */*'
        }        
    },

    transformResponse:[
        function(data:any,headers:any):any{
            processHeaders(data,headers);
            return transformRequest(data)
        }
    ],
    transformRequest:[
        function(data:any):any{
            return transformResponse(data);
        }
    ],
}

const methodsNoData = ['delete','get','head','options']

methodsNoData.forEach(m => {
    defaults.headers[m] = {}
});

const methodsWithData = ['post','put','patch']

methodsWithData.forEach(m=>{
    defaults.headers[m]={
        'Content-Type':'application/x-www-form-urlencoded',
    }
});

export default defaults;