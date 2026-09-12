import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  Payload,
} from "payload";

/**
 * On-demand revalidation of the homepage.
 *
 * The homepage (`/`) is statically prerendered (fast TTFB) with a long ISR
 * fallback. These hooks invalidate that cache entry every time content is saved
 * in /admin, so CMS edits appear immediately without disabling caching globally.
 *
 * `revalidatePath` only works inside the Next.js request context (the /api
 * route handler that Payload's admin uses). Outside it — e.g. during `seed`
 * or CLI migrations — it throws; we swallow that so those flows keep working.
 */
function revalidateHome(payload?: Payload) {
  try {
    revalidatePath("/");
    payload?.logger?.info?.("Revalidated homepage (/) after CMS change");
  } catch {
    // No Next.js request context (seed / migrate / CLI). Safe to ignore.
  }
}

/** For globals (Hero, About, Publication, Skills, Contact, Site). */
export const revalidateHomeAfterGlobalChange: GlobalAfterChangeHook = ({
  doc,
  req,
  context,
}) => {
  if (!context?.disableRevalidate) revalidateHome(req?.payload);
  return doc;
};

/** For collections shown on the homepage (create / update). */
export const revalidateHomeAfterChange: CollectionAfterChangeHook = ({
  doc,
  req,
  context,
}) => {
  if (!context?.disableRevalidate) revalidateHome(req?.payload);
  return doc;
};

/** For collections shown on the homepage (delete). */
export const revalidateHomeAfterDelete: CollectionAfterDeleteHook = ({
  doc,
  req,
  context,
}) => {
  if (!context?.disableRevalidate) revalidateHome(req?.payload);
  return doc;
};
