export interface TagDocumentLike {
  id: string;
  data: {
    label: string;
    slug: string;
    description?: string;
    active?: boolean;
    replacement?: string;
    aliases: string[];
  };
}

export interface ResolvedTag {
  id: string;
  label: string;
  slug: string;
  description?: string;
  active: boolean;
  replacementId?: string;
  aliases: string[];
  href: string;
}

export interface StoredTagReference {
  tag: string;
}

const tagReferencePrefix = "src/content/tags/";

export const tagHref = (slug: string) => `/tags/${slug}/`;

export const tagReferenceId = (reference: string | StoredTagReference) =>
  (typeof reference === "string" ? reference : reference.tag)
    .replaceAll("\\", "/")
    .replace(new RegExp(`^${tagReferencePrefix}`), "")
    .replace(/\.md$/, "")
    .toLowerCase();

export const createTagRegistry = (documents: TagDocumentLike[]) => {
  const byId = new Map<string, ResolvedTag>();
  const byRoute = new Map<string, ResolvedTag>();

  for (const document of documents) {
    const id = tagReferenceId(document.id);
    const tag: ResolvedTag = {
      id,
      label: document.data.label,
      slug: document.data.slug,
      description: document.data.description,
      active: document.data.active !== false,
      replacementId: document.data.replacement
        ? tagReferenceId(document.data.replacement)
        : undefined,
      aliases: document.data.aliases,
      href: tagHref(document.data.slug),
    };

    if (byId.has(id)) {
      throw new Error(`Duplicate topic document id: ${id}`);
    }

    byId.set(id, tag);

    for (const route of [tag.slug, ...tag.aliases]) {
      const existing = byRoute.get(route);

      if (existing) {
        throw new Error(
          `Duplicate topic route "${route}" is used by ${existing.label} and ${tag.label}.`,
        );
      }

      byRoute.set(route, tag);
    }
  }

  return { byId, byRoute };
};

export const resolveEffectiveTag = (
  tag: ResolvedTag,
  registry: ReturnType<typeof createTagRegistry>,
) => {
  let current = tag;
  const visited = new Set<string>();

  while (!current.active && current.replacementId) {
    if (visited.has(current.id)) {
      throw new Error(`Topic replacement cycle detected at ${current.label}.`);
    }
    visited.add(current.id);
    const replacement = registry.byId.get(current.replacementId);
    if (!replacement) break;
    current = replacement;
  }

  return current;
};

export const resolveTagReferences = (
  references: StoredTagReference[],
  registry: ReturnType<typeof createTagRegistry>,
  owner: string,
) => {
  const resolved = references.map((reference) => {
    const id = tagReferenceId(reference);
    const tag = registry.byId.get(id);

    if (!tag) {
      throw new Error(
        `${owner} references missing Topic document "${reference.tag}". Restore the Topic or remove the reference in Tina.`,
      );
    }

    return resolveEffectiveTag(tag, registry);
  });

  return [...new Map(resolved.map((tag) => [tag.id, tag])).values()];
};
