import { visit } from "unist-util-visit";

/**
 * Rehype plugin to handle relative links within the site
 * Converts relative markdown links to proper Astro URLs
 */
export function rehypeRelativeLinks() {
  return (tree) => {
    visit(tree, "element", (node) => {
      // Handle anchor tags with href attributes
      if (node.tagName === "a" && node.properties && node.properties.href) {
        const href = node.properties.href;

        // Check if it's a relative link (doesn't start with http, https, mailto, #, etc.)
        if (
          typeof href === "string" &&
          !href.startsWith("http") &&
          !href.startsWith("https") &&
          !href.startsWith("mailto:") &&
          !href.startsWith("tel:") &&
          !href.startsWith("#") &&
          !href.startsWith("//")
        ) {
          // Convert relative paths to site-relative paths
          let newHref = href;

          // If it starts with ./ or ../, convert to absolute path
          if (href.startsWith("./")) {
            newHref = href.substring(2);
          } else if (href.startsWith("../")) {
            // Handle parent directory references
            newHref = href;
          } else if (!href.startsWith("/")) {
            // If it's a relative path without leading slash, add one
            newHref = "/" + href;
          }

          // Update the href property
          node.properties.href = newHref;

          // Add a class to identify internal links
          if (node.properties.className) {
            if (Array.isArray(node.properties.className)) {
              node.properties.className.push("internal-link");
            } else {
              node.properties.className = [
                node.properties.className,
                "internal-link",
              ];
            }
          } else {
            node.properties.className = ["internal-link"];
          }
        }
      }
    });
  };
}
