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
