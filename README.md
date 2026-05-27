<div align="center">
  <img src="https://s3.eu-south-2.amazonaws.com/agendat.s3/logoAgendatNoFondo.png" alt="Logo d'Agenda't" width="140">
  <h1>Agenda't Backoffice Frontend</h1>
  <p>
    Frontend web del backoffice d'Agenda't per a organitzacions i negocis privats
    que publiquen esdeveniments, en gestionen l'estat i en consulten les mètriques.
  </p>
  <p align="center">
    <a href="https://agendat-react-frontend-dn98.vercel.app/dashboard"><strong>Link al backoffice</strong></a>
  </p>
</div>

## Què És El Backoffice

Aquest repositori conté l'aplicació web interna que fan servir les organitzacions
clients d'Agenda't. El backoffice no és l'app pública per descobrir esdeveniments,
sinó l'espai privat on una empresa o entitat pot:

- demanar accés a la plataforma
- crear i editar esdeveniments propis
- enviar esdeveniments a revisió
- arxivar o eliminar esdeveniments
- veure el rendiment de cada esdeveniment amb mètriques i sèries temporals

En conjunt, el backoffice serveix perquè els negocis puguin publicar la seva
activitat dins l'ecosistema d'Agenda't i entendre quin impacte tenen els seus
esdeveniments sobre l'audiència.

## Funcionalitats Principals

- Dashboard amb resum de l'activitat recent i dels estats de publicació
- Autenticació per a clients amb login, alta inicial de contrasenya i recuperació de compte
- Formulari de `request access` per a noves organitzacions
- Creació i edició d'esdeveniments amb dades descriptives, ubicació, dates i categories
- Flux de publicació amb estats com `draft`, `pending_review`, `published`, `rejected` i `archived`
- Vista detallada per esdeveniment amb accions de gestió
- Mètriques per esdeveniment: visualitzacions, clics a entrades, comparticions, guardats i ressenyes
- Gràfiques d'activitat diària i mitjanes de valoració

## Stack

- React 19
- Vite 7
- React Router 7
- Recharts
- ESLint
- Jest

## Connexió Amb El Backend

Aquesta aplicació consumeix els endpoints de backoffice del repositori backend
d'Agenda't, principalment sota `/api/backoffice/...`.

Per defecte, en desenvolupament es fa servir el backend de:

- `http://localhost:8080`

Si vols connectar-la a un altre entorn, crea un fitxer `.env.local` amb:

```bash
VITE_API_BASE_URL=http://nattech.fib.upc.edu:40410
```

El backend de producció és a:

- `http://nattech.fib.upc.edu:40410/`



## Posada En Marxa

### 1. Instal·la dependències

```bash
npm install
```

### 2. Arrenca el backend

Des del repositori `Agendat-backend`:

```bash
docker compose up --build -d
```

### 3. Executa el frontend

```bash
npm run dev
```

Per defecte, Vite arrencarà en local i la UI es connectarà al backend configurat.

## Scripts Disponibles

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm test
npm run test:coverage
```

## Estructura Del Projecte

- `src/app`: bootstrap, layout global i rutes
- `src/features/auth`: login, accés, activació de compte i recuperació de contrasenya
- `src/features/dashboard`: resum executiu del backoffice
- `src/features/events`: CRUD d'esdeveniments, detall, filtres i mètriques
- `src/shared`: client API i components reutilitzables
- `__tests__`: tests automatitzats

## Flux Funcional

1. Una organització demana accés al backoffice.
2. L'equip d'Agenda't valida la sol·licitud i activa el compte.
3. El client entra al backoffice i crea o actualitza esdeveniments.
4. Cada esdeveniment passa pel seu cicle de publicació (`draft`, `pending_review`, `published/rejected`, `archived`)
5. Un cop publicat, el client pot consultar mètriques d'interacció i valoracions.

## Contribucions

Si vols contribuir al projecte, treballa sobre una branca nova:

1. Fes `pull` de `develop`.
2. Crea una branca descriptiva.
3. Executa `npm install`.
4. Verifica el canvi amb `npm run lint` i `npm test`.
5. Obre una pull request amb una descripció clara del canvi.

Abans d'enviar una contribució, assegura't que:

- no hi ha secrets o credencials dins del codi o dels fitxers d'entorn
- la documentació continua reflectint el comportament real del backoffice
- el frontend continua connectant correctament amb els endpoints del backend
