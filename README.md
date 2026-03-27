# (CAT) Concesionario Automóviles Turísticos.

---

## Componentes del proyecto:  
Carlos Kilian Ortiz Viera, Tomás Fernández Sicilia y Alejandro Bolaños Briganty.

---

## Descripción del proyecto:  
Propuesta de digitalización del servicio de renting automotriz mediante una plataforma web escalable. Se prioriza una experiencia simple, dinámica y eficaz, reduciendo funciones innecesarias y dando claridad al usuario durante todo el proceso de búsqueda y reserva.

---

## IMPORTANTE
1. **La página de inicio de la aplicación web es Web/Pages/main.html.**
2. Pasos a seguir para que el proyecto funcione correctamente en su equipo:
  - Instalar Node.js
  - Instalar json-server: `npm install json-server`.
  - Iniciar desde la terminal el json-server con: `npm run server`.


*Siguiendo estos pasos la inyección tanto de las imágenes como el texto se verán correctamente, en caso contrario solamente podrá ver los "dummies" o fallos totales de la página.* 

---

## Nombre y ubicación del archivo pdf con los mockups  
Los archivos PDF con los mockups de Escritorio, Tablet y Móvil se encuentran en Web/MockupsFolder/ con nombres Escritorio.pdf, Tablet.pdf y Movil.pdf.

<img width="274" height="490" alt="image" src="https://github.com/user-attachments/assets/275911d6-01b6-4ecb-ad36-86cb0e8da228" />

---

## Listado de páginas html del proyecto. (Para cada página html indicar el nombre del mockup que implementa. Indicar la página de inicio de la aplicación web  


<img width="274" height="630" alt="image" src="https://github.com/user-attachments/assets/1a06d5da-c6d7-4f44-a042-c7cc3d817701" />


---

## Las páginas html:

