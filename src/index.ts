import crypto from 'crypto';
import { SkinsBackWebApiConfig } from './configs/config';
import axios, { AxiosInstance } from 'axios';
import { DepositModel } from './types/deposit-callback.types';
import EventEmitter from 'events';
import WebSocket from 'ws';
import {
    CreateDepositError,
    CreateDepositErrorCodes,
    CreateDepositResponse,
} from './types/create-deposit.types';
import { SkinsbackCurrency, SkinsBackGame } from './types/common.types';
import {
    AuthSuccessEvent,
    AuthFailedEvent,
    BuyItemEvent,
    StatusChangeEvent,
    BalanceChangeEvent,
    Events,
} from './types/events.types';
import {
    BalanceModel,
    BalanceError,
    BalanceResponse,
    BalanceErrorCodes,
} from './types/get-balance.types';
import {
    OrderStatusError,
    OrderStatusResponse,
    OrderStatusErrorCodes,
} from './types/get-order-status.types';
import {
    MarketBuyItem,
    MarketBuyItemError,
    MarketBuyItemResponse,
    MarketBuyItemErrorCodes,
} from './types/market-buy-item.types';
import {
    MarketPriceList,
    MarketPriceListError,
    MarketPriceListResponse,
} from './types/market-price-list.types';
import {
    MarketTransactionErrorCodes,
    MarketTransaction,
    MarketTransactionError,
    MarketTransactionResponse,
} from './types/market-transaction.types';

export class SkinsBackWebApi extends EventEmitter {
    private readonly config: SkinsBackWebApiConfig;
    private readonly skinsback: AxiosInstance = axios.create({
        baseURL: 'https://skinsback.com/api.php',
        method: 'post',
        timeout: 5000,
        headers: {
            'Accept-Encoding': 'utf8',
        },
    });
    private ws: WebSocket;

    constructor(config: SkinsBackWebApiConfig) {
        super();

        this.config = config;

        if (config.ws) {
            this.connectWebsocket();
        }
    }

    /**
     * В отличие от классических платежных систем, SkinsBack не принимает определенную сумму для пополнения. Сумма пополнения отправляется на Result URL (callback) после передачи нам игровых вещей.
     *
     * В ответе данного метода будет содержаться URL, на который необходимо перенаправить пользователя (это и есть страница оплаты).
     *
     * Параметры "min_amount" и/или "max_amount" обязательны для использования только для создания Limited депозитов. Тогда также обязательно указывать и параметр "currency". Если "min_amount" будет меньше суммы минимальной сделки для игры, будет использована сумма минимальной сделки для игры.
     */
    public createDeposit(
        orderId: string,
        steamId: string,
        tradeToken: string,
        currency: SkinsbackCurrency,
    ) {
        const params = {
            ...this.params('create'),
            order_id: orderId,
            steam_id: steamId,
            trade_token: tradeToken,
            currency,
        };
        const sign = this.generateSign(params);

        return new Promise(
            (
                resolve: (value: { url: string; sign: string; transactionId: number }) => void,
                reject: (reason: CreateDepositError) => void,
            ) => {
                this.skinsback
                    .request({
                        data: { ...params, sign },
                    })
                    .then(({ data }: { data: CreateDepositResponse }) => {
                        if (data.status === 'error') {
                            return reject(CreateDepositErrorCodes[data.error_code]);
                        }

                        return resolve({
                            url: data.url,
                            transactionId: data.transaction_id,
                            sign,
                        });
                    })
                    .catch((e) => {
                        if (e.request) {
                            return reject(CreateDepositErrorCodes.requestTimeout);
                        }

                        return reject(CreateDepositErrorCodes.unknownError);
                    });
            },
        );
    }

    /**
     * Данный метод используется, чтобы получить информацию о депозите, созданном через метод createDeposit.
     */
    public getOrderStatus(transactionId: string) {
        const params = {
            ...this.params('orderstatus'),
            transaction_id: transactionId,
        };
        const sign = this.generateSign(params);

        return new Promise(
            (
                resolve: (value: DepositModel) => void,
                reject: (reason: OrderStatusError) => void,
            ) => {
                this.skinsback
                    .request({
                        data: { ...params, sign },
                    })
                    .then(({ data }: { data: OrderStatusResponse }) => {
                        if (data.status === 'error') {
                            return reject(OrderStatusErrorCodes[data.error_code]);
                        }

                        return resolve(data);
                    })
                    .catch((e) => {
                        if (e.request) {
                            return reject(OrderStatusErrorCodes.requestTimeout);
                        }

                        return reject(OrderStatusErrorCodes.unknownError);
                    });
            },
        );
    }

    /**
     * Данный метод используется, чтобы получить информацию о балансе на сайте.
     */
    public balance() {
        const params = { ...this.params('balance') };
        const sign = this.generateSign(params);

        return new Promise(
            (resolve: (value: BalanceModel) => void, reject: (reason: BalanceError) => void) => {
                this.skinsback
                    .request({
                        data: { ...params, sign },
                    })
                    .then(({ data }: { data: BalanceResponse }) => {
                        if (data.status === 'error') {
                            return reject(BalanceErrorCodes[data.error_code]);
                        }

                        return resolve(data);
                    })
                    .catch((e) => {
                        if (e.request) {
                            return reject(BalanceErrorCodes.requestTimeout);
                        }

                        return reject(BalanceErrorCodes.unknownError);
                    });
            },
        );
    }

