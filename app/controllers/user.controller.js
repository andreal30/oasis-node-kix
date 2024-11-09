// Implementar la funcion getAllUsers
// Implementar la funcion getUserById
// Implementar la funcion updateUser
// Implementar la funcion deleteUser

// Buenas practicas a tomar en cuenta:
// - Siempre usar el try-catch para manejar errores
// - Cuando haya un error retornar codigo 500 (Internal Server Error)
// - Siempre retornar el codigo de estado correspondiente
// - 200 -> OK (Cuando todo esta bien)
// - 201 -> Created (Cuando se crea un nuevo recurso)
// - 400 -> Bad Request (Cuando el request del cliente no es correcto)
// - 401 -> Unauthorized
// - 404 -> Not Found (Cuando no se encuentra el recurso)
// - 500 -> Internal Server Error
// Si se animan a usar loggers, siempre registrar un evento de error, cada vez que ingresen al catch