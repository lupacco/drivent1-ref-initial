import Joi from 'joi';

export type CardData = {
  issuer: string;
  number: string;
  name: string;
  expirationDate: string;
  cvv: string;
};

export type PaymentReq = {
  ticketId: number;
  cardData: CardData;
};

export const paymentSchema = Joi.object<PaymentReq>({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.string().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string().required(),
    cvv: Joi.string().required(),
  }).required(),
});
