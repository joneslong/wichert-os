import React from "react";
import { Project, Category, Task } from "../../storage/db";
import { FolderKanban, Users } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Badge } from "../../components/ui/badge";

export default function ProjectTree({
  projects,
  categories,
  tasks,
  onSelect,
  onShowContacts,
}: {
  projects: Project[];
  categories: Category[];
  tasks: Task[];
  onSelect: (filter: { projectId?: string; categoryId?: string }) => void;
  onShowContacts: (projectId: string) => void;
}) {
  return (
    <ScrollArea className="h-[calc(100vh-120px)] pr-2">
      <div className="space-y-3">
        {projects.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl bg-gradient-to-r p-[1px] from-gray-200 to-gray-300"
          >
            <div className="rounded-2xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
              <div className="w-full text-left p-3 flex items-center gap-2">
                <FolderKanban className="w-4 h-4" />
                <span className="font-medium">{p.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto"
                  onClick={() => onShowContacts(p.id)}
                  title="Kontakte zeigen"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="ml-1 text-xs">Kontakte</span>
                </Button>
              </div>
              <Separator />
              <div className="py-2">
                {categories
                  .filter((c) => c.projectId === p.id)
                  .map((c) => {
                    const count = tasks.filter(
                      (t) => t.categoryId === c.id && t.status !== "done"
                    ).length;
                    return (
                      <button
                        key={c.id}
                        className="w-full px-4 py-2 text-left rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-between text-sm text-neutral-700 dark:text-neutral-200"
                        onClick={() => onSelect({ projectId: p.id, categoryId: c.id })}
                      >
                        <span>{c.name}</span>
                        {count ? (
                          <Badge variant="secondary" className="rounded-full">
                            {count}
                          </Badge>
                        ) : null}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
