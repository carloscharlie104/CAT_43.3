# CAT 43.3 — Sprint 4

Aplicación de renting automotriz desarrollada con Angular, Ionic y Firebase.

En este Sprint 4 el proyecto evoluciona desde la versión web Angular del Sprint 3 hacia una aplicación híbrida móvil, incorporando Ionic, Capacitor y persistencia local mediante SQLite.

---

# Tecnologías utilizadas

* Angular
* Ionic
* Firebase Authentication
* Cloud Firestore
* SQLite
* Capacitor
* Android Studio

---

# Objetivos del Sprint 4

* Integrar Ionic sobre Angular.
* Adaptar la aplicación al entorno móvil.
* Reutilizar Firebase Authentication y Firestore del Sprint 3.
* Implementar persistencia local mediante SQLite.
* Ejecutar la aplicación como app Android mediante Capacitor.

---

# Funcionalidades principales

* Registro de usuarios con Firebase Authentication.
* Inicio de sesión mediante email y contraseña.
* Recuperación de contraseña.
* Lectura dinámica de vehículos desde Firestore.
* Pantalla de detalle de vehículo.
* Gestión de favoritos mediante SQLite local.
* Protección de rutas autenticadas.
* Ejecución Android mediante Capacitor.

---

# Instalación

Instalación de dependencias:

```bash
npm install
```

---

# Ejecución en entorno local

```bash
ng serve
```

URL local:

```text
http://localhost:4200/
```

---

# Build de la aplicación

```bash
npm run build
```

---

# Sincronización Android

```bash
npx cap sync android
```

---

# Apertura del proyecto Android

```bash
npx cap open android
```

Desde Android Studio la aplicación puede ejecutarse en:

* emulador Android
* dispositivo físico Android

---

# GitHub

Repositorio:

```text
https://github.com/carloscharlie104/CAT_43.3/tree/sprint4
```
