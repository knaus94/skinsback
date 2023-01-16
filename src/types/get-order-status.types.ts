import { DepositModel } from './deposit-callback.types';
import { DefaultErrorCodes, ErrorResponse } from './common.types';

enum ErrorCodes {
    orderIdOrTransactionIdMissing = 1,
    invalidOrderId = 2,
    invalidTransactionId = 3,
    transactionNotFound = 4,
}

export const OrderStatusErrorCodes = {
    ...ErrorCodes,
    ...DefaultErrorCodes,
};

export type OrderStatusError = ErrorCodes | DefaultErrorCodes;

export type OrderStatusResponse = DepositModel | ErrorResponse;
