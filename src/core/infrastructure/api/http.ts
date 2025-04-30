import axios from 'axios'

export const http = axios.create({
  baseURL: 'http://localhost:8080', // Ajusta si tu backend cambia
  headers: {
    'Content-Type': 'application/json',
  },
})