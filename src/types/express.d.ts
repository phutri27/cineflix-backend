export {}

declare global {
  namespace Express {
    interface User {
      id: string
      email: string
      role: string
      first_name: string
      last_name: string
    }
  }
}