import { create } from 'zustand';
import type {
  Kontakt,
  KontaktNote,
  KontaktTask,
  KontaktStatus,
  PipelineStep,
  Segment,
} from '../../shared/types';
import { nanoid } from './util/nanoid';

type Filter = {
  segment: Segment;
  categories: string[];
  query: string;
};

type CrmState = {
  contacts: Kontakt[];
  filter: Filter;

  // lifecycle
  load: () => void;

  // CRUD
  add: (data: Omit<Kontakt, 'id' | 'updatedAt'>) => void;
  update: (id: string, patch: Partial<Kontakt>) => void;
  remove: (id: string) => void;

  // quick actions
  updateStatus: (id: string, status: KontaktStatus) => void;
  addNote: (id: string, note: Omit<KontaktNote, 'id' | 'createdAt'>) => void;
  addTask: (
    id: string,
    task: Omit<KontaktTask, 'id' | 'status'> & { status?: 'open' | 'done' }
  ) => void;
  addPipeline: (id: string, step: Omit<PipelineStep, 'id'>) => void;

  // filters
  setSegment: (s: Segment) => void;
  toggleCategory: (c: string) => void;
  setQuery: (q: string) => void;

  // selectors
  filtered: () => Kontakt[];
  countsByCategory: (segment: Segment) => Record<string, number>;
};

const STORAGE_KEY = 'wos:crm:contacts';

function readStorage(): Kontakt[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as Kontakt[];
    } catch {}
  }
  const seed = seedContacts();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

