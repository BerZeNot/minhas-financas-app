import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL

const httpClient = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

class ApiService{

    constructor(apiUrl){
        this.apiUrl = apiUrl;
    }

    static registrarToken(token){
        if(token){
            httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
    }
    get(url){
        const requestURL = `${this.apiUrl}${url}`
        return httpClient.get(requestURL);
    }

    post(url, objeto){
        const requestURL = `${this.apiUrl}${url}`
        return httpClient.post(requestURL, objeto);
    }

    put(url, objeto){
        const requestURL = `${this.apiUrl}${url}`
        return httpClient.put(requestURL, objeto);
    }

    delete(url){
        const requestURL = `${this.apiUrl}${url}`
        return httpClient.delete(requestURL);
    }
}

export default ApiService;