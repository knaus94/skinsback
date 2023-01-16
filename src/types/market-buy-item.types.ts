import { DefaultErrorCodes, ErrorResponse } from './common.types';
import { ItemInfo, OfferStatus } from './events.types';

export class Item {
    item: ItemInfo;
    buy_id: string;
    offer_status: OfferStatus;
}

enum ErrorCodes {
    marketDisable = -6,
    missinNameAndId = 1,
    nameMinLength = 2,
    missinPartnerOrToken = 3,
    insufficientFunds = 4,
    skinUnvailable = 5,
    skinsNotFoundAtSpecifiedPrice = 6,
    transactionIdAlreadyExists = 7,
}

export interface MarketBuyItem {
    status: 'success';
    item: Item;
    offer_status: OfferStatus;
    balance_debited_sum: number;
    buy_id: number;
}
export const MarketBuyItemErrorCodes = { ...DefaultErrorCodes, ...ErrorCodes };

export type MarketBuyItemError = DefaultErrorCodes | ErrorCodes

export type MarketBuyItemResponse = MarketBuyItem | ErrorResponse;
