import type { APIRoute } from "astro";
import { getAllCategoryList, getAllTagList, getNoteCategoryList, getNoteTagList, getCategoryList, getTagList } from "../../utils/content-utils";

export const GET: APIRoute = async ({ request, url }) => {
  // In some dev setups, the provided `url` may not carry searchParams reliably.
  // Always parse from the raw request URL to be safe.
  const reqUrl = new URL(request.url);
  const scope = (reqUrl.searchParams.get('scope') || 'posts') as 'posts' | 'notes' | 'all';
  const lang = reqUrl.searchParams.get('lang') || undefined;

  let categories, tags;
  if (scope === 'notes') {
    categories = await getNoteCategoryList(lang);
    tags = await getNoteTagList(lang);
  } else if (scope === 'all') {
    categories = await getAllCategoryList(lang);
    tags = await getAllTagList(lang);
  } else {
    categories = await getCategoryList(lang);
    tags = await getTagList(lang);
  }

  return new Response(
    JSON.stringify({ categories, tags, meta: { scope, lang } }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
