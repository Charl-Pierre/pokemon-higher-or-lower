import axios from 'axios'


  /**
   * Create a wrapper that can be used to send post or get requests.
   * @param {string} url - The root url of the target.
   * @example
   * var wrapper = new AxiosWrapper();
   * wrapper.post('/', {name: Jeff}).
   *  then(() => console.log('success!')).catch(() => console.log('failure :(')))
   */
export default class AxiosWrapper {
  client: any;
  api_token: any;
  api_url: string;
  
  constructor(url: string) {
    this.api_token = null;
    this.client = null;
    this.api_url = url
  }
  init = () => {

    // Create headers
    var contentType = 'application/json';
    let headers = {
      'Accept': "application/json",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Vary': 'Origin',
      'Content-Type': contentType
    };

    // Create new axios instance and fill it with a url and headers.
    this.client = axios.create({ baseURL: this.api_url, timeout: 31000, headers: headers });

    return this.client;
  };

  /**
   * Provides a method send POST requests to a specified endpoint.
   * Callbacks and errors can be caught in the .then() and .catch() properties respectively.
   * @param {string} path - The path to which to send the request.
   * @param {object} data - The data to be sent within the request.
   * @example
   * // Calls doSomething if request is succesful and logs the error message if something goes wrong.
   * postData(...).then(doSomething).catch((error) => console.log(error));
   */
  post = (path: string, data: object) => {
    return this.init().post(path, data);
  };

  get = (path: string) => {
    return this.init().get(path);
  };
}