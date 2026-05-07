//Importa los hooks de tanstack query
//-UseQuery: para consultas GET
//-UseMutation: para operaciones POST/PUT/DELETE
//-useQueryClient: para acceder al cliente de caché y gestionar la invalidación de datos
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
//Importa la función que obtiene los carros desde la API
import { carrosService } from '../api/carros.service';

//Definimos una constante Key me va a servir como identificador unico
// para todas las querys relacionadas con el recuso carro
const KEY = ['carros'];

//Hook Personalizado useCarros
//Para encapsular la logica de obtener carros desde la API
//Utilizar useQuery que reemplaza el useEffect y el useState con queryKey 'carros'
//-queryFin: ejecuta carrosService.getAll() y muestra un console log
//-staleTime: definir que los datos se mantengan cacheados por n minutos
export function useCarros() {
    return useQuery({
        queryKey: ['carros'],
        queryFn: () => {

            console.log('GET executed...');
            return carrosService.getAll();
        },
        staleTime: 1000 * 60 * 5, //Cache valido de 5 minutos
    })
}

export function useAgregarCarro() {
    const qc = useQueryClient(); //Obtenemos el cliente de caché para gestionar la invalidación de datos
    return useMutation({
        mutationFn: (marca:string ) => carrosService.add(marca),
        onSuccess: () => qc.invalidateQueries({ queryKey: KEY }), //Invalidamos la query 'carros' para que se vuelva a ejecutar y obtener los datos actualizados
    })
}
