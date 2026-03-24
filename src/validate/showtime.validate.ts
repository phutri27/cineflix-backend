    import { body } from "express-validator";
import { prisma } from "../lib/prisma";

export const ShowtimeValidation = [
    body("data").isArray({ min: 1 }).withMessage("Data must be an array with at least one showtime"),
    body("data.*.screenId").isString().withMessage("Screen ID must be a string"),
    body("data.*.startTime").isISO8601().toDate().withMessage("Start time must be a valid date")
    .custom(async (value, {req}) => {
        const startTime = new Date(value);
        const datas = req.body.data
        const response = await prisma.showtime.findFirst({
            where: {
                screenId: datas[0].screenId,
                startTime: startTime
            }
        })
        if (response) {
            throw new Error(`Showtime already exists for at ${startTime}`);
        }
    
        const showtimeData = await prisma.showtime.findMany({
            where:{
                screenId: datas[0].screenId,
            },
            include:{
                movie:true
            }
        })

        const overlappingShowtime = showtimeData.some((showtime) => {
            const existingStartTime = new Date(showtime.startTime);
            const existingEndTime = new Date(existingStartTime.getTime() + (showtime.movie.durationMin * 1000 * 60) + (15 * 60 * 1000)) 
            const newStartTime = new Date(value);
            const newEndTime = new Date(newStartTime.getTime() + (showtime?.movie.durationMin * 1000 * 60) + (15 * 60 * 1000));

            return (newStartTime < existingEndTime && newEndTime > existingStartTime);
        });

        if (overlappingShowtime) {
            throw new Error(`Showtime overlaps with an existing showtime for screen`);
        }

        if (startTime < new Date()) {
            throw new Error("Start time must be in the future");
        }
        
        return true;
    })
]

export const movieIdValidation = [
    body("data.*.movieId").isString().withMessage("Movie ID must be a string"),
]


