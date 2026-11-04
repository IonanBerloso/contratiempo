import { useEffect, useState } from "react";
export function useClaudeHook(hookName) {
  const [hookValue, setHookValue] = useState(null);
  useEffect(() => {
    let active = true;
    try {
      const claudeApi = typeof window != "undefined" ? window.claude : null;
      if (claudeApi && typeof claudeApi.use == "function") {
        claudeApi
          .use(hookName)
          .then((resolved) => active && setHookValue(resolved || null))
          .catch(() => {});
      }
    } catch {}
    return () => {
      active = false;
    };
  }, [hookName]);
  return hookValue;
}
export const slugifyFilename = (rawLabel) =>
  (rawLabel || "archivo")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "archivo";
export async function saveWithDownloads(downloads, filename, data) {
  try {
    await downloads.save({
      filename,
      data,
    });
    return "Guardado.";
  } catch (err) {
    const errorCode = err && err.code;
    return errorCode === "declined"
      ? null
      : errorCode === "rate_limited"
        ? "Ya hay una descarga esperando. Prueba en unos segundos."
        : "No se ha podido guardar el archivo aquí.";
  }
}
const MIME_BY_EXT = {
  html: "text/html;charset=utf-8",
  json: "application/json",
  txt: "text/plain;charset=utf-8",
};
// Saves a file. Inside claude.ai it goes through window.claude.use("downloads"); anywhere else it
// falls back to a Blob and an <a download> link, so every export also works outside claude.ai.
// Returns a status message for the UI, or null when the user declined.
export async function saveFile(filename, data) {
  try {
    const claudeApi = typeof window != "undefined" ? window.claude : null;
    if (claudeApi && typeof claudeApi.use == "function") {
      const downloads = await claudeApi.use("downloads").catch(() => null);
      if (downloads) return saveWithDownloads(downloads, filename, data);
    }
  } catch {}
  try {
    const ext = filename.split(".").pop().toLowerCase();
    const blob =
      data instanceof Blob
        ? data
        : new Blob([data], {
            type: MIME_BY_EXT[ext] || "application/octet-stream",
          });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 6e4);
    return "Descargado.";
  } catch {
    return "No se ha podido guardar el archivo aquí.";
  }
}
