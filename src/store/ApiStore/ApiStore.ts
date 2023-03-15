import { IApistore, RequestParams } from '@entities/apiStore/client';
import axios, { AxiosResponse } from 'axios';

export default class ApiStore implements IApistore {
  url = '';
  constructor(url: string) {
    this.url = url;
  }

  async request({
    endpoint,
  }: RequestParams): Promise<AxiosResponse<any, any> | any> {
    const headers: any = {};
    if (endpoint.split('/').at(-1) === 'readme') {
      headers.accept = 'application/vnd.github.html+json';
    }
    const res = await axios.get(this.url + endpoint, {
      headers,
    });
    return res;
  }
}
