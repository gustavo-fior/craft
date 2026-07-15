export const SITE_URL = "https://craft.gustavofior.com";
export const SITE_NAME = "Craft";
export const SITE_DESCRIPTION =
  "A small collection of design engineering concepts.";
export const GITHUB_REPO = "gustavo-fior/craft";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

export function githubSourceUrl(sourcePath?: string) {
  if (!sourcePath) return GITHUB_URL;
  return `${GITHUB_URL}/blob/main/content/${sourcePath}`;
}
