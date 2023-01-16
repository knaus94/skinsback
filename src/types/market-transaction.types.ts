import { DefaultErrorCodes, DefaultItemInfo, ErrorResponse } from './common.types';
import { ItemInfo, OfferStatus } from './events.types';

enum ErrorCodes {
    marketDisable = -6,
    missingOneOfRequiredParams = 1,
    offerNotFound = 2,
}

export interface MarketTransaction {
    status: 'success';
    items: MarketItemTransaction[];
}

export interface MarketItemTransaction {
    item: ItemInfo;
    buy_id: string;
    offer_status: OfferStatus;
    steamid: string;
    date: string;
    balance_debited_sum: number;
    tradeofferid: string;
    custom_id: string;
}

export const MarketTransactionErrorCodes = { ...DefaultErrorCodes, ...ErrorCodes };

export type MarketTransactionError = DefaultErrorCodes | ErrorCodes;

export type MarketTransactionResponse = MarketTransaction | ErrorResponse;
