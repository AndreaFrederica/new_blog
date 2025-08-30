import type { APIRoute } from "astro";
import { getAllCategoryList, getAllTagList, getNoteCategoryList, getNoteTagList, getCategoryList, getTagList } from "../../utils/content-utils";

export const GET: APIRoute = async ({ url }) => {
  const scope = (url.searchParams.get('scope') || 'posts') as 'posts' | 'notes' | 'all';
  const lang = url.searchParams.get('lang') || undefined;

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
    JSON.stringify({ categories, tags }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

