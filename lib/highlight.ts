import { codeToHtml } from "shiki";

/** Highlights code once on the server. Colors switch with the `.dark` class through CSS variables. */
export async function highlight(code: string, lang = "tsx") {
  return codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark-default" },
    defaultColor: false,
  });
}
