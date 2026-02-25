import app from "../root.js";
import { describe, expect, test, beforeEach, afterEach } from "vitest";
import request from "supertest"
import { prisma } from "../../src/lib/prisma.js";
import { moviesObj } from "../../src/dao/movies.dao.js";

beforeEach(async () => {
    await prisma.movie.deleteMany({})
});

afterEach(async () => {
    await prisma.movie.deleteMany({})
})

const mockMovie = {
    title: "Mickey 17",
    plot: "An expendable 'Mickey' clone on an ice colony refuses to die and let his replacement take over, triggering an existential and biological crisis.",
    posterUrl: "https://example.com/posters/mickey17.jpg",
    duration: 139, 
    premiereDate: new Date("2026-04-18T20:00:00.000Z"), 
    rated: "R"
};

test("get movie by title", async () => {
    const movie = await moviesObj.insert(mockMovie.title,
    mockMovie.plot,
    mockMovie.posterUrl,
    mockMovie.duration,
    mockMovie.premiereDate,
    mockMovie.rated)

    const res = await moviesObj.getMoviesByTitle(mockMovie.title)
    expect(res.length).toBe(1)
})