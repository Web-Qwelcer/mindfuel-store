import BuyButton from "./BuyButton"
import { notFound } from "next/navigation"
import { getProductBySlug } from "@/data/products"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = getProductBySlug(slug)

  if (!product) {
    return notFound()
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold">{product.name}</h2>
        <p className="text-zinc-400">{product.description}</p>
      </div>

      <div className="border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="text-2xl font-bold">
          ${product.price}
        </div>

        <ul className="space-y-2">
          {product.features.map((feature, index) => (
            <li key={index} className="text-zinc-300">
              • {feature}
            </li>
          ))}
        </ul>

        <BuyButton
          productId={product.id}
          productName={product.name}
          productPrice={product.price}
        />
      </div>
    </div>
  )
}