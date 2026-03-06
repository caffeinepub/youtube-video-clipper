/**
 * useCustomRoles — stores Tester/Mod/Helper role assignments in a backend
 * ContentEntry so they persist across devices and sessions.
 *
 * The entry is stored under the reserved title "__beast_custom_roles__" and
 * its body is a JSON object mapping principal strings to custom role strings.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CustomRole } from "../utils/customRoles";
import { useActor } from "./useActor";

const ENTRY_TITLE = "__beast_custom_roles__";
const QUERY_KEY = ["customRolesEntry"];

export function useCustomRolesMap(): Record<string, CustomRole> {
  const { actor, isFetching } = useActor();
  const { data } = useQuery<Record<string, CustomRole>>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      if (!actor) return {};
      const entries = await actor.getContentEntries();
      const entry = entries.find((e) => e.title === ENTRY_TITLE);
      if (!entry) return {};
      try {
        return JSON.parse(entry.body) as Record<string, CustomRole>;
      } catch {
        return {};
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
  return data ?? {};
}

export function useSetCustomRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      principalStr,
      role,
    }: { principalStr: string; role: CustomRole | null }) => {
      if (!actor) throw new Error("Actor not available");

      // Fetch current map
      const entries = await actor.getContentEntries();
      const entry = entries.find((e) => e.title === ENTRY_TITLE);

      let map: Record<string, CustomRole> = {};
      if (entry) {
        try {
          map = JSON.parse(entry.body) as Record<string, CustomRole>;
        } catch {
          map = {};
        }
      }

      // Apply change
      if (role === null) {
        delete map[principalStr];
      } else {
        map[principalStr] = role;
      }

      const body = JSON.stringify(map);

      if (entry) {
        await actor.updateContentEntry(entry.id, ENTRY_TITLE, body);
      } else {
        await actor.createContentEntry(ENTRY_TITLE, body);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err) => {
      console.error("[useSetCustomRole] failed:", err);
    },
  });
}
