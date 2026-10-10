import React, { useState } from 'react';
import { Professor } from '../types';
import { UNIVERSITIES_DATABASE, SPECIALTIES_DATABASE } from '../data/mockBooks';
import {
  X,
  Award,
  Sparkles,
  CheckCircle2,
  Building2,
  CreditCard,
  Mail,
  User,
  ShieldCheck,
  BookOpen,
  KeyRound,
  AlertCircle,
} from 'lucide-react';

interface ProfessorRegisterModalProps {
  onRegisterProfessor: (newProf: Professor) => void;
  onClose: () => void;
  lang: 'fr' | 'ar';
}

export const ProfessorRegisterModal: React.FC<ProfessorRegisterModalProps> = ({
  onRegisterProfessor,
  onClose,
  lang,
}) => {
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('Professeur de l\'Enseignement Supérieur (PES)');
  const [email, setEmail] = useState('');
  const [selectedUniversityCode, setSelectedUniversityCode] = useState(UNIVERSITIES_DATABASE[0].code);
  const [selectedFaculty, setSelectedFaculty] = useState(UNIVERSITIES_DATABASE[0].faculties[0]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(SPECIALTIES_DATABASE[0].nameFr);
  const [bankRib, setBankRib] = useState('011 780 0000 0000 0000 0000 00');
  const [bankName, setBankName] = useState('Attijariwafa Bank');
  const [phone, setPhone] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [confirmPinCode, setConfirmPinCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [proposedBookTitle, setProposedBookTitle] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const currentUniv = UNIVERSITIES_DATABASE.find((u) => u.code === selectedUniversityCode) || UNIVERSITIES_DATABASE[0];

  const handleUniversityChange = (code: string) => {
    setSelectedUniversityCode(code);
    const u = UNIVERSITIES_DATABASE.find((item) => item.code === code);
    if (u && u.faculties.length > 0) {
      setSelectedFaculty(u.faculties[0]);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim()) return;

    if (!pinCode.trim() || pinCode.trim().length < 4) {
      setErrorMsg(
        lang === 'fr'
          ? 'Le code secret (PIN) doit comporter au moins 4 chiffres ou caractères.'
          : 'يجب أن يتكون القن السري من 4 خانات على الأقل.'
      );
      return;
    }

    if (pinCode.trim() !== confirmPinCode.trim()) {
      setErrorMsg(
        lang === 'fr'
          ? 'Les deux codes secrets ne correspondent pas.'
          : 'القن السري وتأكيده غير متطابقين.'
      );
      return;
    }

    const newProf: Professor = {
      id: `prof-${Date.now()}`,
      fullName: fullName.trim().startsWith('Pr.') ? fullName.trim() : `Pr. ${fullName.trim()}`,
      title: title.trim(),
      email: email.trim().toLowerCase(),
      university: `${currentUniv.nameFr} (${currentUniv.code})`,
      faculty: `${selectedFaculty} · ${selectedSpecialty}`,
      bankRib: bankRib.trim(),
      bankName: bankName.trim(),
      royaltyPercentage: 80, // Default 80% to professor, 20% platform share
      totalSalesCount: 0,
      totalEarningsMAD: 0,
      paidAmountMAD: 0,
      pendingPayoutMAD: 0,
      pinCode: pinCode.trim(),
      status: 'active',
    };

    onRegisterProfessor(newProf);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl border border-amber-200 shadow-xs">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-stone-900">
                  {lang === 'fr' ? 'Espace Enseignants · Inscription Gratuite' : 'فضاء الأساتذة · انخراط وتسجيل الأساتذة والمؤلفين'}
                </h2>
                <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  0 DH · اشتراك مجاني مدى الحياة
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {lang === 'fr'
                  ? 'Publiez vos polycopiés, conservez vos droits d\'auteur avec protection DRM et touchez vos royalties en toute transparence.'
                  : 'انضم لمنصة FAC en PDF مجاناً: حماية رقمية مانعة للنسخ لمطبوعاتك، وتحصيل مباشر لحقوق التأليف.'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-900 rounded-xl hover:bg-stone-100 cursor-pointer transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-stone-900">
              {lang === 'fr' ? 'Bienvenue Pr. ' + fullName : 'أهلاً وسهلاً بك يا أستاذ! تم التسجيل بنجاح'}
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              {lang === 'fr'
                ? 'Votre compte enseignant certifié a été activé gratuitement. Vos coordonnées bancaires ont été enregistrées pour les versements automatiques de vos droits.'
                : 'تم تفعيل حسابك الأستاذ المعتمد مجاناً. تم ربط بياناتك البنكية لتحويل مستحقات مبيعات مقرراتك مباشرة.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            {/* Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  {lang === 'fr' ? 'Nom et Prénom du Professeur' : 'الاسم الكامل للأستاذ'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Pr. Hassan Berrada"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  {lang === 'fr' ? 'Grade / Titre Académique' : 'الرتبة والصفة الأكاديمية'}
                </label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Professeur de l'Enseignement Supérieur (PES)">Professeur de l'Enseignement Supérieur (PES) / أستاذ التعليم العالي</option>
                  <option value="Professeur Habilité (PH)">Professeur Habilité (PH) / أستاذ مؤهل</option>
                  <option value="Professeur Assistant (PA)">Professeur Assistant (PA) / أستاذ مساعد</option>
                  <option value="Docteur Chercheur">Docteur Chercheur / دكتور باحث</option>
                </select>
              </div>
            </div>

            {/* Cascading University & Faculty Selection from the Database */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>{lang === 'fr' ? 'Université de Rattachement (12 Universités)' : 'الجامعة'}</span>
                </label>
                <select
                  value={selectedUniversityCode}
                  onChange={(e) => handleUniversityChange(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {UNIVERSITIES_DATABASE.map((u) => (
                    <option key={u.id} value={u.code}>
                      {u.nameFr} ({u.code}) · {u.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  {lang === 'fr' ? 'Faculté / Établissement de l\'Université' : 'الكلية أو المؤسسة التابعة للجامعة'}
                </label>
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {currentUniv.faculties.map((fac, idx) => (
                    <option key={idx} value={fac}>
                      {fac}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Specialty / Discipline from Database */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                {lang === 'fr' ? 'Discipline & Filière Enseignée' : 'الشعبة والتخصص الأكاديمي'}
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {SPECIALTIES_DATABASE.map((sp) => (
                  <option key={sp.id} value={sp.nameFr}>
                    {sp.facultyCode} · {sp.nameFr} ({sp.cycle})
                  </option>
                ))}
              </select>
            </div>

            {/* Contact Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-500" />
                  <span>{lang === 'fr' ? 'E-mail Professionnel / Institutionnel' : 'البريد المهني / الجامعي'}</span> <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom.prof@universite.ac.ma"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  {lang === 'fr' ? 'Téléphone / WhatsApp Professionnel' : 'رقم الهاتف للتواصل الإداري'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+212 6..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Code Secret Confidentiel (PIN) */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>{lang === 'fr' ? 'Définir votre Code Secret Personnel (PIN de Connexion)' : 'تحديد القن السري الخاص بك (PIN للدخول)'}</span>
                <span className="text-rose-500">*</span>
              </div>
              <p className="text-[11px] text-stone-600">
                {lang === 'fr'
                  ? 'Ce code secret vous permettra d\'accéder à votre profil enseignant et gérer vos publications en toute sécurité.'
                  : 'ستستخدم هذا القن السري للدخول إلى بروفايلك وإدارة مقرراتك وسحب مستحقاتك.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    {lang === 'fr' ? 'Code Secret (Min. 4 caractères)' : 'القن السري (4 خانات فأكثر)'}
                  </label>
                  <input
                    type="password"
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="••••••"
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    {lang === 'fr' ? 'Confirmer le Code Secret' : 'تأكيد القن السري'}
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPinCode}
                    onChange={(e) => setConfirmPinCode(e.target.value)}
                    placeholder="••••••"
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Optional First Book / Lecture Note Proposal */}
            <div>
              <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>{lang === 'fr' ? 'Titre de votre premier polycopié ou livre à publier (Optionnel)' : 'عنوان أول مطبوع أو كتاب ترغب بنشره في المنصة (اختياري)'}</span>
              </label>
              <input
                type="text"
                value={proposedBookTitle}
                onChange={(e) => setProposedBookTitle(e.target.value)}
                placeholder="Ex: Précis de Droit des Sociétés Commerciales (S4)"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Bank details for Royalties Payouts */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
              <div className="font-bold text-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'fr' ? 'Coordonnées Bancaires pour les Droits d\'Auteur' : 'الحساب البنكي لتحويل عائدات المبيعات (RIB)'}</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {lang === 'fr' ? 'Droits d\'Auteur Rémunérés' : 'مستحقات مؤلف محفوظة'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    {lang === 'fr' ? 'Banque Domiciliataire' : 'اسم البنك'}
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Attijariwafa Bank">Attijariwafa Bank / التجاري وفا بنك</option>
                    <option value="Banque Populaire (BP)">Banque Populaire / البنك الشعبي</option>
                    <option value="Bank of Africa (BMCE)">Bank of Africa / بنك أوف أفريقيا</option>
                    <option value="CIH Bank">CIH Bank / بنك القرض العقاري والسياحي</option>
                    <option value="Société Générale Maroc">Société Générale / الشركة العامة</option>
                    <option value="BMCI">BMCI / البنك المغربي للتجارة والصناعة</option>
                    <option value="Crédit Agricole du Maroc (CAM)">Crédit Agricole / القرض الفلاحي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    {lang === 'fr' ? 'RIB Bancaire (24 chiffres)' : 'رقم الحساب البنكي (24 رقماً)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={bankRib}
                    onChange={(e) => setBankRib(e.target.value)}
                    placeholder="011 780 0000000000000000 00"
                    className="w-full p-2 border border-stone-300 rounded-lg text-xs font-mono bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
              >
                {lang === 'fr' ? 'Annuler' : 'إلغاء'}
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Activer Mon Compte Enseignant Gratuitement' : 'تفعيل حساب الأستاذ المجاني فوراً'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
