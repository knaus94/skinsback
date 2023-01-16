import { Currencies, DefaultErrorCodes, ErrorResponse } from './common.types';

export class BalanceModel {
    status: 'success';
    balance: number;
    balance_in_currencies: Currencies;
    deals_sum: number;
    deals_sum_in_currencies: Currencies;
    withdraw_sum: number;
    withdraw_sum_in_currencies: Currencies;
}

export const BalanceErrorCodes = {
    ...DefaultErrorCodes,
};

export type BalanceError = DefaultErrorCodes;

export type BalanceResponse = BalanceModel | ErrorResponse;