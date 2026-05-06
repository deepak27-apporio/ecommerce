"use client";

import { motion } from "motion/react";
import { 
  ArrowRight, 
} from "lucide-react";
import Link from "next/link";
import { useProducts } from "./hooks/useProducts";
import { getFullImageUrl } from "./utils/features";

// const PRODUCTS = [
//   {
//     id: 1,
//     tag: "Limited",
//     category: "Elite Series",
//     name: "Classic Canvas High",
//     price: 180.00,
//     image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBU9SXpJnH6zQi5mIm-Y24eoX47KHq3M3yXI4-OYwLHTFFDQ6RwOuJytmOk9llffCOIjw0vphtP_8wHjMn-uOJ7SJqBVzItBn39qHFb4_WwOLjnYWOs-UB5EIAbcXKMOxO_lU57ZBTeznH6r2vfDfeev0LhVCM-blGSDsq31U0IGF18IeCck-fCvQ2nRMDwO-UQ97wwFGVSzNBEEMbxkO6-a08q3g8CdHg9Bcgs_xZrTf3KrvvI9kFFnQJXMei1qdzCzbnEuD1cIVu6"
//   },
//   {
//     id: 2,
//     category: "Wearables",
//     name: "Elite Series 4 Watch",
//     price: 450.00,
//     image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBc5wfa4z7WWIj_I4AwMb4hVIWz1177vDeR1uJKkVsVG_KY_06NrsQYCl7YQq__0FkylPBJq_BpduS6oC53NA7B4LvhFfz777dYSxkn273IWEY3q6v7ohZlIACL8bEvC0HFNGE3BWJ2EO-2mdo3E8IIH9v_khQKtGTtJWmj3TPoASWkOCYeqKAS0-KeCjA15oq5SqwdG_SvpjkXVLE21qaJVY5c6rcJaOWznP5uyxdbcYfQF62pWN0FMGiHuLC4_uSdVFGvbPPGPuRq"
//   },
//   {
//     id: 3,
//     tag: "New",
//     category: "Accessories",
//     name: "Linear Frame Sun",
//     price: 210.00,
//     image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDk9TxvaaqFvM6Kp-VQb8lcC9fcXqrmfYcOxw0r_BmRP5ytn5BMvc9m6bYczxSPAs-ukmxFwn71VWi0--Y0TDi_sbGJxk6EqPGrT_f5LO-wSTtoIPx9GTa9sEe7WFuOFDNirT0CVtY--6fPPAhmxYRgsHR5lsMX1eQaSom6LDN7s_9M9lXK6n4TEPyJRJznrz4rfBHb95qlvpEh5ocbztgNOiANUrigbsmg2YNRF786Ry84gBV5uIKnxABMYrGnGXlfaUc_PggB-4tr"
//   },
//   {
//     id: 4,
//     category: "Living",
//     name: "Orbita Mini Speaker",
//     price: 120.00,
//     image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZthvRgTEDcBNKaoPIlJdoaenq2LqjLjO6LtlDCDAMXAbOmY2q_JDZcD450MBU2Tk4ygCO6DGZAvv1_hitI8astdR_C9Edc64llNH4_F3kEQ3yc4LD52zwm_oVLU4pGgyUBcXVyNXOBdZTiRNfulslA2wTXFZfxf4teyOglTx6RxyxJhGLA8ctRYa4lkOpca4bCt2GGQURkqnpUMBo_kg4ATnwe2Iu9fmWZi_rxyxmFat3m3hC9Q-n06E7c349P30XCJrMI2MK3Ouv"
//   }
// ];