login.html (ubicación: Web/Pages/loginRegisterRecovery/login.html)  
Mockup aplicado: Escritorio / Tablet / Móvil (responsive).  
Descripción: pasarela de acceso con usuario y contraseña, opción “Recuérdame” y enlaces a recuperar contraseña y registro.  
Responsive implementado: responsive.css, header.css (media), footer.css (media), auth-card.css (media), login.css (media).  
Carga de templates: header.html, footer.html, auth-card.html (este último se inyecta por JS).  
Carga de JSON: auth, users (API http://localhost:3000, datos en db.json).  
Validaciones HTML en formularios: campos con required y tipos text/password. El formulario tiene novalidate y las validaciones reales se hacen por JS.  

---

register.html (ubicación: Web/Pages/loginRegisterRecovery/register.html)  
Mockup aplicado: Escritorio / Tablet / Móvil (responsive).  
Descripción: registro con usuario, email, repetir email, contraseña y repetir contraseña, más aceptación de condiciones.  
Responsive implementado: responsive.css, header.css (media), footer.css (media), auth-card.css (media).  
Carga de templates: header.html, footer.html, auth-card.html.  
Carga de JSON: auth, users (GET y POST a http://localhost:3000).  
Validaciones HTML en formularios: required, type="email" en emails, type="password" en contraseñas y minLength=6 (configurado por JS). novalidate activo y validación principal en JS.  

---

passRecovery.html (ubicación: Web/Pages/loginRegisterRecovery/passRecovery.html)  
Mockup aplicado: Escritorio / Tablet / Móvil (responsive).  
Descripción: formulario de recuperación con email y repetición de email.  
Responsive implementado: responsive.css, header.css (media), footer.css (media), auth-card.css (media).  
Carga de templates: header.html, footer.html, auth-card.html.  
Carga de JSON: auth, users (GET a http://localhost:3000).  
Validaciones HTML en formularios: required, type="email" y validación por JS; novalidate activo.  

---

main.html (ubicación: Web/Pages/main.html)  
Mockup aplicado: Escritorio / Tablet / Móvil (responsive).  
Descripción: landing page con carrusel de ofertas destacadas y tarjetas enlazadas a detalle.  
Responsive implementado: responsive.css, header.css (media), footer.css (media), main.css (media).  
Carga de templates: header.html, footer.html, offertCard.html (placeholders de tarjetas).  
Carga de JSON: cars (API http://localhost:3000).  

---

reservation.html (ubicación: Web/Pages/reservation.html)  
Mockup aplicado: Escritorio / Tablet / Móvil (responsive).  
Descripción: formulario de selección de isla, localización y fechas; listado de vehículos filtrables.  
Responsive implementado: responsive.css, header.css (media), footer.css (media).  
Carga de templates: header.html, footer.html, offertCard.html (placeholders que se reemplazan por JS).  
Carga de JSON: cars, categories, locations (API http://localhost:3000).  
Validaciones HTML en formularios: la selección y fechas se controlan por JS; fecha mínima = hoy y fecha fin no puede ser anterior a fecha inicio.  

---

information.html (ubicación: Web/Pages/information.html)  
Mockup aplicado: Escritorio / Tablet / Móvil (responsive).  
Descripción: historia, ubicación y “quiénes somos”, más CTA a contacto.  
Responsive implementado: responsive.css, header.css (media), footer.css (media).  
Carga de templates: header.html, footer.html, cards.html.  
Carga de JSON: company, locations (API http://localhost:3000).  
Validaciones HTML en formularios: N/A.  

---

contact.html (ubicación: Web/Pages/contact.html)  
Mockup aplicado: Escritorio / Tablet / Móvil (responsive).  
Descripción: formulario de contacto con nombre, apellidos, email y mensaje.  
Responsive implementado: responsive.css, header.css (media), footer.css (media).  
Carga de templates: header.html, footer.html.  
Carga de JSON: company (GET) y contactMessages (POST) en http://localhost:3000.  
Validaciones HTML en formularios: type="email" en el email, sin required ni novalidate.  

---

carData.html (ubicación: Web/Pages/carData.html)  
Mockup aplicado: Escritorio / Tablet / Móvil (responsive).  
Descripción: detalle del vehículo seleccionado con imagen, specs y CTA a reserva.  
Responsive implementado: responsive.css, header.css (media), footer.css (media), carData.css (media).  
Carga de templates: header.html, footer.html.  
Carga de JSON: cars/:id y categories (fetch directo a http://localhost:3000).  
Validaciones HTML en formularios: N/A.  

---

paymentGateway.html (ubicación: Web/Pages/paymentGateway.html)  
Mockup aplicado: Escritorio / Tablet / Móvil (responsive).  
Descripción: formulario final de datos y método de pago.  
Responsive implementado: responsive.css (no hay header), footer.css (media).  
Carga de templates: footer.html.  
Carga de JSON: company, paymentMethods, cars/:id (API http://localhost:3000).  
Validaciones HTML en formularios: inputs con required, type="email", type="tel" y pattern="[0-9]{9}"; el formulario tiene novalidate y la validación se aplica por JS con checkValidity().  

---

faq.html (ubicación: Web/Pages/faq.html)  
Mockup aplicado: Escritorio / Tablet / Móvil (responsive).  
Descripción: preguntas frecuentes renderizadas como acordeón.  
Responsive implementado: responsive.css, header.css (media), footer.css (media), faq.css (media), main.css (media).  
Carga de templates: header.html, footer.html.  
Carga de JSON: faqs (API http://localhost:3000).  
Validaciones HTML en formularios: N/A.  

---

Los templates html:

auth-card.html  
Plantilla del bloque central de login/registro/recuperación. Se inyecta por JS en login.html, register.html y passRecovery.html.  

cards.html  
Plantilla de las 3 tarjetas informativas de information.html.  

footer.html  
Pie de página común, con datos dinámicos de empresa y enlaces.  

header.html  
Navegación principal en desktop y barras de navegación móvil.  

offertCard.html  
Plantilla de tarjeta de oferta usada como placeholder en main.html y reservation.html antes de renderizar datos dinámicos.

---


## Ubicación del contenido json 

El contenido JSON utilizado en el proyecto se gestiona mediante una API local accesible en http://localhost:3000, cuyos datos se encuentran definidos en el archivo `db.json` ubicado en la raíz del proyecto.  

Este archivo centraliza toda la información dinámica de la aplicación, incluyendo entidades como usuarios, vehículos, categorías, ubicaciones, empresa y preguntas frecuentes.  

Las distintas páginas del proyecto consumen estos datos mediante peticiones GET y POST, permitiendo simular un entorno real de backend durante el desarrollo.


<img width="274" height="419" alt="image" src="https://github.com/user-attachments/assets/73f57f40-82a9-4277-8ab4-f8fc713a2983" />

