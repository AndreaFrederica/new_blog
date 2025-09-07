import { getCollection } from "astro:content";

// 获取文章数据
const posts = await getCollection("posts");

// 找到我们关心的文章
const targetPost = posts.find((post) => post.slug.includes("novel-helper"));

if (targetPost) {
  console.log("找到文章:");
  console.log("slug:", targetPost.slug);
  console.log("data.slug:", targetPost.data.slug);
  console.log("data.title:", targetPost.data.title);
  console.log("id:", targetPost.id);
} else {
  console.log("没有找到包含novel-helper的文章");
  console.log("所有文章的slug:");
  posts.slice(0, 5).forEach((post) => {
    console.log(post.slug);
  });
}
