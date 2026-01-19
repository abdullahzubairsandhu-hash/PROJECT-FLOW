// components/dashboard/global-search.tsx

"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { getGlobalSearchResults } from "@/app/actions/search-actions";
import { useRouter } from "next/navigation";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<{
    projects: { id: string; name: string }[];
    tasks: { id: string; title: string; projectId: string }[];
    members: { id: string; firstName: string | null; lastName: string | null; email: string }[];
  }>({
    projects: [],
    tasks: [],
    members: []
  });
  const router = useRouter();

  // Handle keyboard shortcut CMD+K or CTRL+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch results when typing
  React.useEffect(() => {
    const search = async () => {
      if (query.length > 1) {
        const data = await getGlobalSearchResults(query);
        setResults(data);
      }
    };
    search();
  }, [query]);

  const onSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-zinc-500 hover:text-zinc-300 bg-white/5 border border-white/10 rounded-lg transition-all w-64"
      >
        <Search size={14} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Search System...</span>
        <kbd className="ml-auto text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded border border-white/10 font-mono">⌘K</kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Global Search</DialogTitle>
        <CommandInput 
          placeholder="Type to search projects, tasks, or users..." 
          onValueChange={setQuery}
        />
        <CommandList className="bg-zinc-950 border-t border-white/5">
          <CommandEmpty>No results found for &quot;{query}&quot;.</CommandEmpty>
          
          {results.projects.length > 0 && (
            <CommandGroup heading="Projects">
              {results.projects.map((p) => (
                <CommandItem key={p.id} onSelect={() => onSelect(`/projects/${p.id}`)}>
                  {p.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results.tasks.length > 0 && (
            <CommandGroup heading="Tasks">
              {results.tasks.map((t) => (
                <CommandItem key={t.id} onSelect={() => onSelect(`/projects/${t.projectId}/tasks/${t.id}`)}>
                  {t.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results.members.length > 0 && (
            <CommandGroup heading="Members">
              {results.members.map((m) => (
                <CommandItem key={m.id} onSelect={() => onSelect(`/members`)}>
                  {m.firstName || m.email}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}