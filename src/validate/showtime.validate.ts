import { body } from "express-validator";
import { prisma } from "../lib/prisma.js";

export const ShowtimeValidation = [
    body("data").isArray({ min: 1 }).withMessage("Data must be an array with at least one showtime"),
    body("data.*.screenId").isString().withMessage("Screen ID must be a string"),
    body("data.*.startTime").isISO8601().toDate().withMessage("Start time must be a valid date")
    .custom(async (value, {req, path}) => {
        const startTime = new Date(value);
        const match = path.match(/\d+/);
        const index = match ? parseInt(match[0], 10) : 0;

        const currentItem = req.body.data[index];
        const currentScreenId = currentItem.screenId;
        const currentMovieId = currentItem.movieId;

        const showtimeIdToIgnore = currentItem.id

        const ignoreClause = showtimeIdToIgnore ? { id: { not: showtimeIdToIgnore } } : {};
        const response = await prisma.showtime.findFirst({
            where: {
                screenId: currentScreenId,
                startTime: startTime,
                isCancelled: false,
                ...ignoreClause 
            }
        })
        if (response) {
            throw new Error(`Showtime already exists for at ${startTime}`);
        }
    
        const showtimeData = await prisma.showtime.findMany({
            where: {
                screenId: currentScreenId,
                isCancelled: false,
                ...ignoreClause 
            },
            include: { movie: true }
        })

        const newMovie = await prisma.movie.findUnique({ 
            where: { id: currentMovieId },
            select: { durationMin: true, premiereDate: true } 
        });

        if (!newMovie) {
            throw new Error(`Movie with ID ${currentMovieId} not found`);
        }

        if (startTime <= new Date(newMovie.premiereDate)){
            throw new Error(`Showtime must not be before premiere date`)
        }

        const overlappingShowtime = showtimeData.some((showtime) => {
            const existingStartTime = new Date(showtime.startTime);
            const existingEndTime = new Date(existingStartTime.getTime() + (showtime.movie.durationMin * 1000 * 60) + (15 * 60 * 1000)) 
            const newStartTime = new Date(value);
            const newEndTime = new Date(newStartTime.getTime() + (newMovie.durationMin * 60000) + (15 * 60000));

            return (newStartTime < existingEndTime && newEndTime > existingStartTime);
        });

        if (overlappingShowtime) {
            throw new Error(`Showtime overlaps with an existing showtime for screen`);
        }
        
        return true;
    })
]

export const updateShowTimeValidation = [
    body("data").isObject().withMessage("Data must be an object"),
    body("data.screenId").isString().withMessage("Screen ID must be a string"),
    body("data.movieId").isString().withMessage("Movie ID must be a string"),
    body("data.startTime").isISO8601().toDate().withMessage("Start time must be a valid date")
    .custom(async (value, {req, path}) => {
        const startTime = new Date(value);

        const currentItem = req.body.data;
        const currentScreenId = currentItem.screenId;
        const currentMovieId = currentItem.movieId;

        const showtimeIdToIgnore = req.params?.id

        const ignoreClause = showtimeIdToIgnore ? { id: { not: showtimeIdToIgnore } } : {};
        const response = await prisma.showtime.findFirst({
            where: {
                screenId: currentScreenId,
                startTime: startTime,
                isCancelled: false,
                ...ignoreClause 
            }
        })
        if (response) {
            throw new Error(`Showtime already exists for at ${startTime}`);
        }
    
        const showtimeData = await prisma.showtime.findMany({
            where: {
                screenId: currentScreenId,
                isCancelled: false,
                ...ignoreClause 
            },
            include: { movie: true }
        })

        const newMovie = await prisma.movie.findUnique({ 
            where: { id: currentMovieId },
            select: { durationMin: true, premiereDate: true } 
        });

        if (!newMovie) {
            throw new Error(`Movie with ID ${currentMovieId} not found`);
        }

        if (startTime <= new Date(newMovie.premiereDate)){
            throw new Error(`Showtime must not be before premiere date`)
        }

        const overlappingShowtime = showtimeData.some((showtime) => {
            const existingStartTime = new Date(showtime.startTime);
            const existingEndTime = new Date(existingStartTime.getTime() + (showtime.movie.durationMin * 1000 * 60) + (15 * 60 * 1000)) 
            const newStartTime = new Date(value);
            const newEndTime = new Date(newStartTime.getTime() + (newMovie.durationMin * 60000) + (15 * 60000));

            return (newStartTime < existingEndTime && newEndTime > existingStartTime);
        });

        if (overlappingShowtime) {
            throw new Error(`Showtime overlaps with an existing showtime for screen`);
        }
        
        return true;
    }),
]

export const movieIdValidation = [
    body("data.*.movieId").isString().withMessage("Movie ID must be a string"),
]



