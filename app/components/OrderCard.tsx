import { motion } from 'motion/react';
import Link from 'next/link';
import { getFullImageUrl } from '../utils/features';

interface OrderCardProps {
  id: string;
  date: string;
  total: string;
  status: 'Delivered' | 'In Transit' | 'Processing';
  images: string[];
  extraCount?: number;
}

export default function OrderCard(orders: OrderCardProps) {
  const statusStyles = {
    'Delivered': 'bg-green-50 text-green-700',
    'In Transit': 'bg-amber-50 text-amber-700',
    'Processing': 'bg-slate-100 text-slate-600',
  };
  console.log("order",orders)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-white border border-slate-100 p-6 md:p-8 hover:shadow-ambient transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-50">
        <div className="grid grid-cols-2 md:flex md:gap-12 gap-y-4">
          <div>
            <p className="text-[12px] font-medium text-slate-400 mb-1 uppercase tracking-widest">Order ID</p>
            <p className="font-semibold text-slate-900">{orders?.razorpayOrderId}</p>
          </div>
          <div>
            <p className="text-[12px] font-medium text-slate-400 mb-1 uppercase tracking-widest">Date</p>
            <p className="font-semibold text-slate-900">{new Date(orders?.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-[12px] font-medium text-slate-400 mb-1 uppercase tracking-widest">Total</p>
            <p className="font-semibold text-slate-900">{orders?.totalAmount}</p>
          </div>
          <div>
            <p className="text-[12px] font-medium text-slate-400 mb-1 uppercase tracking-widest">Status</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
              {orders?.status}
            </span>
          </div>
        </div>
        <Link href={`/orders/${orders?.id}`} className="bg-black text-white! font-semibold py-3 px-8 hover:bg-primary/90 transition-colors whitespace-nowrap">
          View Details
        </Link>
      </div>
      <div className="flex flex-wrap gap-4">
        {orders?.items?.map((img: any, index: number) => (
          <div key={index} className="w-20 h-24 bg-slate-50 overflow-hidden relative">
            <img 
              referrerPolicy="no-referrer"
              src={getFullImageUrl(img?.productImages)} 
              alt="Product" 
              className="w-full h-full object-cover"
            />
            {/* {index === images.length - 1 && extraCount && (
              <div className="absolute inset-0 flex items-center justify-center font-medium text-slate-600 bg-white/40">
                +{extraCount}
              </div>
            )} */}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
