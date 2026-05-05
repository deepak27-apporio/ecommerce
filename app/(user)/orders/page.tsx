"use client";
import OrderCard from "@/app/components/OrderCard";

const ORDERS = [
  {
    id: '#LM-29481-92',
    date: 'Oct 14, 2024',
    total: '$1,240.00',
    status: 'Delivered' as const,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAe5DLyJcs6u_gjis0LizHhMJXMRH6Q5ByMJeUagudfJLBalMV6k6eKtLHfjMb4iABCaS-x5G52w7b_VbhCoo5sWzO3_NMn1afFdfRypKUPD4r86TPpjV3f9Hchyt-nrQDKyKbC56cyO2n_ckg3fQV2YylC0FzTGa4t4wmX5AqHVTWDlIJK10EicR4YiK7WncrxzixXt-TfX7RzzUvP-_SbHM3N2jTtymcDbnE-ef4M2IwOdJX5wRQ0eCUrbZuw8L6hSHicbiScL1GK',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAydFrZJg-KIAYDfWugEc-AXrxzUt56PWxzQjrRBlRlcnfGrQiReMpBQ7Ha7nRk7nRUdr3RAILzsiJ5hyf8BDKWXxekbLsjA1yFI9yTWeY3QDmf9ktv1P0hY8ZXgn4-i_mLgaHlgbBSoj06-eSnTPIqy75YhvT-7BHbGZTosYufSZm7ublIuLur8k5SU5xuBYfPOrEOh8MDI0NVDWjDmpw9mYipcefI3DSTyZAljgXPq65tCby2WEFS8Sbi4G8b2BIbmyxT-skdZ-Ao',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCJZRp2jVql1LsJ55pm5AFSXXzlf8qcGDAphOEOwRER5HlJmFOGYdzZk5SensMvwiV-Uouq-sY61_ICmet4ozt1ZRekJRGl4SqRgc_20WQzk62jm2zaDlnrpw0PWaP_YSb4DXhz8si5kLy9xuiQPp3dw5KvCH_j6Cb2KNvGQmtAXsjiA9rr-DVDr4L2LG2t2xUwANyytRE9w7ldZJmLuXkNa2Ji3Svckq0B4yrNpisMelp2YCuZRIkOY6CIlwSJUC3t0XjCL7WAN2y0'
    ],
    extraCount: 1
  },
  {
    id: '#LM-28104-55',
    date: 'Sep 28, 2024',
    total: '$845.00',
    status: 'In Transit' as const,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA2MpR7C8sRsq3W_MjrlHXs81SwVYgljLuu7pd671awHpQi4UqmZR03hw3iooEaINRsfd7Lhpjp1yCjbYoD6cjjDsGEMwfg4UekRKNu5eh1LFRxeHkmeQFSkuNf14pCjfKTzGSxEn7SCdKdhlLxeW6RSrBXfq7WKeLEoLDCvt4HNct_imD1YKEKFC9uKEtp9QyLMAP2z86nkrKeTLmmnRmwRvYRSAMvq0AT4pZ4FJpSbudm9i_g0YP3jhia5nsMjDbRhWofBNoWoB4d'
    ]
  },
  {
    id: '#LM-27632-11',
    date: 'Aug 12, 2024',
    total: '$3,420.00',
    status: 'Processing' as const,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBIPRzfHErJ2Svbq1XGuebDj7debWSeeb9w0CQpMSiZsLgOuiQjCYsD3t41HUIvhfAH3QaqBkyo6hi13K_bDKPg790nYMllKoCQtu8EzaZm_Ix1Vo4un8AGvAawoqP3FDvOTHQ0GJhxsqwjMZ-U14hk7OP3u7g5fokEUNWuREX03owl9tXcf2bOBBFxkbGhYo0ax2A4fn5rAthqDYyvlTA-1CcN8XuabL3ei2dXJNdaRVnCRKbb1Y8DAWp_4qFB5Wpxc-tqorTSzFMk',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBI0AdUsSZkINLHaT0ATq1W6bb9Jv180L1YKg4w74_thrFGU1DVBtV14ROuccLfZjNoB0TswQ17YPXDCKt_5WpPZsk_7EPbLyVUS7ixfTTzqK_RTCyqSHq3eHheoltUVmKee2vSaViwI5SGYiTrDvHhpmuR3SycMSlvoOPUi0i0TfI2mEWITsOzQedHlAGderuWV6cZwQIXiUPVELstLNYKUIVd0I4wc3U-7CZ_Njt-9fNY-UunI63njBRxrpRYmbRtic_PItrUiNZE'
    ]
  }
];

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black px-5">
      <main className="pt-32 pb-20 px-8 max-w-full mx-auto min-h-screen">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <section className="flex-1">
            <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 tracking-tight">Order History</h1>
                <p className="text-slate-500">Review and manage your previous purchases.</p>
              </div>
              {/* <div className="w-full sm:w-auto">
                <select className="w-full sm:w-48 border border-slate-200 rounded-none text-sm font-medium focus:ring-primary focus:border-primary py-2.5 pl-3 pr-10 appearance-none bg-white">
                  <option>Last 3 months</option>
                  <option>2023</option>
                  <option>2022</option>
                </select>
              </div> */}
            </div>

            <div className="space-y-6">
              {ORDERS.map((order) => (
                <OrderCard key={order.id} {...order} />
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center gap-6">
              <button className="border border-slate-200 text-slate-900 font-semibold py-4 px-12 hover:bg-slate-50 transition-all duration-200 uppercase tracking-widest text-sm">
                Load More Orders
              </button>
              <p className="text-xs text-slate-400">Showing 3 of 12 orders</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
