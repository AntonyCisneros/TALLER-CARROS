import { useAuth } from "@/src/context/auth-context";
import { useState } from "react";
import { Button, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useAgregarCarro, useCarros } from "../../src/hooks/useCarros";



export default function App() {
  const [marca, setMarca] = useState('');
  const { signOut } = useAuth();
  //Hook useCarros: que obtiene la lista de carros desde la API
  const { data: carros } = useCarros();
  //Hook useAgregarCarro: que define la mutacion para agregar un nuevo carro
  const agregarMutacion = useAgregarCarro();
  console.log(carros);

  //Funcion agregar:
  //Ejecuta la mutacion con la marca actual
  //Al terminar con exito, limpia el input
  const agregar = () => {
    agregarMutacion.mutate(marca, {onSuccess: () => setMarca('')})
    console.log(carros);
  }
 
  return (
    <View style={{flex: 1, paddingTop: 60}}>
      <Pressable onPress={() => signOut()} style={{ alignSelf: 'flex-end', marginRight: 16, marginBottom: 24 }}>
        <Text style={{ fontWeight: '700', color: '#0a7ea4' }}>Cerrar sesión</Text>
      </Pressable>
      <TextInput
        value= {marca}
        onChangeText={setMarca}
        style= {{borderWidth: 3}}
      />
      <Button title="Agregar" onPress={agregar} />
      <FlatList 
        //Fuente de datos
        data = {carros}
        // Clave unica por cada carro
        keyExtractor={item => item.id}
        renderItem = {({item}) => <Text>{item.id}-{item.marca}</Text>} 
      />
    </View>
  )
}