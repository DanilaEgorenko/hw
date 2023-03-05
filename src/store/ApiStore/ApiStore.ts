import { IApistore, RequestParams } from '@entities/apiStore/client';
import axios, { AxiosResponse } from 'axios';

export default class ApiStore implements IApistore {
  url = '';
  constructor(url: string) {
    this.url = url;
  }

  async request({
    endpoint,
    headers,
  }: RequestParams): Promise<AxiosResponse<any, any>> {
    const res = await axios.get(this.url + endpoint, {
      headers,
    });
    return res;
  }
}
