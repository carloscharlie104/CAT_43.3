# (CAT) Concesionario Automóviles Turísticos

## Componentes del proyecto

Carlos Kilian Ortiz Viera, Tomás Fernández Sicilia y Alejandro Bolaños Briganty.

---

## Descripción del proyecto

Este proyecto trata de una propuesta de digitalización del servicio de renting automotriz mediante una plataforma web escalable, que busca dar una experiencia simple, dinámica y eficaz al usuario. Favoreciendo la simpleza y claridad por encima de funciones que no son necesarias.

---

## Listado de Requisitos funcionales

### Requisitos Funcionales

### Información del servicio y generación de confianza

- La web debe explicar claramente qué es CAT Car Renting Service y cuál es su propuesta de valor.
- La web debe mostrar las condiciones generales del servicio de forma comprensible.
- La web debe incluir información de contacto visible y accesible.
- La web debe incorporar una sección de Preguntas Frecuentes (FAQ) para resolver dudas habituales.
- La web debe disponer de páginas de información legal básica (privacidad y cookies).

### Catálogo de vehículos

- La web debe mostrar un listado de vehículos disponibles.
- Cada vehículo debe incluir información esencial: modelo, categoría, precio orientativo y características principales.
- El usuario debe poder filtrar el catálogo según criterios relevantes (mínimo dos).
- El usuario debe poder ordenar los resultados según un criterio lógico (por ejemplo, precio).
- Desde el catálogo debe poder accederse a la ficha detallada de cada vehículo.

### Ficha de vehículo

- Cada vehículo debe disponer de una página de detalle.
- La ficha debe mostrar imágenes representativas y descripción.
- Deben mostrarse claramente las características principales.
- Deben indicarse precio orientativo y condiciones relevantes.

### Solicitud de reserva

- El usuario debe poder solicitar una reserva desde la ficha del vehículo.
- La solicitud debe incluir fechas de inicio y fin.
- Debe solicitarse información básica de contacto (nombre, email y teléfono).
- Debe existir un campo opcional para observaciones.
- El sistema debe validar los campos obligatorios y los formatos básicos.
- Tras el envío, debe mostrarse una confirmación clara con indicación de los siguientes pasos.

### Página de contacto

- La web debe incluir una página específica de contacto con formulario.
- El formulario debe validar datos básicos y confirmar el envío.
- Deben ofrecerse alternativas de contacto directo (teléfono y/o email).

---

## Requisitos No Funcionales

### Usabilidad

- La navegación debe ser clara e intuitiva.
- Las acciones principales deben ser fácilmente identificables.
- El proceso de solicitud de reserva debe ser sencillo y directo.
- Los mensajes de error deben ser claros y comprensibles.

### Adaptación a dispositivos

- La web debe visualizarse correctamente en móvil, tablet y ordenador.
- El contenido no debe romperse ni perder legibilidad en pantallas pequeñas.
- Los botones deben ser cómodos de usar en dispositivos táctiles.

### Rendimiento

- La web debe cargar de forma ágil.
- No deben producirse bloqueos ni errores visibles.
- La navegación debe ser fluida.

### Claridad y accesibilidad

- El texto debe ser legible.
- Los formularios deben ser comprensibles.
- Los mensajes de validación deben explicar el error de forma clara.

### Evolución futura

- La web debe permitir añadir nuevos vehículos con facilidad.
- Debe poder ampliarse con nuevas secciones en el futuro.
- El crecimiento del negocio no debe requerir rehacer el sitio completo.

---

## Relación con el Desarrollo del SPRINT 1

Los requisitos definidos en este documento permitirán:

- Diseñar los mockups del sitio web
- Identificar templates reutilizables
- Desarrollar plantillas modulares
- Verificar la generación de páginas finales a partir de dichos templates

Este proceso garantiza la trazabilidad entre análisis, diseño e implementación, cumpliendo los objetivos establecidos en el SPRINT 1.

---

## Nombre y ubicación del archivo pdf con los mockups y storyboard (figma)

El archivo PDF con las templates, se encuentra en la ubicación:  
CAT_43.3/Web/MockupsFolder/Templates (con nombre templates.pdf).

Y los mockups se encuentran en la ruta:  
CAT_43.3/Web/MockupsFolder/NoTemplates con el nombre (noTemplates.pdf).

---

## Listado de páginas html del proyecto

(Para cada página html indicar el nombre del mockup que implementa. Indicar la página de inicio de la aplicación web)

Las páginas html de este proyecto son las siguientes:

Se dotará del nombre del archivo como tal en el proyecto (x.html) y entre paréntesis y en mayúsculas el nombre que tiene en los mockups de Figma.

---

### login.html (Figma: ACCESO)

