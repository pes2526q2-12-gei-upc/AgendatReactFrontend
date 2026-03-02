# Agendat - Backoffice Frontend

Aquest repositori conté el **panell d'administració web** desenvolupat amb **React** i **Vite**. Aquesta aplicació permet la gestió integral de dades i usuaris del sistema des del navegador.

Autors:

- Jordi Abelló --- jordi.abello.sunyer@estudiantat.upc.edu
- Àngela Buxó --- angela.buxo@estudiantat.upc.edu
- Noel Freire --- noel.freire@estudiantat.upc.edu
- Sergi Galan --- sergi.galan.soler@estudiantat.upc.edu
- Paula Mas --- paula.mas.pascual@estudiantat.upc.edu
- Pol Montanera --- pol.montanera@estudiantat.upc.edu
- Víctor Rocha --- victor.rocha@estudiantat.upc.edu

---

## 📋 Requisits Previs

### 1. Node.js (Motor de JS)

- Descarrega la versió **LTS** a [nodejs.org](https://nodejs.org/).
- Comprova la instal·lació: `node -v` i `npm -v`.

### 2. Python (Gestor de Qualitat)

- Necessari per executar les eines de `pre-commit`.
- Descarrega l'instal·lador oficial a [Python.org](https://www.python.org/downloads/).
- **Molt important:** Activa la casella **"Add Python to PATH"** durant la instal·lació.

---

## 🛠️ Configuració del Projecte

1. **Instal·la les dependències de Node:**
   ```bash
   npm install
   ```
2. **Instal·la l'eina de pre-commit:**
   ```bash
   pip install pre-commit
   ```
3. **Activa els hooks al repositori:**
   ```Bash
   pre-commit install
   ```
4. **Execució en desenvolupament:**
   ```bash
   npm run dev
   ```

---

## 🛡️ Control de Qualitat i CI/CD

### Local (Pre-commit)

Cada vegada que facis un `git commit`, s'executaran automàticament:

- **Prettier:** Formata el codi
- **ESLint:** Busca errors de sintaxi i estil.
- **Jest:** Executa els tests unitaris.

### Al núvol (GitHub Actions + SonarCloud)

Quan s'obre un `Pull Request`, es dispara una pipeline automàtica:

1. **Tests:** S'executen tots els tests de la carpeta `__tests__/`. Si algun falla, el procés s'atura.

2. **SonarCloud:** Si els tests passen, s'analitza el codi per detectar bugs i vulnerabilitats.

**Atenció:** No es pot fer merge de cap codi que no passi els tests o que no compleixi el Quality Gate de SonarCloud.

---

## 📁 Estructura del Projecte (Resum)

- `src/`: Codi font de l'aplicació.

- `__tests__/`: Suite de tests de Jest.

- `public/`: Assets estàtics (imatges, favicon).
