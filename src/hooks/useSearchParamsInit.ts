import SearchParamsStore from '@store/SearchParamsStore';
import * as Router from 'react-router-dom';

export const useQueryParamsStoreInit = (): void => {
  const { search } = Router.useLocation();
  const searchParamsStore = new SearchParamsStore();
};
