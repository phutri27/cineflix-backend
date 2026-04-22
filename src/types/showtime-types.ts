export interface ShowtimeProp{
    startTime: Date
    screenId: string
    movieId: string;
}

export interface CreateShowtimeProp extends ShowtimeProp{
    movieId: string;
}