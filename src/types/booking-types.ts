export interface PricingDetailProp {
    id: string
    seat_id: string
    price: string
    seat_type: string
    row: string
    number: number
}

export interface SnackData {
    snackId: string
    price: number
    quantity: number
}

export interface VoucherData {
    voucherId: string
    reduceAmount: number
    quantity: number
}

export interface BookingInfo {
    movieId: string | undefined
    showtimeId: string
    seats: PricingDetailProp[]
    snacks: SnackData[]
    vouchers: VoucherData[]
    bookingId: string
}

export interface BookingProps{
    id: string,
    showtimeId: string
    seats: PricingDetailProp[]
    snacks?: {snackId: string, quantity: number}[] 
    vouchers?: {voucherId: string, quantity: number}[]
}