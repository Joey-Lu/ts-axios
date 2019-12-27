import { AxiosInstance } from "./type";
import Axios from "./core/Axios";
import { extend } from "./helper/utils";

function createInstance():AxiosInstance{
    const context = new Axios()
    const instance  = Axios.prototype.request.bind(context) 

    extend(instance,context)

    return instance as AxiosInstance;
}

const axios = createInstance();

export default axios;