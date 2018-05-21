import {
  CHANGE_CURRENCY_AMOUNT,
  SWAP_CURRENCY,
  CHANGE_BASE_CURRENCY,
  CHANGE_QUOTE_CURRENCY,
  GET_INITIAL_CONVERSION,
  CONVERSION_RESULT,
  CONVERSION_ERROR,
  GET_COIN_LIST,
  COIN_LIST_RESULT,
} from '../actions/currencies';

const initialState = {
  baseCurrency: 'GBP',
  quoteCurrency: 'EUR',
  amount: 1,
  conversions: {},
  coinList: ['BTC', 'ETH'],
  error: null,
};

const setConversions = (state, action) => {
  let conversion = {
    isFetching: true,
    date: '',
    rates: {},
  };

  if (state.conversions[action.currency]) {
    conversion = state.conversions[action.currency];
  }

  return {
    ...state.conversions,
    [action.currency]: conversion,
  };
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_CURRENCY_AMOUNT:
      return { ...state, amount: action.amount || 0 };
    case SWAP_CURRENCY:
      return {
        ...state,
        baseCurrency: state.quoteCurrency,
        quoteCurrency: state.baseCurrency,
      };
    case CHANGE_BASE_CURRENCY:
      return {
        ...state,
        baseCurrency: action.currency,
        conversions: setConversions(state, action),
      };
    case CHANGE_QUOTE_CURRENCY:
      return {
        ...state,
        quoteCurrency: action.currency,
        conversions: setConversions(state, action),
      };
    case GET_COIN_LIST:
      return {
        ...state,
      };
    case COIN_LIST_RESULT:
      return {
        ...state,
        ...action.result.data,
      };
    case GET_INITIAL_CONVERSION:
      return { ...state, conversions: setConversions(state, { currency: state.baseCurrency }) };
    case CONVERSION_RESULT:
      return {
        ...state,
        conversions: {
          ...state.conversions,
          [action.result.base]: {
            isFetching: false,
            ...action.result,
          },
        },
      };
    case CONVERSION_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};
