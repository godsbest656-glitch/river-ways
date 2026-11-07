import { buildProjectCollection } from "../src/portfolio/schema.js";
import { projectRecords } from "../src/portfolio/projects.js";

const result = buildProjectCollection(projectRecords, { requirePublishable: true });

if (result.errors.length) {
  for (const error of result.errors) {
    process.stderr.write("Project " + (error.slug || error.id || "#" + error.index) + ": " + error.issues.join("; ") + "\n");
  }
  process.exitCode = 1;
} else if (!result.projects.length) {
  process.stderr.write("Portfolio validation found no project records.\n");
  process.exitCode = 1;
} else {
  process.stdout.write("Validated " + result.projects.length + " public project records.\n");
}
