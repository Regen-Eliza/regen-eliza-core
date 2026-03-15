import type { FundedProject } from "../services/donationService";

/**
 * Utility to generate a conversational report based on the funded projects.
 */
export function generateFundingReport(projects: FundedProject[]): string {
  if (!projects || projects.length === 0) {
    return "I attempted to route funds, but no valid projects were selected.";
  }

  if (projects.length === 1) {
    const project = projects[0];
    return `Payment successful. I just routed funds to ${project.name}, a project described as: ${project.description}.`;
  }

  if (projects.length === 2) {
    const [p1, p2] = projects;
    return `Payment successful. I just routed funds to two projects. First, ${p1.name}, doing: ${p1.description} Second, ${p2.name}, described as: ${p2.description}`;
  }

  // Handle 3 or more projects
  let report = `Payment successful. I distributed funds across ${projects.length} projects. `;
  projects.forEach((p, index) => {
    report += `${index + 1}: ${p.name}, known for ${p.description} `;
  });

  return report.trim();
}
