import { IRequest } from '@entities/apiStore/client';
import axios from 'axios';

export default class ApiStore {
  url = '';
  constructor(url: string) {
    this.url = url;
  }

  async request({ endpoint, headers }: IRequest) {
    const res = await axios.get(this.url + endpoint, {
      headers,
    });
    return res;
  }
}
