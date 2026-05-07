"use client";
import {  
  Mail,
  Globe,
  Share2
} from "lucide-react";
import { memo } from "react";

const Footer = () => {
  return (
      <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-12 text-black ps-9">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className="text-lg font-black tracking-[0.2em] uppercase">MODERN ELITE</div>
              <p className="text-secondary text-sm leading-relaxed max-w-xs">
                Curating the world's most exceptional minimalist goods since 2024.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-white rounded-full text-slate-400 hover:text-primary border border-slate-100 shadow-sm transition-all"><Globe size={18} /></a>
                <a href="#" className="p-2 bg-white rounded-full text-slate-400 hover:text-primary border border-slate-100 shadow-sm transition-all"><Share2 size={18} /></a>
                <a href="#" className="p-2 bg-white rounded-full text-slate-400 hover:text-primary border border-slate-100 shadow-sm transition-all"><Mail size={18} /></a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-8">Support</h4>
              <ul className="space-y-4 text-sm text-secondary font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-8">Legal</h4>
              <ul className="space-y-4 text-sm text-secondary font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-8">Contact</h4>
              <ul className="space-y-4 text-sm text-secondary font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex justify-center md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <p>© 2026 MODERN ELITE. All Rights Reserved.</p>
            {/* <div className="flex gap-8">
              <a href="#" className="hover:text-on-surface">Instagram</a>
              <a href="#" className="hover:text-on-surface">Twitter</a>
              <a href="#" className="hover:text-on-surface">Facebook</a>
            </div> */}
          </div>
        </div>
      </footer>
  )
}

export default memo(Footer)