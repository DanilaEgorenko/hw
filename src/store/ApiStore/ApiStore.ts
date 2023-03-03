import axios from 'axios';

interface IRequest {
  endpoint: string;
  headers?: {
    accept: string;
  };
}

export default class RepoStore {
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
