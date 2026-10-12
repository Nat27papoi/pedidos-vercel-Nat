// ============================================================================
//  MISIONES — Sistema de Pedidos y Clientes · Informática III (Grupo 1301)
// ============================================================================
//  Este es el ÚNICO archivo de lógica que vas a modificar.
//
//  Cada función está "vacía" a propósito. Tu sitio publicado en Vercel tiene un
//  panel de verificación que corre casos de prueba contra estas funciones y te
//  dice cuál falla, qué esperaba y qué obtuvo. Lee el caso que falla ANTES de
//  cambiar código: así se trabaja con pruebas unitarias (lo verás en 3.4).
//
//  Puedes verificar sin publicar con:  npm run verificar
//
//  Orden recomendado: 1 → 2 → 3 → 4 → 5. La 6 es para Destacado.
// ============================================================================

import { ESTADOS } from './datos.js'

// ----------------------------------------------------------------------------
// MISIÓN 1 · RF3 — ¿Cuánto paga el cliente?
// ----------------------------------------------------------------------------
// Recibe un pedido: { items: [{ cantidad, precioUnitario }], descuento }
//   - subtotal = suma de (cantidad × precioUnitario) de cada item
//   - descuento es una fracción (0.1 = 10 %). Si no viene, es 0.
//   - total = subtotal × (1 − descuento), REDONDEADO a 2 decimales.
//   - Un pedido sin items cuesta 0.
// Pista: prueba en la consola 0.1 + 0.2 y verás por qué hay que redondear.
//        Math.round(x * 100) / 100
export function totalPedido(pedido) {
  if (!pedido || !pedido.items || pedido.items.length === 0) {
    return 0;
  }

  // 1. Calcular el subtotal sumando (cantidad * precioUnitario) de cada ítem
  const subtotal = pedido.items.reduce((acumulado, item) => {
    return acumulado + (item.cantidad * item.precioUnitario);
  }, 0);

  // 2. Obtener el descuento (si no está definido o es falsy, se asume 0)
  const descuento = pedido.descuento || 0;

  // 3. Calcular el total aplicando el descuento
  const total = subtotal * (1 - descuento);

  // 4. Redondear estrictamente a 2 decimales usando la pista indicada
  return Math.round(total * 100) / 100;
  return 0 // TODO
}

// ----------------------------------------------------------------------------
// MISIÓN 2 · RF4 — ¿Este cambio de estado es válido?
// ----------------------------------------------------------------------------
// Los estados avanzan en orden y SOLO un paso a la vez:
//   registrado → en_preparacion → listo → entregado
// Devuelve true únicamente si `nuevo` es el estado inmediatamente siguiente
// de `actual`. Saltar pasos, regresar o moverse desde "entregado" es false.
// Un estado que no existe también es false.
// Pista: ESTADOS ya es un arreglo ordenado. ¿Qué te dice indexOf?
export function puedeTransicionar(actual, nuevo) {
  // Encontrar las posiciones de ambos estados en el arreglo ordenado ESTADOS
  const indexActual = ESTADOS.indexOf(actual);
  const indexNuevo = ESTADOS.indexOf(nuevo);

  // Si alguno de los dos estados no existe (da -1), la transición no es válida
  if (indexActual === -1 || indexNuevo === -1) {
    return false;
  }

  // El nuevo estado debe ser exactamente el siguiente paso inmediato (indexActual + 1)
  return indexNuevo === indexActual + 1;git 
  return true // TODO: hoy acepta cualquier cosa. ¿Qué tan grave sería eso en producción?
}

// ----------------------------------------------------------------------------
// MISIÓN 3 · RF1 — ¿Los datos del cliente son válidos?
// ----------------------------------------------------------------------------
// Recibe { nombre, telefono, email } y devuelve un ARREGLO con los códigos de
// error que apliquen, en este orden. Si todo está bien, devuelve [].
//   'nombre_requerido'  → nombre vacío o solo espacios
//   'telefono_invalido' → después de quitar espacios y guiones, no son
//                         exactamente 10 dígitos
//   'email_invalido'    → el email VIENE (no está vacío) y no tiene forma de
//                         correo: algo@algo.algo   (el email es opcional)
// Pista: '55 1234-5678'.replace(/[\s-]/g, '')   y   /^\d{10}$/.test(...)
export function validarCliente(cliente) {
const errores = [];

  // 1. Validar nombre: requerido o solo espacios
  if (!cliente || !cliente.nombre || cliente.nombre.trim() === '') {
    errores.push('nombre_requerido');
  }

  // 2. Validar teléfono: quitar espacios y guiones, debe tener exactamente 10 dígitos
  if (!cliente || !cliente.telefono) {
    errores.push('telefono_invalido');
  } else {
    // Reemplazamos todos los espacios y guiones globales
    const telLimpio = cliente.telefono.replace(/[\s-]/g, '');
    // Verificamos que sean exactamente 10 dígitos numéricos
    if (!/^\d{10}$/.test(telLimpio)) {
      errores.push('telefono_invalido');
    }
  }

  // 3. Validar email: si viene (no está vacío), debe tener formato válido
  if (cliente && cliente.email && cliente.email.trim() !== '') {
    // Expresión regular básica para validar correo
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(cliente.email)) {
      errores.push('email_invalido');
    }
  }

  return errores;
}

