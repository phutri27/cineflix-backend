import app from "../root.js";
import { expect, test, beforeEach, afterEach } from "vitest";
import request from "supertest"
import { prisma } from "../../src/lib/prisma.js";
import { moviesObj } from "../../src/dao/movies.dao.js";


const mockMovie = {
    title: "Mickey 17",
    plot: "An expendable 'Mickey' clone on an ice colony refuses to die and let his replacement take over, triggering an existential and biological crisis.",
    posterUrl: "https://example.com/posters/mickey17.jpg",
    durationMin: 139, 
    premiereDate: new Date("2026-04-18T20:00:00.000Z"), 
    rated: "R",
    genre_option: ['abc', 'cde'],
    actors: ["cr7", "m10"],
    directors: ["bff", "hehe"]
};

beforeEach(async () => {
    await prisma.genre.createMany({
        data:[
            {id: 'abc', name: 'genre1'},
            {id: 'cde', name: 'genre2'}
        ]
    })

    await prisma.actor.createMany({
        data:[
            {id: 'cr7', name: 'robert'},
            {id: 'm10', name: "tom"}
        ]
    })
    
    await prisma.director.createMany({
        data:[
            {id: 'bff', name: 'john'},
            {id: 'hehe', name: 'luna'}
        ]
    })

    await moviesObj.insert(mockMovie.title,
    mockMovie.plot,
    mockMovie.posterUrl,
    mockMovie.durationMin,
    mockMovie.premiereDate,
    mockMovie.rated,
    mockMovie.genre_option,
    mockMovie.actors,
    mockMovie.directors)
});

afterEach(async () => {
    await prisma.genre.deleteMany()
    await prisma.actor.deleteMany()
    await prisma.director.deleteMany()
    await prisma.movie.deleteMany()
})

const mockGenre = [
{
    name: "genre1"
},
{
    name: "genre2"
}
]

const mockActor = [
    {name: "robert"},
    {name: "tom"}
]

const mockDirector = [
    {name: "john"},
    {name: 'luna'}
]

test("test /api/movies/coming_movies route", async () => {

    const response = await request(app).
                get("/api/movies/coming_movies")
    expect(response.headers["content-type"]).toMatch(/json/)
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)

    const { genres, directors, actors} = response.body[0]

    expect(JSON.stringify(genres)).toMatch(JSON.stringify(mockGenre))
    expect(JSON.stringify(directors)).toMatch(JSON.stringify(mockDirector))
    expect(JSON.stringify(actors)).toMatch(JSON.stringify(mockActor))
})

test("test /api/movies/genre route", async() => {
    const response = await request(app).
                get("/api/movies/genre/genre1")
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)

    const { genres, directors, actors} = response.body[0]

    expect(JSON.stringify(genres)).toMatch(JSON.stringify(mockGenre))
    expect(JSON.stringify(directors)).toMatch(JSON.stringify(mockDirector))
    expect(JSON.stringify(actors)).toMatch(JSON.stringify(mockActor))
})