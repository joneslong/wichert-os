import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Mail } from "lucide-react";
import classNames from "classnames";
import { useToast } from "../../components/ui/Toast";





export default function GmailPanelSkeleton() {
  const [tab, setTab] = useState<"business" | "private">("business");
  const showToast = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          E-Mails (Gmail – Skeleton)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3 text-sm">
          <button
            className={classNames(
              "px-2 py-1 rounded-xl",
              tab === "business" ? "bg-neutral-200 dark:bg-neutral-700" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
            )}
            onClick={() => setTab("business")}
          >
            Geschäft
          </button>
          <button
            className={classNames(
              "px-2 py-1 rounded-xl",
              tab === "private" ? "bg-neutral-200 dark:bg-neutral-700" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
            )}
            onClick={() => setTab("private")}
          >
            Privat
          </button>
        </div>

        <div className="text-sm opacity-80">
          <p>OAuth-Verbindung noch nicht eingerichtet.</p>
          <div className="mt-2 flex gap-2">
            <Button variant="secondary">Verbinden (Platzhalter)</Button>
            <Button variant="ghost" disabled>Kontakte synchronisieren (bald)</Button>
          </div>
          <p className="mt-3">Später: Inbox anzeigen → „In Aufgabe umwandeln“ pro Thread.</p>
        </div>
      </CardContent>
    </Card>

    
  );
  showToast("E-Mail in Aufgabe umgewandelt", {
  actionLabel: "Rückgängig",
  onAction: () => { /* Aufgabe wieder entfernen */ },
});


}