// ----------------------------------------------------------------------------
// MISIÓN 4 · RF5 — ¿Cuántos pedidos hay en cada estado?
// ----------------------------------------------------------------------------
// Devuelve un objeto con TODOS los estados como llave, aunque tengan 0:
//   { registrado: 3, en_preparacion: 3, listo: 2, entregado: 2 }
// Con una lista vacía, todos van en 0.
export function resumenPorEstado(pedidos) {
// Inicializamos un objeto con todos los estados en 0
  const resumen = {};
  ESTADOS.forEach((estado) => {
    resumen[estado] = 0;
  });

  // Si no hay pedidos o no es un arreglo válido, devolvemos el objeto con ceros
  if (!Array.isArray(pedidos)) {
    return resumen;
  }

  // Contamos cada pedido según su estado actual
  pedidos.forEach((pedido) => {
    if (resumen.hasOwnProperty(pedido.estado)) {
      resumen[pedido.estado] += 1;
    }
  });

  return resumen;}

// ----------------------------------------------------------------------------
// MISIÓN 5 · RF5 — Buscar pedidos por nombre de cliente
// ----------------------------------------------------------------------------
// Devuelve los pedidos cuyo cliente CONTIENE el texto buscado, sin importar
// mayúsculas ni acentos: "ramirez" encuentra a "Ana Ramírez" y "JOSÉ" a
// "José Martínez". Un texto vacío (o solo espacios) devuelve todos.
// Pista: 'Ramírez'.normalize('NFD').replace(/[̀-ͯ]/g, '')
//        Investiga qué hace NFD. Es un problema real en sistemas en español.
export function buscarPedidos(pedidos, texto) {
  // Si no hay lista de pedidos, devolvemos un arreglo vacío
  if (!Array.isArray(pedidos)) {
    return [];
  }

  // Si el texto está vacío o solo contiene espacios, devolvemos todos los pedidos
  if (!texto || texto.trim() === '') {
    return pedidos;
  }

  // Función auxiliar para normalizar texto (quitar acentos y pasar a minúsculas)
  const normalizar = (str) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const textoBusqueda = normalizar(texto);

  // Filtramos los pedidos cuyo cliente contiene el texto buscado
  return pedidos.filter((pedido) => {
    const clienteNormalizado = normalizar(pedido.cliente);
    return clienteNormalizado.includes(textoBusqueda);
  });

}

// ----------------------------------------------------------------------------
// MISIÓN 6 · DESTACADO — Los mejores clientes
// ----------------------------------------------------------------------------
// Devuelve los `n` clientes que más han gastado, sumando el total de TODOS sus
// pedidos (reutiliza totalPedido, no copies la lógica).
// Formato: [{ cliente: 'Ana Ramírez', total: 1316 }, ...]
// Orden: total de mayor a menor; si empatan, por nombre alfabético.
// Pista: un objeto acumulador, luego Object.entries, map y sort.
export function topClientes(pedidos, n) {
if (!Array.isArray(pedidos) || pedidos.length === 0 || !n) {
    return [];
  }

  // 1. Objeto acumulador para sumar el total por cada cliente
  const acumulado = {};

  pedidos.forEach((pedido) => {
    const cliente = pedido.cliente;
    const totalDelPedido = totalPedido(pedido); // Reutilizamos totalPedido

    if (!acumulado[cliente]) {
      acumulado[cliente] = 0;
    }
    acumulado[cliente] += totalDelPedido;
  });

  // 2. Convertir a arreglo con Object.entries y mapear al formato requerido
  const listaClientes = Object.entries(acumulado).map(([cliente, total]) => ({
    cliente,
    total: Math.round(total * 100) / 100 // Redondear por seguridad
  }));

  // 3. Ordenar: de mayor a menor total; si empatan, por orden alfabético del cliente
  listaClientes.sort((a, b) => {
    if (b.total !== a.total) {
      return b.total - a.total; // Mayor a menor
    }
    return a.cliente.localeCompare(b.cliente); // Alfabético en caso de empate
  });

  // 4. Devolver solo los primeros `n` clientes
  return listaClientes.slice(0, n);
}
