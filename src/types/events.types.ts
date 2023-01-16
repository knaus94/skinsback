import { DefaultItemInfo } from './common.types';
import { MarketBuyItem } from './market-buy-item.types';

export class ItemInfo extends DefaultItemInfo {
    id: number;
    instanceid: string;
}

export enum Events {
    buyItem = 'buy_item',
    statusChange = 'status_change',
    balanceChange = 'balance_change',
    authSuccess = 'auth_success',
    authFailed = 'auth_failed',
}

export type OfferStatus =
    | 'creating_trade'
    | 'waiting_accept'
    | 'accepted'
    | 'canceled'
    | 'timeout'
    | 'invalid_trade_token'
    | 'user_not_tradable'
    | 'trade_create_error';

export class BuyItemEvent {
    event: Events.buyItem;
    data: MarketBuyItem;
}

export class StatusChangeEvent {
    event: Events.statusChange;
    data: {
        item: {
            id: number;
        };
        buy_id: string;
        offer_status: OfferStatus;
        tradeofferid: string;
    };
}

export class BalanceChangeEvent {
    event: Events.balanceChange;
    data: {
        balance_value: number;
    };
}

export class AuthSuccessEvent {
    event: Events.authSuccess;
}

export class AuthFailedEvent {
    event: Events.authFailed;
}