function writeStorage(list: Kontakt[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ------------- PUBLIC STORE EXPORT -------------
export const useCrmStore = create<CrmState>((set, get) => ({
  contacts: [],
  filter: { segment: 'arbeit', categories: [], query: '' },

  load: () => set({ contacts: readStorage() }),

  add: (data) => {
    const c: Kontakt = {
      status: 'offen',
      notes: [],
      tasks: [],
      pipeline: [],
      ...data,
      id: nanoid(),
      updatedAt: new Date().toISOString(),
    };
    const list = [c, ...get().contacts];
    set({ contacts: list });
    writeStorage(list);
  },

  update: (id, patch) => {
    const list = get().contacts.map((c) =>
      c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c
    );
    set({ contacts: list });
    writeStorage(list);
  },

  remove: (id) => {
    const list = get().contacts.filter((c) => c.id !== id);
    set({ contacts: list });
    writeStorage(list);
  },

  updateStatus: (id, status) => {
    const list = get().contacts.map((c) =>
      c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c
    );
    set({ contacts: list });
    writeStorage(list);
  },

  addNote: (id, note) => {
    const list = get().contacts.map((c) => {
      if (c.id !== id) return c;
      const newNote: KontaktNote = {
        id: nanoid(),
        createdAt: new Date().toISOString(),
        ...note,
      };
      const notes = [newNote, ...(c.notes ?? [])];
      return { ...c, notes, updatedAt: new Date().toISOString() };
    });
    set({ contacts: list });
    writeStorage(list);
  },

  addTask: (id, task) => {
    const list = get().contacts.map((c) => {
      if (c.id !== id) return c;
      const newTask: KontaktTask = {
        id: nanoid(),
        status: task.status ?? 'open',
        title: task.title,
        dueAt: task.dueAt,
        category: task.category, // optional
      };
      const tasks = [newTask, ...(c.tasks ?? [])];
      return { ...c, tasks, updatedAt: new Date().toISOString() };
    });
    set({ contacts: list });
    writeStorage(list);
  },

  addPipeline: (id, step) => {
    const list = get().contacts.map((c) => {
      if (c.id !== id) return c;
      const newStep: PipelineStep = { id: nanoid(), ...step };
      const pipeline = [newStep, ...(c.pipeline ?? [])];
      return { ...c, pipeline, updatedAt: new Date().toISOString() };
    });
    set({ contacts: list });
    writeStorage(list);
  },

  setSegment: (s) =>
    set((state) => ({
      filter: { ...state.filter, segment: s, categories: [] },
    })),

  toggleCategory: (c) =>
    set((state) => {
      const has = state.filter.categories.includes(c);
      const categories = has
        ? state.filter.categories.filter((x) => x !== c)
        : [...state.filter.categories, c];
      return { filter: { ...state.filter, categories } };
    }),

  setQuery: (q) =>
    set((state) => ({ filter: { ...state.filter, query: q } })),

  filtered: () => {
    const { contacts, filter } = get();
    const q = filter.query.trim().toLowerCase();
    return contacts.filter(
      (c) =>
        c.segment === filter.segment &&
        (filter.categories.length
          ? filter.categories.includes(c.kategorie)
          : true) &&
        (q
          ? (c.name + ' ' + (c.firma ?? '') + ' ' + (c.email ?? ''))
              .toLowerCase()
              .includes(q)
          : true)
    );
  },

  countsByCategory: (segment) => {
    const map: Record<string, number> = {};
    for (const c of get().contacts) {
      if (c.segment !== segment) continue;
      map[c.kategorie] = (map[c.kategorie] ?? 0) + 1;
    }
    return map;
  },
}));

// ----------------- SEED -----------------
function seedContacts(): Kontakt[] {
  const now = Date.now();
  const iso = (ms: number) => new Date(now - ms).toISOString();

  const a = (
    kategorie: string,
    name: string,
    firma?: string,
    status: KontaktStatus = 'offen'
  ): Kontakt => ({
    id: nanoid(),
    name,
    firma,
    kategorie,
    segment: 'arbeit',
    status,
    updatedAt: iso(1000 * 60 * 30),
    notes: [],
    tasks: [],
    pipeline: [],
  });

  const f = (kategorie: string, name: string): Kontakt => ({
    id: nanoid(),
    name,
    kategorie,
    segment: 'familie',
    status: 'offen',
    updatedAt: iso(1000 * 60 * 60 * 5),
    notes: [],
    tasks: [],
    pipeline: [],
  });

  // Arbeit
  const c1 = a('leads', 'PV Saar GmbH', 'PV Saar', 'offen');
  c1.pipeline = [
    { id: nanoid(), label: 'Erstkontakt', date: iso(1000 * 60 * 60 * 48), note: 'Telefonat geführt' },
    { id: nanoid(), label: 'FollowUp1',   date: iso(1000 * 60 * 60 * 24), note: 'E-Mail gesendet' },
  ];
  const c2 = a('prozess', 'Solar West AG', 'Solar West', 'inArbeit');
  c2.pipeline = [
    { id: nanoid(), label: 'Erstkontakt', date: iso(1000 * 60 * 60 * 72) },
    { id: nanoid(), label: 'FollowUp1',   date: iso(1000 * 60 * 60 * 30), note: 'Angebot in Arbeit' },
  ];

  // Familie inkl. neuer Kategorien
  const fam = [
    f('freunde', 'Familie Müller'),
    f('kindergarten', 'Kita Regenbogen'),
    f('familie', 'Oma Irene'),
    f('familie', 'Jonas & Helen'),
    f('freizeit', 'Schachverein Saar'),
    f('freunde', 'Lottes Freundinnen'),
    f('handwerker', 'Sanitär Krause'),
    f('aerzte', 'Zahnarzt Dr. Weber'),
    f('allgemein', 'Nachbarn Schmidt'),
  ];

  return [
    c1,
    a('kontaktiert', 'Elektro Wuschech', 'Wuschech', 'inArbeit'),
    c2,
    a('retainer', 'Haus & Garten König', 'H&G König', 'erledigt'),
    a('leads', 'IT Service Müller', 'IT Müller', 'offen'),
    a('kontaktiert', 'Copystudio Rhein', 'Copystudio', 'offen'),
    ...fam,
  ];
}
