export type Product = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  currency: string
  features: string[]
}

export const products: Product[] = [
  {
    id: "1",
    slug: "focus-system-pro",
    name: "Focus System Pro",
    description:
      "A structured deep-work operating system designed to eliminate distractions and maximize cognitive output.",
    price: 49,
    currency: "USD",
    features: [
      "Deep Work Framework",
      "Task Execution Protocol",
      "Daily Focus Template",
      "Cognitive Reset System"
    ]
  },
  {
    id: "2",
    slug: "ai-productivity-pack",
    name: "AI Productivity Pack",
    description:
      "A premium collection of AI prompts engineered for creators, founders, and operators.",
    price: 79,
    currency: "USD",
    features: [
      "300+ AI Prompts",
      "Content Systems",
      "Business Automation Prompts",
      "Decision-Making Framework"
    ]
  }
]

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug)
}