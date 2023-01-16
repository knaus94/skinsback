import { Currencies, SkinsbackCurrency } from "./common.types";

export interface DepositModel {
    sign: string;
    status: 'success' | 'pending' | 'fail';
    transaction_id: string;
    order_id: string;
    steam_id: string;
    date: number;
    amount?: number;
    amount_currency?: SkinsbackCurrency;
    amount_in_currencies?: Currencies;
    user_amount?: number;
    user_amount_in_currencies?: Currencies;
    offer_date: number;
    skins_send_date: number;
}
