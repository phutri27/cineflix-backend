export interface VoucherData{
    name: string,
    reduceAmount: number,
    quantity: number 
    startAt: Date,
    expireAt: Date,
    maxUsed: number
}

export interface VoucherProp extends VoucherData{
    activationCode: string
}