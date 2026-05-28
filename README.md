# 📚 Frontend — Sistema de Gestión de Biblioteca

Aplicación web desarrollada con **Angular** como interfaz de usuario para el sistema de gestión de biblioteca universitaria. Permite administrar autores, materiales bibliográficos (libros, revistas, periódicos), usuarios, préstamos, reservas y sanciones.

---

## 🎬 Video demostrativo

> 📹 **[[Video Demostrativo Despliegue del Front-End](https://drive.google.com/file/d/1VxZSQ4QL_ATbEoJY2MNw2J6y4ZL87Upi/view?usp=sharing)]**

---

## 👥 Autores

| Nombre |
|---|
| Cristóbal Mejía Monsalve |
| Yulieth Tatiana Muñoz |
| Sebastián Hernando Torres Cárdenas |

---

## 🛠️ Tecnologías utilizadas

- **Angular** (standalone components, signals)
- **TypeScript**
- **SCSS**
- **Angular Router**

---

## 📁 Estructura del proyecto

```
web/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   ├── autor.service.ts
│   │   │   │   ├── libro.service.ts
│   │   │   │   ├── periodico.service.ts
│   │   │   │   ├── prestamo.service.ts
│   │   │   │   ├── reserva.service.ts
│   │   │   │   ├── revista.service.ts
│   │   │   │   ├── sancion.service.ts
│   │   │   │   ├── usuario.service.ts
│   │   │   │   └── audit-context.service.ts
│   │   │   └── audit-user.guard.ts
│   │   ├── features/
│   │   │   ├── autores/
│   │   │   ├── libros/
│   │   │   ├── login/
│   │   │   ├── periodicos/
│   │   │   ├── prestamos/
│   │   │   ├── reservas/
│   │   │   ├── revistas/
│   │   │   ├── sanciones/
│   │   │   ├── shell/
│   │   │   └── usuarios/
│   │   ├── models/
│   │   │   ├── autor.models.ts
│   │   │   ├── libro.models.ts
│   │   │   ├── periodico.models.ts
│   │   │   ├── prestamo.models.ts
│   │   │   ├── reserva.models.ts
│   │   │   ├── revista.models.ts
│   │   │   ├── sancion.models.ts
│   │   │   └── usuario.models.ts
│   │   ├── shared/
│   │   │   └── ids.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── app.html
│   │   ├── app.scss
│   │   └── app.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
└── package.json
```

---

## ⚙️ Instalación y ejecución

### Prerrequisitos

- Node.js >= 18
- npm >= 9
- Angular CLI (`npm install -g @angular/cli`)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <https://github.com/sebastiant01/FrontEnd-Sistema-de-Biblioteca.git>
cd <FrontEnd-Sistema-de-Biblioteca>/web

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
ng serve
```

La aplicación estará disponible en `http://localhost:4200`.

### Construcción para producción

```bash
ng build --configuration production
```

---

## 🔗 Backend

Este frontend consume la API REST del proyecto **BackEnd-Sistema-De-Biblioteca**, construido con FastAPI y PostgreSQL. Asegúrate de tener el backend en ejecución antes de usar la aplicación.

---