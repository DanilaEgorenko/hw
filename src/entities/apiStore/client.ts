import { AxiosResponse } from 'axios';

export interface IApistore {
  request({ endpoint }: RequestParams): Promise<AxiosResponse<any, any>>;
}

export interface RequestParams {
  endpoint: string;
}
