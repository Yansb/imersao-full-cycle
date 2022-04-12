import axios from "axios"

export const bankHttp = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEST_API_URL,
})

export const localhttp = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEST_API_URL_OUTSIDE_CALLS,
})