# Fase 1. Auditoria de reutilizacion

## 1.1 Inventario de vistas existentes

Base auditada:

- `Web/Pages/main.html`
- `Web/Pages/reservation.html`
- `Web/Pages/carData.html`
- `Web/Pages/information.html`
- `Web/Pages/contact.html`
- `Web/Pages/paymentGateway.html`
- `Web/Pages/loginRegisterRecovery/login.html`
- `Web/Pages/loginRegisterRecovery/register.html`
- `Web/Pages/loginRegisterRecovery/passRecovery.html`

Decision de migracion a Angular:

| Vista actual | Rol actual | Destino Angular | Componentes reutilizables implicados |
| --- | --- | --- | --- |
| `main.html` | Portada con carrusel de coches destacados | Pagina `HomePageComponent` | `HeaderComponent`, `FooterComponent`, `OfferCardComponent`, `FeaturedCarouselComponent` |
| `reservation.html` | Busqueda y listado de coches filtrables | Pagina `ReservationPageComponent` | `HeaderComponent`, `FooterComponent`, `ReservationSearchFormComponent`, `CarGridComponent`, `CarCardComponent` |
| `carData.html` | Detalle de vehiculo por `id` | Pagina `CarDetailPageComponent` | `HeaderComponent`, `FooterComponent`, `CarHeroComponent`, `CarSpecsComponent`, `ReservationCtaComponent` |
| `information.html` | Informacion corporativa y tarjetas de contenido | Pagina `InformationPageComponent` | `HeaderComponent`, `FooterComponent`, `InfoCardsComponent`, `BottomActionComponent` |
| `contact.html` | Formulario de contacto | Pagina `ContactPageComponent` | `HeaderComponent`, `FooterComponent`, `ContactFormComponent` |
| `paymentGateway.html` | Formulario final de reserva/pago | Pagina `PaymentGatewayPageComponent` | `FooterComponent`, `PaymentFormComponent`, opcional `ReservationSummaryComponent` |
| `login.html` | Inicio de sesion | Pagina `LoginPageComponent` dentro de feature `auth` | `HeaderComponent`, `FooterComponent`, `AuthCardComponent` |
| `register.html` | Registro | Pagina `RegisterPageComponent` dentro de feature `auth` | `HeaderComponent`, `FooterComponent`, `AuthCardComponent` |
| `passRecovery.html` | Recuperacion de acceso | Pagina `RecoveryPageComponent` dentro de feature `auth` | `HeaderComponent`, `FooterComponent`, `AuthCardComponent` |

Decision recomendada de routing:

- `/` o `/home`: portada
- `/reservation`: listado y filtros
- `/cars/:id`: detalle de coche
- `/information`: informacion corporativa
- `/contact`: contacto
- `/payment`: pasarela
- `/auth/login`
- `/auth/register`
- `/auth/recovery`

Observaciones:

- `paymentGateway.html` hoy no monta `header`, solo `footer`. Angular debe respetar esa decision salvo que se cambie funcionalmente.
- El flujo `login/register/recovery` comparte casi toda la estructura y debe quedar agrupado como una feature `auth` con tres rutas hijas.
- `faq.html` existe y ya esta conectado desde el footer, aunque no formaba parte de la lista inicial. Conviene incluirlo en backlog de migracion para no dejar enlaces rotos.

## 1.2 Inventario de templates ya creados

Base auditada:

- `Web/Template/header.html`
- `Web/Template/footer.html`
- `Web/Template/cards.html`
- `Web/Template/auth-card.html`
- `Web/Template/offertCard.html`

Clasificacion para convertir en componentes Angular sin rediseño:

| Template actual | Uso actual | Destino Angular | Notas de migracion |
| --- | --- | --- | --- |
| `header.html` | Estructura vacia del header desktop y mobile; se rellena por JS | `HeaderComponent` | Mantener markup actual y mover el rellenado dinamico a inputs, servicios y template binding |
| `footer.html` | Estructura base de footer; se rellena por JS con datos de empresa | `FooterComponent` | Mantener markup y sustituir `innerHTML` por bindings Angular |
| `cards.html` | Tres bloques de informacion corporativa | `InfoCardsComponent` | Mantener estructura de tres tarjetas; el contenido vendra por `@Input()` o por facade de empresa/localizaciones |
| `auth-card.html` | Shell comun del login/registro/recuperacion | `AuthCardComponent` | Es el mejor candidato a componente reutilizable parametrico para la feature `auth` |
| `offertCard.html` | Tarjeta visual de oferta/coche | `OfferCardComponent` o `CarCardComponent` | Hoy se usa como placeholder y luego se reemplaza el contenido; en Angular debe renderizarse directamente con datos |