    /**
     * Метод возвращает список скинов в наличии, которые можно вывести.
     */
    public getMarketPriceList(game: SkinsBackGame) {
        const params = { ...this.params('market_pricelist'), game, extended: 1 };
        const sign = this.generateSign(params);

        return new Promise(
            (
                resolve: (value: MarketPriceList) => void,
                reject: (reason: MarketPriceListError) => void,
            ) => {
                this.skinsback
                    .request({
                        data: { ...params, sign },
                    })
                    .then(({ data }: { data: MarketPriceListResponse }) => {
                        if (data.status === 'error') {
                            return reject(MarketTransactionErrorCodes[data.error_code]);
                        }

                        return resolve(data);
                    })
                    .catch((e) => {
                        if (e.request) {
                            return reject(MarketTransactionErrorCodes.requestTimeout);
                        }

                        return reject(MarketTransactionErrorCodes.unknownError);
                    });
            },
        );
    }

    /**
     * Покупка скина и отправка его юзеру.
     */
    public marketBuyItem(
        transactionId: string,
        item: string,
        maxPrice: number,
        game: SkinsBackGame,
        partner: string,
        token: string,
    ) {
        const params = {
            ...this.params('market_buy'),
            partner,
            token,
            name: item,
            game,
            max_price: maxPrice,
            custom_id: transactionId,
        };
        const sign = this.generateSign(params);

        return new Promise(
            (
                resolve: (value: MarketBuyItem) => void,
                reject: (reason: MarketBuyItemError) => void,
            ) => {
                this.skinsback
                    .request({
                        data: { ...params, sign },
                    })
                    .then(({ data }: { data: MarketBuyItemResponse }) => {
                        if (data.status !== 'success') {
                            return reject(MarketBuyItemErrorCodes[data.error_code]);
                        }

                        return resolve(data);
                    })
                    .catch((e) => {
                        if (e.request) {
                            return reject(MarketBuyItemErrorCodes.requestTimeout);
                        }

                        return reject(MarketBuyItemErrorCodes.unknownError);
                    });
            },
        );
    }

    /**
     * Информация по приобретенной вещи. Метод позволяет узнать tradeofferid, а также проверить, принят ли предмет пользователем (или он был отклонен).
     */
    public getTransactions(transactionIds: string[]) {
        const params = {
            ...this.params('market_getinfo'),
            custom_ids: transactionIds,
        };
        const sign = this.generateSign(params);

        return new Promise(
            (
                resolve: (value: MarketTransaction) => void,
                reject: (reason: MarketTransactionError) => void,
            ) => {
                this.skinsback
                    .request({
                        data: { ...params, sign },
                    })
                    .then(({ data }: { data: MarketTransactionResponse }) => {
                        if (data.status === 'error') {
                            return reject(MarketTransactionErrorCodes[data.error_code]);
                        }

                        return resolve(data);
                    })
                    .catch((e) => {
                        if (e.request) {
                            return reject(MarketTransactionErrorCodes.requestTimeout);
                        }

                        return reject(MarketTransactionErrorCodes.unknownError);
                    });
            },
        );
    }

    /**
     * Создание подключение к вебсокету
     */
    private connectWebsocket(attempt = 1) {
        try {
            const sign = crypto
                .createHash('md5')
                .update(`${this.config.clientID}${this.config.clientSecret}`)
                .digest('hex');

            this.ws = new WebSocket(
                `wss://skinsback.com/ws/?shopid=${this.config.clientID}&signature=${sign}`,
            );

            this.ws.on('open', () => {
                setInterval(() => {
                    this.ws.send('ping');
                }, 20e3);
            });

            this.ws.on('error', (err) => {
                console.log(err);
            });

            this.ws.on('close', () => {
                setTimeout(() => {
                    this.connectWebsocket(attempt + 1);
                }, 1e3 * attempt);
            });

            this.ws.on('message', (data) => {
                const message:
                    | AuthSuccessEvent
                    | AuthFailedEvent
                    | BuyItemEvent
                    | StatusChangeEvent
                    | BalanceChangeEvent = JSON.parse(data.toString());

                switch (message?.event) {
                    case Events.buyItem:
                        this.emit(Events.buyItem, message);
                        break;

                    case Events.statusChange:
                        this.emit(Events.statusChange, message);
                        break;

                    case Events.balanceChange:
                        this.emit(Events.balanceChange, message);
                        break;
                }
            });
        } catch (e) {
            setTimeout(() => {
                this.connectWebsocket(attempt + 1);
            }, 1e3 * attempt);
        }
    }

    private params = (
        method:
            | 'create'
            | 'orderstatus'
            | 'balance'
            | 'market_pricelist'
            | 'market_buy'
            | 'market_getinfo',
    ) => ({
        method,
        shopid: this.config.clientID,
    });

    private generateSign(params: object) {
        const paramsString = Object.keys(params)
            .sort()
            .filter((key) => typeof params[key] !== 'object' && key !== 'sign')
            .map((key) => `${key}:${params[key]}`)
            .join(';')
            .concat(`;`);

        return crypto
            .createHmac('sha1', this.config.clientSecret)
            .update(paramsString)
            .digest('hex');
    }
}
