import { AxiosRequestConfig } from '../type'
import { isPlainObject, deepCopy } from '../helper/utils';

const strategy = Object.create(null)

const strategyKeysFromVal2 = ['url','params','data'];
const strategyKeysDeepMerge = ['headers','auth']; 

strategyKeysFromVal2.forEach(key => {
    strategy[key] = fromVal2;
})

strategyKeysDeepMerge.forEach(key => {
    strategy[key] = deepMerge;
});

//default merge strategy return either val1 or val2
function defaultMerge(val1:any,val2:any):any{
    return typeof val2 !=='undefined' ? val2 :val1
}

function fromVal2(val1:any,val2:any):any{
    if(typeof val2 !== 'undefined'){
        return val2;
    }
}

function deepMerge(val1:any,val2:any):any{
    if(isPlainObject(val2)){
        return deepCopy(val1,val2)
    }else if(typeof val2 !== 'undefined'){
        return val2;
    }else if(isPlainObject(val1)){
        return deepCopy(val1)
    }else if(typeof val1 !=='undefined'){
        return val1
    }
}

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
    if(!config2){
        config2 = {};
    }

    const config = Object.create(null)

    for(let key in config2){
        mergeField(key);
    }

    for(let key in config1){
        if(!config2[key]){
            mergeField(key);
        }
    }

    function mergeField(key:string):void{
        const stra = strategy[key] || defaultMerge
        config[key] = stra(config1[key],config2![key])
    }  
    
    return config;
}


