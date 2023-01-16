import { DefaultErrorCodes, DefaultItemInfo, ErrorResponse } from './common.types';

enum ErrorCodes {
    marketDisable = -6,
}

export interface MarketPriceList {
    status: 'success';
    last_update: string;
    items: (DefaultItemInfo & { count: number })[];
}

export const MarketPriceListErrorCodes = {
    ...ErrorCodes,
    ...DefaultErrorCodes,
};

export type MarketPriceListError = DefaultErrorCodes | ErrorCodes;

export type MarketPriceListResponse = MarketPriceList | ErrorResponse;