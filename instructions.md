# PROMT BASE — Plataforma de Reservas para Peluquerías
## Objetivo del proyecto
Desarrollar una **plataforma web venta de flores y anchetas** que permita a los negocios gestionar sus productos, y a los usuarios finales cotizar hacia un numero de whatsapp el articulo que quiera.
La plataforma integra:
- Una sección para flores
- Una sección para anchetas
- En la pagina principal, los productos de flores se muestran en cinta horizontal permitiendo desplazar, y un botón para ver todos las flores. La vista de las flores completas es otra pagina y en forma de mosaico.
- En la pagina principal, los productos de anchetas se muestran en cinta horizontal permitiendo desplazar, y un botón para ver todos las anchetas. La vista de las anchetas completas es otra pagina y en forma de mosaico.
- Los productos de flores y anchetas muestran su precio para que el usuario tenga una idea.
---
## Descripción general
Existen dos áreas claramente diferenciadas:
1. **Floristeria (negocio)**
 - Gestionan su productos, agregar, modificar, eliminar
2. **Usuarios finales**
 - Exploran flores y anchetas
 - Consultan disponibilidad
 - Botón de whatsapp para cotizar el articulo que quiera.
---
## Contexto tecnológico fijo
- **Base de datos y autenticación:** Supabase
- **Plataforma:** Web
- **Estética:** moderna, minimalista (fondo blanco, )
---
## Estructura por fases
El desarrollo del proyecto se divide en **cuatro fases** claramente separa
das:
### Fase 1 — Base de datos
Diseño e implementación del modelo de datos en Supabase, incluyendo tipo de articulo (flores y anchetas), cantidad de articulos disponibles, precios.
### Fase 2 — Interfaz web
Construcción de la UI web completa, separando el área de negocios y el área de usuarios, con autenticación, permisos y navegación clara.
### Fase 3 — Backend e integración con Google Calendar
Implementación de la lógica de negocio, API REST

# 1. Base de Datos
Fase 1: diseña e implementa la BASE DE DATOS usando Supabase para la plataforma web de reservas de peluquerías.
Contexto fijo:
- Supabase es la base de datos principal.
Tu tarea:
- Diseñar el modelo de datos y luego IMPLEMENTARLO en Supabase.
- Crear tablas, relaciones, constraints e índices necesarios.
- Incluir entidades necesarias para:
 - Articulos (flores y anchetas)
 - Cantidad de articulos disponibles
 - precios
 - descripcion
 - imagenes
Entrega:
- Explicación del modelo de datos
- SQL/migraciones ejecutables
- Políticas RLS claras
- Datos de ejemplo

# 2. Interfaz Web
Fase 2: construir la UI web completa de la plataforma con una estética moderna y minimalista (Los colores y diseño usa como referencia la pagina web de https://jesusda712.wixsite.com/casa-de-rosas).
Contexto fijo:
- La plataforma tiene dos áreas claramente separadas:
 - Área de negocios (floristería) con dashboard y SIDEBAR persistente
 - Área de usuarios finales para visualizar los productos
- Usar Supabase para autenticación y datos.
- Separación clara de rutas, layouts y permisos.

Tu tarea:
- Definir la arquitectura de frontend (rutas, layouts, guards).
- Implementar las pantallas principales:
- NEGOCIOS (con sidebar):
 - gestión de productos (agregar, editar, eliminar)
 - vista de productos
 - control de stock
- Crear el área de usuarios finales:
 - página principal con productos en cinta horizontal
 - página de detalle de productos
 - botón de WhatsApp para cotizar
 - Asegurar que el diseño sea responsive y moderno.
 - Implementar estados de carga, errores y estados vacíos.
 - Mantener la UI simple, clara y profesional.

Entrega:
- Código de la UI
- Estructura clara del proyecto
- Explicación breve de cómo se separan las dos áreas

# 3. Backend
Fase 3: implementar el backend de la plataforma.
Integraciones obligatorias:
- Supabase (DB + Auth)
Tu tarea:
- Implementar endpoints REST para:
 - gestión de productos (agregar, editar, eliminar)
 - vista de productos
 - control de stock
- Registrar errores y eventos importantes relacionados con la sincronización.
Entrega:
- Código backend completo
- Ejemplos de casos cubiertos (crear, cancelar, conflicto simple)
Añade algunos datos mock (pocos) a supabase con db push

---
Nota final
Este documento actúa como **archivo inicial de referencia**, cuyo propósito es explicar **qué es el proyecto, qué se va a construir y cómo se divide el trabajo**, sin entrar en detalles de implementación.