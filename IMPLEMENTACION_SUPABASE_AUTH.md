# Implementación de Supabase Auth

Este documento resume todo lo que se implementó para agregar autenticación con Supabase en la app Expo Router, incluyendo la estructura de navegación, el provider de sesión, las pantallas de login y registro, y los cambios de dependencias.

## 1. Dependencias instaladas

Se agregaron dos paquetes para soportar la autenticación en React Native:

- `@supabase/supabase-js` para conectar la app con Supabase Auth.
- `@react-native-async-storage/async-storage` para persistir la sesión en dispositivo.

También se reutilizó `@tanstack/react-query`, que ya forma parte de la app, sin cambios adicionales en la lógica de carros.

## 2. Variables de entorno

Se usaron las variables ya presentes en [.env](.env):

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

La app valida que estas variables existan al iniciar el cliente de Supabase. Si faltan, lanza un error temprano para evitar fallos silenciosos.

## 3. Cliente de Supabase

Se creó el cliente central en [src/lib/supabase.ts](src/lib/supabase.ts).

### Qué hace

- Lee la URL y la anon key desde el entorno.
- Crea el cliente oficial de Supabase.
- Configura Auth para guardar sesión con AsyncStorage.
- Activa `autoRefreshToken` y `persistSession`.
- Desactiva `detectSessionInUrl`, que no se usa en React Native.

### Por qué es importante

Esto hace que el login sobreviva al cierre y reapertura de la app, en lugar de perderse al cambiar de pantalla o reiniciar.

## 4. Capa de autenticación

Se añadió un contexto global en [src/context/auth-context.tsx](src/context/auth-context.tsx).

### Qué maneja

- `session`: sesión actual de Supabase o `null`.
- `loading`: estado inicial mientras se consulta la sesión guardada.
- `signIn(email, password)`: inicia sesión con correo y contraseña.
- `signUp(email, password)`: crea una cuenta nueva.
- `signOut()`: cierra la sesión actual.

### Cómo funciona

- Al montar el provider, primero llama a `supabase.auth.getSession()` para recuperar la sesión guardada.
- Luego escucha cambios de autenticación con `supabase.auth.onAuthStateChange`.
- Cuando la sesión cambia, el contexto se actualiza y la UI reacciona automáticamente.

## 5. Navegación raíz

Se reescribió la navegación principal en [app/_layout.tsx](app/_layout.tsx).

### Cambios principales

- Se mantiene `QueryClientProvider` para la lógica de carros.
- Se envuelve toda la app con `AuthProvider`.
- Se agrega un guard con `useSegments()` y `useRouter()`.
- Si no hay sesión, se redirige a `/(auth)/login`.
- Si ya hay sesión y el usuario entra a auth, se redirige a `/(tabs)`.
- Se conserva la ruta `modal` del starter para no romper la navegación secundaria.

### Resultado

La app ya no entra directo al grupo de tabs sin validar autenticación.

## 6. Ruta de entrada

Se creó [app/index.tsx](app/index.tsx).

### Qué hace

Actúa como pantalla de entrada y decide a dónde mandar al usuario:

- Si hay sesión, redirige a `/(tabs)`.
- Si no hay sesión, redirige a `/(auth)/login`.

### Por qué existe

Evita que el usuario quede atrapado en una ruta vacía o en una vista incorrecta al abrir la app.

## 7. Grupo de autenticación

Se creó el grupo de rutas [app/(auth)/_layout.tsx](app/(auth)/_layout.tsx).

### Qué hace

- Define un `Stack` sin encabezado para las pantallas de autenticación.
- Mantiene aisladas las vistas de login y registro del flujo principal de la app.

## 8. Pantalla de login

Se creó [app/(auth)/login.tsx](app/(auth)/login.tsx).

### Elementos del formulario

- Campo de correo electrónico.
- Campo de contraseña.
- Botón para iniciar sesión.
- Mensaje de error cuando Supabase devuelve un fallo.
- Link para ir a registro.

### Flujo

1. El usuario escribe correo y contraseña.
2. Se llama a `signIn` desde `AuthContext`.
3. Si el login es correcto, se redirige a `/(tabs)`.
4. Si falla, se muestra el mensaje de error.

### Detalles visuales

- Se usó un card central con sombras.
- Se añadieron figuras decorativas para dar identidad visual.
- Se aplicó `KeyboardAvoidingView` para que el formulario no quede tapado por el teclado.

## 9. Pantalla de registro

Se creó [app/(auth)/register.tsx](app/(auth)/register.tsx).

### Elementos del formulario

- Campo de correo electrónico.
- Campo de contraseña.
- Botón para crear cuenta.
- Mensaje de error.
- Mensaje de éxito cuando la cuenta se crea pero requiere confirmación por correo.
- Link para volver al login.

### Flujo

1. El usuario completa el formulario.
2. Se llama a `signUp` desde `AuthContext`.
3. Si Supabase devuelve sesión activa, se redirige directo a `/(tabs)`.
4. Si Supabase pide confirmación, se muestra un mensaje para revisar el correo.

### Nota funcional

El comportamiento final depende de cómo esté configurada la confirmación por correo en el proyecto de Supabase.

## 10. Cierre de sesión

Se agregó una acción de logout en [app/(tabs)/index.tsx](app/(tabs)/index.tsx).

### Qué hace

- Muestra un botón de cerrar sesión en la pantalla principal de tabs.
- Llama a `signOut()` desde el contexto.
- Al cerrar sesión, el guard de navegación manda al login automáticamente.

## 11. Qué no se cambió

No se modificó la lógica de carros más allá de agregar el botón de cerrar sesión. La API de carros, el hook `useCarros` y el cliente Axios siguen funcionando como antes.

## 12. Validación realizada

Se ejecutó `npm run lint` y el proyecto quedó correcto en los archivos tocados. El único warning restante fue preexistente en [src/api/client.ts](src/api/client.ts) sobre el import de Axios, y no forma parte de esta implementación.

## 13. Archivos creados o actualizados

- [app/_layout.tsx](app/_layout.tsx)
- [app/index.tsx](app/index.tsx)
- [app/(auth)/_layout.tsx](app/(auth)/_layout.tsx)
- [app/(auth)/login.tsx](app/(auth)/login.tsx)
- [app/(auth)/register.tsx](app/(auth)/register.tsx)
- [app/(tabs)/index.tsx](app/(tabs)/index.tsx)
- [src/context/auth-context.tsx](src/context/auth-context.tsx)
- [src/lib/supabase.ts](src/lib/supabase.ts)
- [.env](.env)

## 14. Resumen corto

La app quedó con un flujo de autenticación completo basado en Supabase, con persistencia de sesión, login, registro, redirección automática y protección de rutas. El diseño se mantuvo simple pero más claro que el starter, y el resto de la funcionalidad de carros no fue removida.