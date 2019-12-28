import { AxiosRequestConfig, AxiosStatic } from "./type";
import Axios from "./core/Axios";
import { extend } from "./helper/utils";
import defaults from "./default";
import mergeConfig from "./core/mergeConfig";
import CancelToken from "./cancel/CancelToken";
import Cancel,{isCancel} from "./cancel/Cancel";

function createInstance(config:AxiosRequestConfig):AxiosStatic{
    const context = new Axios(config)
    const instance  = Axios.prototype.request.bind(context) 

    extend(instance,context)

    return instance as AxiosStatic;
}

const axios = createInstance(defaults);

axios.create = function(config){
    return createInstance(mergeConfig(defaults,config))
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

export default axios;