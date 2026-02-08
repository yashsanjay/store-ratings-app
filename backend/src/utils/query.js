export function parseSort(sortBy, sortOrder, allowed) {
  const by = allowed.includes(sortBy) ? sortBy : allowed[0];
  const order = sortOrder === "desc" ? "desc" : "asc";
  return { by, order };
}

export function containsInsensitive(value) {
  if (!value) return undefined;
  return { contains: value, mode: "insensitive" };
}