Este simplemente consiste en una pasarela para que el usuario pueda introducir sus credenciales y pueda acceder a su perfil dentro de la web.
Se tiene en cuenta la funcionalidad de poder “Recordar credenciales” al igual que “recuperar contraseña”.

<img width="1008" height="704" alt="image" src="https://github.com/user-attachments/assets/f5f4c117-f2f8-449f-acd8-ead6e3867ddd" />


---

### register.html (Figma: REGISTRO USUARIO)

Página para que el usuario pueda registrarse con sus datos personales como nombre, apellidos, nombre de usuario, correo y contraseña.
<img width="1008" height="725" alt="image" src="https://github.com/user-attachments/assets/122a6703-50f3-4eda-945b-2c699428ecf7" />

---

### passRecovery.html (Figma: RECUPERAR CONTRASEÑA)

Formulario para poder solicitar una recuperación de contraseña en caso de haberla olvidado o perdido.
<img width="1007" height="691" alt="image" src="https://github.com/user-attachments/assets/4b448a5e-4609-44bb-8144-a9974c255896" />

---

### main.html (Figma: INICIO)

Landing page, es decir, lo primero que vería el usuario nada más entrar a la web. En ésta se presenta un futuro carrusel de ofertas y novedades en el centro para un rápido acceso, siguiendo la filosofía del proyecto.
<img width="1003" height="711" alt="image" src="https://github.com/user-attachments/assets/fd554a7e-554a-4ec5-8082-42b1ba1f83b6" />

---

### reservation.html (Figma: RESERVA)

En esta página el usuario podrá elegir destino y rango de fechas en el recuadro de la izquierda y en el recuadro de la derecha se mostraran las opciones disponibles en consecuencia.
<img width="1008" height="716" alt="image" src="https://github.com/user-attachments/assets/b4602461-5b12-4f34-a706-fbc3b066e81e" />

---

### information.html (Figma: INFORMACIÓN)

Página que muestra la historia de la empresa, localización y orígenes.
<img width="1004" height="707" alt="image" src="https://github.com/user-attachments/assets/04a88b22-5bed-4d1f-9b7b-b75f7e82a73c" />

---

### contact.html (Figma: CONTACTO)

En esta página el usuario puede mandar un mensaje a través de la página para hacer una consulta.
<img width="1012" height="712" alt="image" src="https://github.com/user-attachments/assets/d3a94eb7-e422-4ff7-88cb-3be8fe0e4c7c" />

---

### carData.html (Figma: RESERVA DATOS COCHE)

Página pensada con dos usos dependiendo si el usuario ha iniciado sesión. El funcionamiento base permite ver los detalles y especificaciones del vehículo. Por otro lado, en caso de que el usuario haya iniciado sesión, verá los detalles del vehículo reservado, modificar o cancelar su pedido.
<img width="1004" height="710" alt="image" src="https://github.com/user-attachments/assets/2ecafd78-f4d1-4a9c-a32e-46f66a7f2bbb" />

---

### paymentGateway.html (Figma: PREVIO PASARELA DE PAGO)

En esta página el usuario ya ha elegido el vehículo y está listo para realizar su reserva asi que le solicitaremos el resto de datos personales para que pueda proceder a realizar el pago.
<img width="1007" height="674" alt="image" src="https://github.com/user-attachments/assets/a8937418-1f88-48e1-89ec-c2155ce7336b" />

---

### faq.html (Figma: FAQ)

En esta página el usuario puede ver las preguntas frecuentes de otros usuarios y las respuestas.
<img width="815" height="557" alt="image" src="https://github.com/user-attachments/assets/4a1bb54b-92a7-4ec4-a816-b6cd5830b8af" />

---

## Listado de archivos y templates identificados y señalar en el archivo en el que se cargan
<img width="514" height="1015" alt="image" src="https://github.com/user-attachments/assets/47c6e6bd-0a41-4d22-abfb-821310d83457" />

Como podemos ver tenemos varios Templates en nuestro proyecto separados por archivos .html en la carpeta Template y por sus .css individuales guardados dentro de la carpeta Style con el resto de los .css

- auth-card.html lo podemos encontrar en los archivos de la carpeta loginRegisterRecovery ya que es un template del cuadro de central de estos.
- cards.html corresponde a las tarjetas con información de los vehículos de reservation.html y de main.html.
- footer.html es el pie de página que tenemos en toda la web.
- header.html es el menú de navegación que tenemos al principio de casi todas las páginas de nuestra web.
- offertCard.html corresponde a las tres tarjetas centrales de la página information.html.

---

## Otros aspectos del proyecto que tener en consideración

(tareas implementadas con javascript, organización de las hojas de estilo etc.)

Como aspectos adicionales nos gustaría remarcar la funcionalidad ya implementada de los cuadros de texto y los acordeones del FAQ en los cuales el usuario ya podría interactuar con ellos para dar una experiencia, pese a ser un dummy, algo más viva.
