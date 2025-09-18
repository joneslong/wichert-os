# Wichert OS (Prototype)

🚀 **Wichert OS** ist ein persönliches Organisationssystem, gebaut mit  
[Tauri](https://tauri.app), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/) und [Dexie.js](https://dexie.org/) (IndexedDB).

Das Ziel: **Ein modulares Dashboard, das Familie, Alltag und Selbstständigkeit in einer App bündelt.**  
Alles organisiert an einem Ort – To-Dos, Projekte, Kontakte, CRM, Automationen.

---

## ✨ Features (aktueller Stand)

- 📋 **Tasks**: Aufgaben mit Fälligkeitsdatum, Prio, Status (offen, in Arbeit, dringlich, erledigt).  
- 🗂️ **Projekte & Kategorien**: z. B. „Familie & Alltag“ (mit Unterpunkten Helen, Jonas, Lotte, Malte) oder „Selbstständigkeit“.  
- 👥 **Kontakte**: Verknüpfbar mit Aufgaben (z. B. Leads im CRM oder Familienmitglieder).  
- 📊 **Dashboard mit Quick Stats**: Filter nach „Dringlich“, „In Arbeit“, „Offen“, „Alle“, „Erledigt“.  
- 🌙 **Dark/Light Mode**: Umschaltbar.  
- 💾 **Persistenz**: Speicherung in IndexedDB (Dexie).  
- 📤 **Export/Import**: JSON-Backup aller Daten.  
- ⚡ **Smart-Toggle**: Quick-Stats springen beim erneuten Klick zurück zum vorherigen Zustand.  

---

## 🔮 Geplante Features

- 📧 Gmail-Integration (E-Mails in Aufgaben umwandeln).  
- 📅 Google Calendar Connector.  
- 🔄 Automationen (z. B. Tageszusammenfassung → Blogpost, E-Mail, CRM).  
- 🖥️ Native Desktop-App mit Tauri (Windows/Mac/Linux).  
- 🔌 Modulare Architektur: neue Module leicht andocken (z. B. Finanzen, Zeiterfassung).  

---

## 🛠️ Setup (Dev)

### Voraussetzungen
- [Node.js](https://nodejs.org) (>= 18, LTS empfohlen)  
- [Rust](https://www.rust-lang.org/) (stable, MSVC-Toolchain auf Windows)  
- [Git](https://git-scm.com/)  

### Installieren & starten
```bash
git clone https://github.com/<dein-user>/wichert-os.git
cd wichert-os
npm install
npm run dev
