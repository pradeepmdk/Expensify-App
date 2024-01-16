type AddPaymentCardParams = {
    cardNumber: string;
    cardYear: string;
    cardMonth: string;
    cardCVV: string;
    addressName: string;
    addressZip: string;
    currency: ValueOf<typeof CONST.CURRENCY>;
    isP2PDebitCard: boolean;
};
export default AddPaymentCardParams;
