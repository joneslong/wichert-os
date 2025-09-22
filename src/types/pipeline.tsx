export type PipelineStage = "lead" | "contacted" | "negotiation" | "customer";

export interface PipelineItem {
  id: string;                // uuid
  title: string;             // z.B. Firmenname + Kurznotiz
  contactId?: string;        // optional: Verknüpfung zu Kontakt
  value?: number;            // optional: Deal-Wert
  stage: PipelineStage;
  order: number;             // Sortierreihenfolge je Spalte
  notes?: string;
  createdAt: number;
  updatedAt: number;
}