Subcomponentes recomendados derivados del uso real:

- `MobileBottomNavComponent` si se quiere separar la parte mobile del `header`.
- `ContactFormComponent` y `PaymentFormComponent` si se quiere aislar validacion y mensajes.
- `FeaturedCarouselComponent` si el carrusel de portada se quiere encapsular en lugar de dejarlo en la pagina.

## 1.3 Logica que debe desaparecer

### Ensamblado manual por includes

Codigo afectado:

- `Web/Scripts/site.js`
- Todas las paginas con atributos `data-include`
- `Web/Scripts/authContent.js`

Patrones a eliminar:

- `data-include="../Template/header.html"` y variantes
- `fetchPartial()` para cargar fragmentos HTML
- `loadIncludes()` para inyectar HTML dentro de placeholders
- `resolveIncludeAssetUrls()` para recomponer rutas despues de insertar fragmentos
- `fetch("../../Template/auth-card.html")` para montar el formulario de auth
- `waitForCardsTemplate()` con `MutationObserver` para esperar a que `cards.html` aparezca

Reemplazo Angular:

- Componentes declarados en templates Angular
- `router-outlet` para las vistas
- Inputs, outputs y servicios para transmitir datos
- `ngFor`, `ngIf` y bindings en lugar de inyectar HTML remoto

### Manipulacion directa del DOM

Scripts con dependencia fuerte de DOM imperativo:

- `Web/Scripts/header.js`
- `Web/Scripts/footer.js`
- `Web/Scripts/main.js`
- `Web/Scripts/information.js`
- `Web/Scripts/contact.js`
- `Web/Scripts/reservation.js`
- `Web/Scripts/paymentGateway.js`
- `Web/Scripts/carData.js`
- `Web/Scripts/auth.js`
- `Web/Scripts/authContent.js`
- `Web/Scripts/site.js`

Patrones concretos a eliminar:

- `querySelector`, `querySelectorAll` como mecanismo principal de render
- `innerHTML` para dibujar tarjetas, header, footer y detalle de coche
- `createElement` para selectores, mensajes y errores
- `replaceWith` para sustituir nodos del DOM
- `window.location.href` para navegar manualmente
- `document.dispatchEvent("site:ready")` y `document.dispatchEvent("auth:ready")` para coordinar inicializacion
- `localStorage` leido desde componentes de UI para sesion y cache de usuarios
- validaciones acopladas a clases CSS y nodos creados al vuelo

Reemplazo Angular:

- Template binding
- Directivas estructurales
- Formularios reactivos
- `Router` de Angular
- Servicios de sesion, auth, company y catalogo
- Estado de formulario y mensajes manejados desde el componente

### Scripts de ensamblado o render por pagina

Estos scripts deben desaparecer como scripts sueltos y convertirse en logica de componentes/servicios:

- `main.js`
- `reservation.js`
- `carData.js`
- `information.js`
- `contact.js`
- `paymentGateway.js`
- `auth.js`
- `authContent.js`
- `header.js`
- `footer.js`
- `site.js`

Destino recomendado:

- Logica de API: servicios Angular
- Logica de adaptacion de datos: mappers o facades
- Logica de presentacion: componentes Angular
- Validacion de formularios: `ReactiveFormsModule`
- Sesion: `AuthService` o `SessionService`

### Riesgos detectados en la logica actual

- `carData.js` no reutiliza `api.js` y usa un `BASE_URL` hardcodeado distinto del resto.
- `paymentGateway.js` busca `carId` en query string, pero `main.js` y `reservation.js` enlazan a `carData.html?id=...`; hoy no hay continuidad real de seleccion al pago.
- `site.js` intenta inicializar limites con `#reservation-start-date` y `#reservation-end-date`, pero `reservation.js` nunca crea esos ids.
- `information.js` depende de que primero se inserte `cards.html` por include; esto es un acoplamiento artificial que Angular elimina.
- `header.js` no consume `company` real; usa `const company = {}` y solo deja fallback.
- `users` se persiste a la vez en API y `localStorage`, lo que duplicara fuentes de verdad durante la migracion si no se corrige.

## 1.4 Auditoria del modelo de datos actual

