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
      logo: { src: "./src/site/assets/lotus.svg", replacesTitle: false },
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
            { label: "Sigils", slug: "identity/sigils" },
            { label: "Artwork & worlds", slug: "identity/artwork-worlds" },
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
          items: [
            { label: "Statstrade", slug: "case-studies/statstrade" },
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
        { tag: "meta", attrs: { property: "og:image", content: "https://oss.greenways.ai/visual-language/assets/og-visual-language.png" } },
        { tag: "meta", attrs: { property: "og:image:alt", content: "The purple three-petal Visual Language lotus over a Greenways mosaic world" } },
        { tag: "meta", attrs: { name: "twitter:image", content: "https://oss.greenways.ai/visual-language/assets/og-visual-language.png" } },
        { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
      ],
    }),
    mdx(),
  ],
});
