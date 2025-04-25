import { NavItem } from "@/types/nav";

interface SiteConfig {
  name: string;
  description: string;
  mainNav: NavItem[];
  links: {
    twitter: string;
    github: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "DiagramGPT",
  description: "Draw diagram with nature language.",
  mainNav: [
    {
      title: "Mermaid AI",
      href: "/",
    },
    {
      title: "UML AI",
      href: "/uml",
    },
  ],
  links: {
    twitter: "https://twitter.com/fraserxu",
    github: "https://github.com/fraserxu/diagram-gpt",
  },
};
