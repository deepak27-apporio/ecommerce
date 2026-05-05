"use client";
import {
  ChevronRight,
  Download,
  Truck,
  CreditCard,
  MessageCircleQuestion,
} from "lucide-react";
import { motion } from "motion/react";

const ORDER_ITEMS = [
  {
    id: 1,
    brand: "Modern Elite Essentials",
    name: "Signature Heavyweight Tee",
    color: "Bone White",
    size: "L",
    qty: 1,
    price: 85.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuArHr_5DiLvRtUKpw25HqSNc4oTYMz-sL70SZI-Aa_YBeuwpXj90JOJjBMJX-XcoZQtqBv8IXmWfzA49gBk2GWM8Sb274KxMMZsTVyizkSytT7cLoE5aqa3kQAD1PzfkSWEQj7Ftmmk841-XQS7zAXuzfdQCyYY8_ekdT-QZvyrvpHGm4pxHUSSm1bEZ9zqU4N4u7ZIJOALtwZqGgxOYmCx6lQohlNVfeNgQtAlZNbFC3kXYISIiDq0CYPR-fQarqzWNoVHkCId-RQf",
  },
  {
    id: 2,
    brand: "Archive Denim",
    name: "01 Straight Leg Jean",
    color: "Raw Indigo",
    size: "32/32",
    qty: 1,
    price: 195.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUwAcw0JGZehP6ooNf4HUtA_ckGDXYbytbqxCC1RT49oTrbAwYRIKLLH2mAx4mT4nENcpNQO5bwWwfcx_L4Sb9l1yoRM-K4KsK-j46YAgpXRjgwfwUvU64FtevGI_MKSbI_4JT0Oiz75USqTu6noLHp6cNS-pPSDtK7zGJd1vAVG3ztSGn2LsW_dzgQ1GEQ00aA8YR63e31SN9xgZm6_W5ZDPV-Ca5043qDJH3gWXEbO61CcEuiEqKWIkjlSksLkzTh52ODjhXm03E",
  },
  {
    id: 3,
    brand: "Elite Accessories",
    name: "Hand-Stitched Leather Belt",
    color: "Midnight Black",
    size: "34",
    qty: 1,
    price: 65.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEMvECfiTDu6ChLqKJAJ6piaZHH5AXOi7DZd2z8sFxpp4Gg2JCWijZRTwhnvtCVH6aDKqm84iKJV8b-2yvKWk-Eo9pN7RnYNTUp3g36xQUe75MnLdhfRc_8B-DizvsL26YvY1J_o_yqfQ4bg-oQCJXRd8Bde4DKT_ruZUzLS7VThuC55veQgpfXacFk-vIk-iaCSEik6zRIgctHJGvXKbYq0r--wuI-7M10Ua40KJzErNzSZ0Ex-Qmt5or4EW6j-ex8ZS1-X-xsGDW",
  },
];

