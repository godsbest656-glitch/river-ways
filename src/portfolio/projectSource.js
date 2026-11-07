import { buildProjectCollection, deepFreeze } from "./schema.js";
import { selectFeatured } from "./selectors.js";

export function createProjectSource(records) {
  const collection = buildProjectCollection(records);
  const allProjects = collection.projects;
  const publicProjects = deepFreeze(allProjects.filter((project) => project.visibility === "public" && project.status === "published"));

  const source = {
    list() {
      return allProjects;
    },
    getBySlug(slug) {
      return allProjects.find((project) =>
        project.slug === slug &&
        ["public", "unlisted"].includes(project.visibility) &&
        project.status === "published"
      ) || null;
    },
    listPublic() {
      return publicProjects;
    },
    listFeatured(scope) {
      return deepFreeze(selectFeatured(publicProjects, scope));
    },
    errors: collection.errors
  };

  return deepFreeze(source);
}
