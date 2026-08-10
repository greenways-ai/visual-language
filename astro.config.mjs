import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://oss.greenways.ai",
  base: "/visual-language",
  publicDir: "./public",
  vite: { build: { assetsInlineLimit: 0 } },
  integrations: [
    starlight({
      title: "Visual Language",
      description: "The shared mosaic identity, adaptive themes, and interface system for Greenways worlds.",
      components: {
        Header: "./src/site/components/SharedSiteHeader.astro",
        ThemeProvider: "./src/site/components/GreenwaysThemeProvider.astro",
        ThemeSelect: "./src/site/components/GreenwaysThemeSelect.astro",
      },
      logo: { src: "./src/site/assets/peacock-feather.svg", replacesTitle: false },
      favicon: "/visual-language/favicon.svg",
      customCss: [
        "./src/site/styles/custom.css",
        "./src/site/styles/starlight-shell.css",
        "./src/site/styles/site-overrides.css",
      ],
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/greenways-ai/visual-language" },
      ],
      editLink: {
        baseUrl: "https://github.com/greenways-ai/visual-language/edit/main/",
      },
      lastUpdated: true,
      pagefind: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      sidebar: [
        { label: "Overview", slug: "index" },
        {
          label: "Foundations",
          items: [
            { label: "Principles", slug: "foundations/principles" },
            { label: "Colour & material", slug: "foundations/colour-material" },
            { label: "Typography", slug: "foundations/typography" },
            { label: "Mosaic construction", slug: "foundations/mosaic-construction" },
          ],
        },
        {
          label: "Identity",
          items: [
            { label: "Greenways master mark", slug: "identity/greenways-master-mark" },
            { label: "Sigils", slug: "identity/sigils" },
            { label: "3D mark system", slug: "identity/3d-marks" },
            { label: "3D Mark Lab", slug: "identity/3d-mark-lab" },
            { label: "Artwork & worlds", slug: "identity/artwork-worlds" },
            { label: "Concept pages ↗", link: "/concepts/" },
            { label: "Day & night", slug: "identity/day-night" },
          ],
        },
        {
          label: "Components",
          items: [
            { label: "Shared structure", slug: "components/shared-structure" },
            { label: "Documentation shell", slug: "components/documentation" },
            { label: "Search & theme", slug: "components/search-theme" },
          ],
        },
        {
          label: "Adoption",
          items: [
            { label: "Getting started", slug: "adoption/getting-started" },
            { label: "Project integration", slug: "adoption/project-integration" },
            { label: "Asset generation", slug: "adoption/assets" },
            { label: "Visual integrity", slug: "adoption/visual-integrity" },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "Package exports", slug: "reference/package" },
            { label: "Generators", slug: "reference/generators" },
            { label: "Theme tokens", slug: "reference/theme-tokens" },
            { label: "Brand assets", slug: "reference/brand-assets" },
          ],
        },
        {
          label: "Case studies",
          collapsed: false,
          items: [
            { label: "Overview", slug: "case-studies" },
            { label: "Statstrade", slug: "case-studies/statstrade" },
            { label: "Greenways.ai world", slug: "case-studies/greenways-world" },
          ],
        },
        {
          label: "Project",
          items: [
            { label: "Contributing", slug: "project/contributing" },
            { label: "Source ↗", link: "https://github.com/greenways-ai/visual-language" },
            { label: "Greenways OSS ↗", link: "https://oss.greenways.ai/" },
          ],
        },
      ],
      head: [
        { tag: "meta", attrs: { property: "og:image", content: "https://oss.greenways.ai/visual-language/assets/og-visual-language.jpg" } },
        { tag: "meta", attrs: { property: "og:image:secure_url", content: "https://oss.greenways.ai/visual-language/assets/og-visual-language.jpg" } },
        { tag: "meta", attrs: { property: "og:image:type", content: "image/jpeg" } },
        { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
        { tag: "meta", attrs: { property: "og:image:alt", content: "The Greenways peacock feather over an emerald, turquoise and sapphire mosaic world" } },
        { tag: "meta", attrs: { name: "twitter:image", content: "https://oss.greenways.ai/visual-language/assets/og-visual-language.jpg" } },
        { tag: "meta", attrs: { name: "twitter:image:alt", content: "The Greenways peacock feather over an emerald, turquoise and sapphire mosaic world" } },
        { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
      ],
    }),
    mdx(),
  ],
});