const page = () => {
  return (
    <div className="min-h-screen bg-brand-background selection:bg-indigo-100 selection:text-indigo-900">
      <main className="pt-10 pb-20 max-w-[1280px] mx-auto px-6">
        {/* Order Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <nav className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
              <a className="hover:text-indigo-600 transition-colors" href="#">
                My Account
              </a>
              <ChevronRight size={12} />
              <a className="hover:text-indigo-600 transition-colors" href="#">
                Order History
              </a>
            </nav>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Order #ME-84920
            </h1>
            <p className="text-slate-500 mt-1">Placed on October 24, 2024</p>
          </div>
          {/* <div className="flex flex-wrap gap-3">
            <button className="text-sm font-semibold border border-slate-200 px-6 py-3 rounded-sm hover:bg-slate-50 transition-colors text-slate-900 flex items-center gap-2">
              <Download size={18} />
              Download Invoice
            </button>
            <button className="text-sm font-semibold bg-indigo-700 text-white px-8 py-3 rounded-sm hover:bg-indigo-800 transition-colors shadow-sm">
              Track Package
            </button>
          </div> */}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Status & Items */}
          <div className="lg:col-span-8 space-y-6">
            {/* Status Banner & Tracker */}
            <motion.section
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-50 p-8 rounded-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
                    In Transit
                  </span>
                  <h2 className="text-2xl font-medium text-slate-900 tracking-tight">
                    Estimated delivery: Oct 28
                  </h2>
                </div>
                <Truck size={36} className="text-indigo-600" />
              </div>

              {/* Timeline Tracker */}
              <div className="relative pt-4 pb-2">
                <div className="absolute top-6 left-0 w-full h-[2px] bg-slate-200"></div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute top-6 left-0 h-[2px] bg-indigo-600"
                ></motion.div>
                <div className="relative flex justify-between">
                  <StatusPoint label="Confirmed" date="Oct 24" active />
                  <StatusPoint label="Processing" date="Oct 25" active />
                  <StatusPoint label="Shipped" date="Oct 26" active />
                  <StatusPoint label="Delivered" date="Est. Oct 28" />
                </div>
              </div>
            </motion.section>

            {/* Itemized List */}
            <section className="border border-slate-100 rounded-sm overflow-hidden bg-white">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Order Items (3)
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {ORDER_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="p-6 flex gap-6 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-24 h-32 bg-slate-100 flex-shrink-0 overflow-hidden rounded-sm">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={item.image}
                        alt={item.name}
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {item.brand}
                        </p>
                        <h4 className="text-lg font-medium text-slate-900 leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-slate-500 text-xs mt-1">
                          Color: {item.color} • Size: {item.size}
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-slate-900 text-xs font-medium">
                          Qty: {item.qty}
                        </p>
                        <p className="text-lg font-medium text-slate-900">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Summary & Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Order Summary Card */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-slate-100 p-8 shadow-sm rounded-sm"
            >
              <h3 className="text-xl font-semibold text-slate-900 mb-6 tracking-tight">
                Order Summary
              </h3>
              <div className="space-y-4 text-slate-600 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">$345.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-indigo-600 font-semibold uppercase text-[10px] tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                    Complimentary
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-slate-900">$27.60</span>
                </div>
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-slate-900">
                  <span className="text-lg font-semibold tracking-tight">
                    Total
                  </span>
                  <span className="text-2xl font-bold tracking-tight">
                    $372.60
                  </span>
                </div>
              </div>
            </motion.section>

            {/* Shipping & Payment Details */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-slate-100 p-8 rounded-sm space-y-8 bg-white"
            >
              {/* Shipping Info */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                  Shipping Information
                </h4>
                <div className="text-slate-900">
                  <p className="font-semibold text-sm">Marcus Sterling</p>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                    1422 North Wacker Dr.
                    <br />
                    Suite 400
                    <br />
                    Chicago, IL 60606
                    <br />
                    United States
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-slate-900 text-[11px] font-bold uppercase tracking-wider">
                    <Truck size={14} className="text-indigo-600" />
                    Priority Overnight (Est. Next Day)
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-8 border-t border-slate-100">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                  Payment Method
                </h4>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-slate-50 border border-slate-200 rounded-sm flex items-center justify-center">
                    <span className="text-[9px] font-black text-slate-400 italic">
                      VISA
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold text-sm">
                      Visa ending in 8421
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">Exp: 09/27</p>
                  </div>
                </div>
              </div>

              {/* Need Help */}
              <div className="pt-8 border-t border-slate-100">
                <button className="w-full text-xs font-bold uppercase tracking-widest py-3 text-slate-900 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 group">
                  <MessageCircleQuestion
                    size={16}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                  Need Help with your order?
                </button>
              </div>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;

function StatusPoint({
  label,
  date,
  active = false,
}: {
  label: string;
  date: string;
  active?: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 ${active ? "bg-indigo-600" : "bg-slate-200"}`}
      ></div>
      <span
        className={`mt-3 text-xs font-semibold tracking-tight ${active ? "text-slate-900" : "text-slate-400"}`}
      >
        {label}
      </span>
      <span className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-tighter">
        {date}
      </span>
    </div>
  );
}
