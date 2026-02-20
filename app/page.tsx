import Link from "next/link"
import { products } from "@/data/products"

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h2 className="text-4xl font-bold tracking-tight">
          Upgrade Your Cognitive Output
        </h2>
        <p className="text-zinc-400 max-w-2xl">
          Premium digital systems engineered for deep focus, structured execution,
          and AI-powered productivity.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition"
          >
            <h3 className="text-2xl font-semibold mb-2">
              {product.name}
            </h3>

            <p className="text-zinc-400 mb-4">
              {product.description}
            </p>

            <div className="text-xl font-bold mb-4">
              ${product.price}
            </div>

            <Link
              href={`/products/${product.slug}`}
              className="inline-block bg-white text-black px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
            >
              View Product
            </Link>
          </div>
        ))}
      </section>
    </div>
  )
}