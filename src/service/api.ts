import axios from 'axios'

export const api = axios.create({
    baseURL: "https://todo-engenharia-software.onrender.com",
    headers: {
        'Content-Type': 'application/json',
    },
})