Entidad y uso real encontrado en `db.json` y scripts:

| Entidad | Existe en `db.json` | Consumida por scripts actuales | Uso actual |
| --- | --- | --- | --- |
| `company` | Si | `footer.js`, `information.js`, `contact.js`, `paymentGateway.js` | Datos corporativos, branding, contacto, copies e iconos mobile |
| `cars` | Si | `main.js`, `reservation.js`, `carData.js`, `paymentGateway.js` | Catalogo, destacados, listado, detalle y resumen de reserva |
| `users` | Si | `auth.js`, `api.js` | Registro, login y recuperacion basica |
| `auth` | Si | `authContent.js` | Configuracion declarativa del formulario `auth-card` |
| `locations` | Si | `reservation.js`, `information.js`, `api.js` | Filtros de reserva y resumen de localizaciones |
| `categories` | Si | `reservation.js`, `carData.js` | Clasificacion de coches |
| `paymentMethods` | Si | `paymentGateway.js` | Metodos de pago habilitados |
| `contactMessages` | Si | `contact.js` | Persistencia de formularios de contacto |
| `faqs` | Si | `faq.js` | Pagina FAQ fuera del alcance principal de esta fase |
| `reservations` | Si | No de forma completa | Reserva de ejemplo; aun no existe flujo real de escritura desde UI |

Interfaces Angular recomendadas:

```ts
export interface Company {
  id: number;
  name: string;
  tagline: string;
  about: string;
  aboutImage: string;
  history: string;
  historyImage: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  locationImage: string;
  schedule: string;
  mobileIcons: CompanyMobileIcons;
}

export interface CompanyMobileIcons {
  home: string;
  info: string;
  reservation: string;
  contact: string;
  profile: string;
}

export interface Location {
  id: string;
  name: string;
  Island: string;
  isAirport: boolean;
}

export interface Category {
  id: string;
  name: string;
  label: string;
  description: string;
}

export interface Car {
  id: string;
  slug: string;
  brand: string;
  model: string;
  fullName: string;
  featured?: boolean;
  categoryId: string;
  locationIds: string[];
  pricePerDay: number;
  priceText: string;
  transmission: string;
  fuel: string;
  seats: number;
  airConditioning: boolean;
  luggage: number;
  image: string;
  shortDescription: string;
  description: string;
  conditions: string;
}

export interface User {
  id: string;
  username: string;
  usernameNorm: string;
  email: string;
  emailNorm: string;
  password: string;
}

export interface AuthFieldConfig {
  key: string;
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  autocomplete: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  clearLabel: string;
}

export interface AuthLinkConfig {
  text: string;
  href: string;
}

export interface AuthScreenConfig {
  title: string;
  description?: string;
  formId: string;
  fields: AuthFieldConfig[];
  checkText?: string;
  submitText: string;
  links?: {
    primary?: AuthLinkConfig;
    secondary?: AuthLinkConfig;
  };
  backLink?: AuthLinkConfig;
}

export interface AuthConfig {
  login: AuthScreenConfig;
  register: AuthScreenConfig;
  recovery: AuthScreenConfig;
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
}

export interface ContactMessage {
  id?: string;
  name: string;
  surname: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  carId: number;
  pickupLocationId: number;
  returnLocationId: number;
  startDate: string;
  endDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  extraIds: number[];
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
}
```

Observaciones de modelo:

- Hay inconsistencia de tipos entre entidades relacionadas: `cars.id`, `categories.id` y `locations.id` vienen como string, pero `reservations.carId`, `pickupLocationId` y `returnLocationId` aparecen como number.
- La propiedad `Location.Island` llega con mayuscula inicial; conviene normalizarla a `island` en la capa Angular o mantener mapping explicito.
- `auth` no es una entidad de negocio, pero si una fuente real de configuracion y merece interfaz propia.
- `reservations` ya existe en datos aunque el frontend actual casi no la aprovecha; conviene incorporarla desde el principio al diseño de modelos.

## Conclusion operativa

La migracion a Angular debe partir de dos decisiones fuertes:

1. Todas las paginas listadas pasan a ser rutas Angular.
2. Todos los archivos de `Web/Template` pasan a ser componentes Angular reutilizables sin rediseño visual.

La deuda principal no esta en el CSS ni en el HTML base, sino en el ensamblado por fragmentos y en el render imperativo por script. Eso es exactamente la parte que Angular debe sustituir por componentes, routing, servicios y formularios reactivos.
