import { DefaultErrorCodes, ErrorResponse } from './common.types';

enum ErrorCodes {
    invalidOrderId = 1,
    invalidSteamId = 2,
    transactionIdAlreadyExists = 5,
    invalidMaxValue = 7,
    invalidCurrency = 8,
}

export interface CreateDeposit {
    status: 'success';
    url: string;
    transaction_id: number;
}

export const CreateDepositErrorCodes = {
    ...ErrorCodes,
    ...DefaultErrorCodes,
};

export type CreateDepositError = ErrorCodes | DefaultErrorCodes;

export type CreateDepositResponse = CreateDeposit | ErrorResponse;
