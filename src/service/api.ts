import axios from 'axios'

export const api = axios.create({
    baseURL: "https://todo-es-1.onrender.com",
    headers: {
        'Content-Type': 'application/json',
    },
})