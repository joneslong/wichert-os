// src/shared/types.ts

// Segmente
export type Segment = 'arbeit' | 'familie';

// Kontakt-Status
export type KontaktStatus = 'offen' | 'inArbeit' | 'erledigt';

// Aufgaben-Kategorien (benannter Export!)
export type TaskCategory =
  | 'gartenarbeit'
  | 'it_support'
  | 'copywriting'
  | 'anruf'
  | 'email'
  | 'warte_auf_antwort';

// Notizen am Kontakt
export type KontaktNote = {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO
};

// Aufgaben am Kontakt
export type KontaktTask = {
  id: string;
  title: string;
  dueAt?: string;     // ISO optional
  status: 'open' | 'done';
  category?: TaskCategory;
};

// Pipeline-Schritte
export type PipelineStep = {
  id: string;
  label: string;     // z.B. Erstkontakt, FollowUp1, …
  date: string;      // ISO
  note?: string;
};

// Hauptobjekt: Kontakt (benannter Export!)
export interface Kontakt {
  id: string;
  name: string;
  firma?: string;
  kategorie: string;     // leads|kontaktiert|prozess|retainer|...|handwerker|aerzte|allgemein
  segment: Segment;
  status?: KontaktStatus;
  telefon?: string;
  email?: string;
  adresse?: string;
  website?: string;
  notes?: KontaktNote[];
  tasks?: KontaktTask[];
  pipeline?: PipelineStep[];
  updatedAt: string;      // ISO
}
