import { Lock, Truck } from 'lucide-react';
import { CartTotals } from '../types';
import Link from 'next/link';

interface OrderSummaryProps {
  totals: CartTotals;
}

export default function OrderSummary({ totals }: OrderSummaryProps) {
  return (
    <aside className="lg:col-span-4 sticky top-24">
      <div className="bg-slate-50 rounded-xl p-8 border border-slate-100">
        <h2 className="h2 mb-6">Order Summary</h2>
        
        <div className="space-y-4 text-on-surface-variant border-b border-slate-200 pb-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-on-surface font-medium">₹{totals?.subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-on-surface font-medium">₹{totals?.shipping?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Tax</span>
            <span className="text-on-surface font-medium">₹{totals?.tax?.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between items-end mt-6 mb-8">
          <span className="h3">Total</span>
          <span className="text-[48px] font-semibold leading-[1.1] tracking-[-0.02em] text-primary">
             ₹{totals?.total?.toFixed(2)}
          </span>
        </div>

        <div className="space-y-5">
          <Link href="/checkout">
          <button className="bg-black w-full bg-primary text-white button-text py-5 rounded-lg hover:bg-primary-container transition-all shadow-md active:scale-[0.98]">
            Proceed to Checkout
          </button>
          </Link>
          <Link href="/search" >
            <button className="w-full bg-transparent border border-slate-200 text-on-surface button-text py-5 rounded-lg hover:bg-slate-100 transition-all">
              Continue Shopping
            </button>
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-4 text-xs text-on-surface-variant font-medium">
          <div className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            Secure Checkout
          </div>
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            Free returns over ₹500
          </div>
        </div>
      </div>

      {/* <div className="mt-6 p-6 border border-slate-200 rounded-xl">
        <label className="label-sm text-on-surface-variant block mb-2">Promo Code</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter code" 
            className="flex-1 bg-white border border-slate-200 px-4 py-3 text-sm rounded-lg focus:ring-1 focus:ring-primary outline-none"
          />
          <button className="px-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all">
            Apply
          </button>
        </div>
      </div> */}
    </aside>
  );
}
