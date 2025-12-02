import { PaymentCardDataType } from "../enums/payment-card-data-type";

export class PaymentCardDataModel {
    constructor(
        public type: PaymentCardDataType,
        public title: string,
        public description?: string | string[],
        public id?: string,
        public iconType?: number
    ) {}
}
