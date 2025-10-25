export const parseMaybeJsonArray = (v: unknown): string[] => {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === "string") {
    const s = v.trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        return JSON.parse(s);
      } catch {
        return [];
      }
    }
  }
  return [];
};