export default function App() {
  const { products, isLoading, error, refetch } = useProducts()
  console.log(products);
  const PRODUCTS = products?.data?.slice(0, 4) || [];
  return (
    <div className="min-h-screen text-black mx-6">

      <main className="pt-10 space-y-stack-xl">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-gutter">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-surface-container-low rounded-xl overflow-hidden min-h-[600px] flex items-center"
          >
            <div className="absolute inset-0 z-0">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc5dDceW0ek3h68uFZdwsQXPZO8j3nmUXkc0r4XkLbGdLDftHupJIKgWYcGmGtUjKc5aXvVSOzn6sIKsEvdgh57BW9hmCLU7GSM_09Hs5jtS6wY2otchnDxIDW8Q6EWWNw8KhojL9iPIE0a1aD9mWc9V2zn6I9I-gI8rGPdN-3xfG2OEXnOdyejBAZTco9iJ8q4nP6K_aQAt3UWsuGzN9Q_hbkPEjQSKS6FSawpu2hjU4paX53x-LIM24FHvLPR3uyQH6HPwEDSjXO" 
                alt="Minimalist vase"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent" />
            </div>
            
            <div className="relative z-10 w-full md:w-1/2 p-12 lg:p-24">
              <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-bold tracking-[0.2em] uppercase mb-6 rounded-full">
                New Season
              </span>
              <h1 className="text-4xl lg:text-7xl font-semibold text-on-surface mb-6 leading-[1.1] tracking-tight">
                Redefining Minimalist Luxury
              </h1>
              <p className="text-lg text-secondary mb-10 max-w-md">
                Our latest curation of essential pieces focuses on pure form, exceptional materials, and a quiet confidence that elevates every space.
              </p>
              <Link href="/search">
              <div className="w-[50%] sm:flex-row gap-4 bg-black items-center">
                <button className="bg-primary text-white px-10 py-5 font-semibold text-sm hover:bg-primary-container transition-all shadow-lg shadow-primary/20">
                  Shop Collection
                </button>
              </div>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Categories Bento Grid */}
        <section className="max-w-7xl mx-auto px-gutter my-9">
          <div className="mb-stack-lg">
            <h2 className="text-3xl font-semibold text-on-surface">Curated Essentials</h2>
            <p className="text-secondary">Explore our categories designed for the modern lifestyle.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 h-auto md:h-[600px]">
            {/* Main Category */}
            <Link href="search?q=shoes" className="md:col-span-2 lg:col-span-3 relative group overflow-hidden rounded-lg bg-slate-100 h-80 md:h-full">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMilZaU2I8w22hQoUslfhJzEAfzvnVQjc8NPX5s5dE0FFOjgXR83ItW0s42r3EpUxqVHdaHZrXRbmzHRGpcsUQnRzpuh7UroORbe2dmk6fL0XszvyyhX-ldIh4czTl2nDU_aJ9gGabcIWkyUjTeoMFagfZtM_m5EouC0YDdqDXrhpHj7WGmL45FAjxmxInu-uf3JMs6lD7ZHKqnK_DkzffNYLIPgwBRBEvJ957Lll-DKP8_AAMwd-A2eKSJrlYBPsBBr4Ou3J1s5wJ" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Modern Footwear"
              />
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 transition-all" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-medium text-white mb-2">Modern Footwear</h3>
                <a href="#" className="text-white text-sm font-medium border-b border-white pb-1 inline-flex items-center gap-2 group">
                  Browse Category <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </Link>

            {/* Audio Category */}
            <Link href="search?q=headphones" className="md:col-span-2 lg:col-span-3 relative group overflow-hidden rounded-lg bg-slate-100 h-80 md:h-full">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuASsF16zFDs1vXt8_YpmnnEEYCetQWoR2Qc6vI_Dm1Lo12LlK2qiwZACjnCWp0yvkpvpEttzSq5aeHojcVMcI_a-u-jpc5IVjYeBeOExu69mBrTCJmxaHt28xaND32X3cfQKfV2oYjzb8woB5LLXNRlutR2OdEKgzzE0F7OhHPaIGXq70GH96hSVB-0lU2rRIYmbWt2Bvc67C-RTHULpN-s6kcLWJ9rScxUbo69JNf8_dkmxI1lFISX45wJ7j2ovbyGSflbevhF8NWe" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Audio Tech"
              />
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 transition-all" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-medium text-white mb-2">Audio Tech</h3>
                <a href="#" className="text-white text-sm font-medium border-b border-white pb-1 inline-flex items-center gap-2 group">
                  Browse Category <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </Link>

            {/* Sub Categories */}
            <Link href="search?q=carry" className="md:col-span-2 lg:col-span-2 relative group overflow-hidden rounded-lg bg-slate-100 h-80 md:h-full">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuApUb04-eAZS1qUsk9Ak-rYhRuAG3DiQtWWRdeioMjB0JdqbXVjvBGPPNLgSuiboCszgCwE_Ws4AvbmPx-9LwIwMKLGMulo0p-w0JzkLRp2ZqVC_ZpojhuRvcoFmImc_F_DeynLcWvdaUEjbR18mu2P0mN-Q-S6nT0ahVVw64PUxF211gzXxy_8C_XAh_zgqCSb5gWpsbILVt3yDb7jiDBGIK95Ao80NMeZZm2l8x6tSOghnvbyltdIVEVawqvUaDXnRHVUB21Gm2xg" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Carry"
              />
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 transition-all" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-xl font-medium text-white mb-1">Carry</h3>
                <a href="#" className="text-white text-xs font-medium border-b border-white pb-1 group inline-flex items-center gap-2">
                  Explore <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </Link>

            <Link href="search" className="md:col-span-2 lg:col-span-4 relative group overflow-hidden rounded-lg bg-slate-100 h-80 md:h-full">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5r9CeZ740TwkFJbcx05ASZXJrO1dP3afJsXrMTR3cyh0IW5qSFUfmWfLwQn8TZTc58IMJz4L7KE0mIn-2p2f0eLprv3AhskRYv87XcnCussAUNdkCve6DCe5X_3Y2wjxGIZdYIXuahTuyD9GgNEn0fnQEaQYDZ6aTXJb-4XHbH7fTPHl_QPlYPGdHhUMQP9Wh8WCPsm56sNrYTSiDRMyn-qxjrgzN8UpgKRjFql0jjZSbmTVM-p0W2oCFFax8EDrYLToEIGHIs92Y" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Connected Life"
              />
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 transition-all" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-xl font-medium text-white mb-1">All Products</h3>
                <a href="#" className="text-white text-xs font-medium border-b border-white pb-1 group inline-flex items-center gap-2">
                  Explore <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-gutter pb-12 my-9">
          <div className="flex justify-between items-center mb-stack-lg">
            <h2 className="text-3xl font-semibold text-on-surface">Trending Now</h2>
            <Link href="/search" className="text-sm font-medium text-primary hover:underline transition-all">View All Products</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-gutter gap-y-12">
            {PRODUCTS.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id}>
              <motion.div 
                key={product.id}
                whileHover={{ y: -4 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden mb-6 product-card-shadow aspect-[4/5] bg-surface-container">
                  <img 
                    src={getFullImageUrl(product.attachments?.[0]?.url)} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.tag && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                        {product.tag}
                      </span>
                    </div>
                  )}
                  <button className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform bg-primary text-white py-4 text-sm font-bold uppercase tracking-wider">
                    Quick Add
                  </button>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    {product.category}
                  </span>
                  <h3 className="text-lg font-medium text-on-surface">{product.name}</h3>
                  <p className="text-primary font-bold">${product.price.toFixed(2)}</p>
                </div>
              </motion.div></Link>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        {/* <section className="bg-on-surface py-32 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-gutter grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-6xl font-semibold mb-8 leading-tight">
                Join the Elite Community
              </h2>
              <p className="text-slate-400 text-lg mb-12 max-w-lg">
                Get early access to limited drops, exclusive editorial content, and invitations to our private collection previews.
              </p>
              <form className="flex flex-col sm:flex-row max-w-md">
                <input 
                  type="email" 
                  placeholder="Email address"
                  className="bg-transparent border-slate-700 border-b sm:border-b-0 sm:border-r py-5 flex-grow outline-none focus:border-white transition-colors placeholder:text-slate-600"
                />
                <button className="bg-white text-on-surface px-10 py-5 font-bold uppercase tracking-widest text-xs hover:bg-slate-100 transition-all">
                  Subscribe
                </button>
              </form>
              <p className="mt-6 text-[10px] text-slate-500 uppercase tracking-widest">
                By subscribing you agree to our Privacy Policy
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8V8zyGABQ0DZ6lOtM7cBjaL-Pei0TX-_Gk4THwJFuFVEWltXoxEWWudHl-v8RIbb-im9tc_R4949DeEvUCiU05bccqfLaQJGuZBvBd3K2fOObsBMYzHRIgle6pYFgKCBKZiGpzlGmLLAR07JBhxCrTe_ImR3YR2Zjkq1rL7BUaIyGsnFjjWgDyI4JnzsqcB2Hs4aP28dM_y5WH2oD0ScfbXA4hsx-t-LW8FaoAvjn6xpWOcLANFhcUKLpLMmB5KeTwEZW7Ams4qu6" 
                alt="Luxury boutique interior"
                className="rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute -bottom-10 -left-10 bg-primary p-10 hidden md:block max-w-[300px] shadow-2xl">
                <p className="text-sm font-medium italic leading-relaxed">
                  "MODERN_ELITE isn't just a store; it's a statement of intentional living."
                </p>
              </div>
            </motion.div>
          </div>
        </section> */}
      </main>


    </div>
  );
}
