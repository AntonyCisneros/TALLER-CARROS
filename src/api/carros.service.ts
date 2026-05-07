//Importar el cliente axios configurado en client.ts
//Importamos el tipo Carro para tipar la respuesta de la API
import { Carro } from "../types/carro";
import { client } from "./client";

//Definimos un servicio carroService
//Este servicio va a centralizar las operaciones relacionadas
// con la entidad carro y contendra metodos asincronicos para interactuar con la API

export const carrosService = {
    //Metodo GET: obtiene todos los carros del backend
    //Retorna una promesa con un arreglo de objetos Carro
    getAll: async (): Promise<Carro[]> => {
        const{data} = await client.get<Carro[]>('/carros'); //Llamada GET a la ruta /carros
        return data;
    },

    //Metodo POST: agregar un nuevo carro enviando la marca al backend
    //Retorna una promesa con el objeto carro recien creado
    add: async(marca: string): Promise<Carro> => {
        const {data} = await client.post<Carro>('carros', {marca}); //Llamada POST a la ruta /carros con el cuerpo {marca}
        return data;
    },

    
}