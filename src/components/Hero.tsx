import React from 'react';
import { Search, ShieldAlert, Sparkles, BookOpenCheck } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  lang: 'fr' | 'ar';
  onExploreClick: () => void;
  onSecurityClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  lang,
  onExploreClick,
  onSecurityClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-stone-100 py-12 md:py-20 border-b border-stone-800">
      {/* Background imagery with subtle dark scrim */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src="/src/assets/images/fac_library_hero_1791375887505.jpg"
          alt="Amphithéâtre et bibliothèque universitaire"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-900/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-300 mb-3 tracking-wide uppercase">
            <span>{lang === 'fr' ? 'Plateforme Académique Officielle' : 'المنصة الجامعية الرسمية'}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'fr' ? 'Licence Sécurisée Anti-Piratage' : 'حماية مشددة ضد التسريب'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance mb-4">
            {lang === 'fr'
              ? 'Lisez vos cours universitaires en toute sécurité, directement in-app'
              : 'اقرأ مقرراتك ومحاضراتك الجامعية بأمان فائق، حصرياً داخل التطبيق'}
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl mb-8">
            {lang === 'fr'
              ? 'FAC en PDF permet aux étudiants des facultés d\'acquérir leurs polycopiés et manuels de référence sans risque de fuite : interdiction stricte de téléchargement, blocage des captures d\'écran et filigrane nominatif dynamique infalsifiable.'
              : 'تمكن منصة FAC en PDF طلبة الكليات والمعاهد من اقتناء المطبوعات والكتب الأكاديمية مع استحالة التحميل أو النسخ ونظام رصد متطور يحظر لقطات الشاشة لحفظ حقوق الأساتذة والمؤلفين.'}
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  lang === 'fr'
                    ? 'Rechercher un module, professeur, code cours...'
                    : 'ابحث عن مادة، اسم الأستاذ، أو الكلية...'
                }
                className="w-full pl-11 pr-4 py-3 bg-stone-800/90 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={onExploreClick}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              {lang === 'fr' ? 'Explorer les cours' : 'تصفح المقررات'}
            </button>
          </div>

          {/* Trust markers adhering to claim-to-proof adjacency */}
          <div className="mt-8 pt-6 border-t border-stone-800 flex flex-wrap items-center gap-6 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'fr' ? 'Anti-Capture & Anti-Impression' : 'منع تام للقطات الشاشة والطباعة'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{lang === 'fr' ? 'Filigrane d\'identité crypté' : 'علامة مائية متحركة بهوية الطالب'}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4 text-sky-400" />
              <span>{lang === 'fr' ? 'Lecture interactive avec surlignage' : 'قراءة تفاعلية مع تدوين الملاحظات'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
