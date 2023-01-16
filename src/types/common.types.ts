export type SkinsbackCurrency = 'rub' | 'usd';
export type SkinsBackGame = 'rust' | 'dota2' | 'csgo';

export enum DefaultErrorCodes {
    methodNotAllow = -1,
    invalidShopid = -2,
    invalidSignature = -3,
    shopNotActive = -4,
    invalidMethod = -5,
    requestLimitReached = -7,
    requestTimeout = 'requestTimeout',
    unknownError = 'unknownError',
}

export interface ErrorResponse {
    status: 'error';
    error_code: string;
}

export class DefaultItemInfo {
    name: string;
    price: number;
    classid: string;
}

export interface Currencies {
    usd: number;
    rub: number;
    uah: number;
    eur: number;
    cny: number;
    kzt: number;
    aud: number;
    cad: number;
    brl: number;
    nzd: number;
}
