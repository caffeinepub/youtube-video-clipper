import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Link2 } from "lucide-react";
import React from "react";
import type { AdminLink } from "../backend";
import { useActor } from "../hooks/useActor";

export default function PinnedLinks() {
  const { actor, isFetching: actorFetching } = useActor();

  const { data: links = [] } = useQuery<AdminLink[]>({
    queryKey: ["adminLinks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminLinks();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
  });

  if (links.length === 0) return null;

  return (
    <div className="glass-card p-3 space-y-2" data-ocid="pinned-links.card">
      <div className="flex items-center gap-2 mb-1">
        <Link2 className="w-3.5 h-3.5 text-primary" />
        <span className="text-white text-xs font-semibold">Pinned Links</span>
      </div>
      <div className="space-y-1">
        {links.map((link, idx) => (
          <a
            key={String(link.id)}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors py-1 px-2 rounded-lg hover:bg-primary/5 group"
            data-ocid={`pinned-links.link.${idx + 1}`}
          >
            <ExternalLink className="w-3 h-3 flex-shrink-0 group-hover:text-primary" />
            <span className="truncate">{link.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
