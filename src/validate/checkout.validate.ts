import { body } from "express-validator";

export const checkoutValidate = [
    body("datas.seats")
    .custom((value, {req}) => {
        for (const val of value){
            if (val.seat_type === "EMPTY" || val.seat_type == "REPAIR"){
                throw new Error("Seat must not be of type EMPTY or REPAIR")
            }
        }
        return true
    })
]