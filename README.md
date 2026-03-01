# Agendat-react-frontend

Autors:
* Jordi Abelló --- jordi.abello.sunyer@estudiantat.upc.edu
* Àngela Buxó --- angela.buxo@estudiantat.upc.edu
* Noel Freire --- noel.freire@estudiantat.upc.edu
* Sergi Galan --- sergi.galan.soler@estudiantat.upc.edu
* Paula Mas --- paula.mas.pascual@estudiantat.upc.edu
* Pol Montanera --- pol.montanera@estudiantat.upc.edu
* Víctor Rocha --- victor.rocha@estudiantat.upc.edu

Aquest repositori conté l'aplicació mòbil desenvolupada amb **React Native**. Per mantenir la qualitat del codi i evitar errors comuns, utilitzem un sistema de **Pre-commit Hooks**.

---

## 📋 Requisits Previs

Abans de configurar el projecte, és imprescindible tenir instal·lades aquestes eines al sistema operatiu:

### 1. Node.js (Motor de JS)
* Descarrega la versió **LTS** a [nodejs.org](https://nodejs.org/).
* Verifica la instal·lació: `node -v` i `npm -v`.

### 2. Python (Gestor de Qualitat)
* **⚠️ ATENCIÓ:** No instal·lis Python des de la Microsoft Store.
* Descarrega l'instal·lador oficial a [Python.org](https://www.python.org/downloads/).
* **Molt important:** Activa la casella **"Add Python to PATH"** durant la instal·lació.
* Si ja el tens instal·lat i no et funciona, assegura't que les rutes de Python estiguin al capdamunt de les teves *Variables d'Entorn*.

### 3. Watchman (Només per a macOS)
* Executa: `brew install watchman`

---

## 🛠️ Configuració del Projecte

Segueix aquests passos per posar el teu entorn a punt:

1. **Instal·la les dependències de Node:**
   ```bash
   npm install
   ```

2. **Instal·la l'eina de pre-commit (globalment):**
   ```powershell
   pip install pre-commit
   ```

3. **Activa els hooks al repositori:**
   ```powershell
   pre-commit install
   ```

4. **Verificació manual:**
   Comprova que totes les eines funcionen correctament:
   ```powershell
   pre-commit run --all-files
   ```

---

## 🛡️ Control de Qualitat Automàtic

Cada vegada que intentis fer un `git commit`, el sistema executarà les següents eines:

| Eina | Descripció | Acció en cas de fallada |
| :--- | :--- | :--- |
| **Prettier** ✨ | Formata el codi segons l'estil del projecte. | Corregeix el format automàticament. |
| **ESLint** 🔍 | Busca errors de sintaxi i males pràctiques. | Atura el commit i demana correcció manual. |
| **Jest** 🧪 | Executa els tests unitaris i d'integració. | El commit falla si algun test no passa. |



### Com actuar si un commit falla?
1. Llegeix el missatge d'error a la terminal.
2. Si **Prettier** ha fet canvis, torna a fer `git add .` per incloure els fitxers formatats.
3. Si **ESLint** o **Jest** donen errors, corregeix el codi.
4. Torna a intentar el `git commit`.

---

## 🆘 Solució de Problemes

### El comando `pre-commit` no es reconeix
Tanca totes les instàncies de la terminal (i el VS Code) i torna-les a obrir. Si el problema persisteix, revisa que la carpeta `Scripts` de Python estigui al teu PATH de Windows.

### Saltar els controls (Emergències)
Si necessites fer un commit urgent i saps que el codi està bé malgrat un avís del linter:
```bash
git commit -m "missatge" --no-verify
```

### Arreglar el linting automàticament
Pots intentar que ESLint arregli el que pugui amb:
```bash
npm run lint -- --fix
```

---

## 📁 Estructura del Projecte (Resum)
* `android/`: Codi font de l'aplicació.
* `__tests__/`: Suite de tests de Jest.
* `.eslintrc.js`: Configuració de les regles de l'analitzador.
* `.prettierrc.js`: Configuració de l'estil de codi.
* `.pre-commit-config.yaml`: Configuració dels hooks de Git.