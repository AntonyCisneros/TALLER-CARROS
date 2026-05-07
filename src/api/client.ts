import axios from 'axios';

//Creamos un cliente de axios configurado con:
//-baseURL: La URL de la API, tomada de las variables de entorno de Expo
//-headers: indicar que el contenido sera json
export const client = axios.create ({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {'Content-Type': 'application/json'},
})