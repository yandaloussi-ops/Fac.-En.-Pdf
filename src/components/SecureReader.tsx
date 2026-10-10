import React, { useState, useEffect, useRef } from 'react';
import { Book, StudentProfile, UserNote, UserBookmark, DRMSecurityAlert } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  List,
  ZoomIn,
  ZoomOut,
  Highlighter,
  Bookmark,
  Sun,
  Moon,
  Coffee,
  Clock,
  X,
  Lock,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';
import { setupDrmProtection } from '../utils/drmShield';

interface SecureReaderProps {
  book: Book;
  student: StudentProfile;
  isAcquired: boolean;
  onClose: () => void;
  onAcquireBook: (bookId: string) => void;
  lang: 'fr' | 'ar';
}

export const SecureReader: React.FC<SecureReaderProps> = ({
  book,
  student,
  isAcquired,
  onClose,
  onAcquireBook,
  lang,
}) => {
  const initialPage = student.bookProgress[book.id]?.currentPage || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [themeMode, setThemeMode] = useState<'light' | 'sepia' | 'dark'>('light');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'toc' | 'notes' | 'bookmarks'>('toc');

  // Study timer state
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);

  // DRM & Anti-Screen Capture states
  const [isShieldActive, setIsShieldActive] = useState<boolean>(false);
  const [activeAlert, setActiveAlert] = useState<DRMSecurityAlert | null>(null);
  const [watermarkPos, setWatermarkPos] = useState({ x: 20, y: 35 });
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [bookmarks, setBookmarks] = useState<UserBookmark[]>([]);

  const maxAllowedPage = isAcquired ? book.totalPages : book.sampleMaxPage;
  const pageData = book.pages.find((p) => p.pageNumber === currentPage) || book.pages[0];

  // Dynamic moving watermark loop (Forensic tracking)
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        x: Math.floor(10 + Math.random() * 70),
        y: Math.floor(15 + Math.random() * 70),
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Pomodoro study timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, secondsRemaining]);

  // Setup DRM keyboard, clipboard, and window focus listeners
  useEffect(() => {
    const cleanup = setupDrmProtection({
      onSecurityAlert: (alert) => {
        setActiveAlert(alert);
      },
      onBlurChange: (blurred) => {
        setIsShieldActive(blurred);
      },
    });
    return cleanup;
  }, []);

  const handleNextPage = () => {
    if (currentPage < maxAllowedPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const note: UserNote = {
      id: Math.random().toString(),
      bookId: book.id,
      pageNumber: currentPage,
      text: newNoteText.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setNotes([note, ...notes]);
    setNewNoteText('');
  };

  const handleToggleBookmark = () => {
    const existing = bookmarks.find((b) => b.pageNumber === currentPage);
    if (existing) {
      setBookmarks(bookmarks.filter((b) => b.pageNumber !== currentPage));
    } else {
      setBookmarks([
        ...bookmarks,
        {
          bookId: book.id,
          pageNumber: currentPage,
          chapterTitle: pageData.chapterTitle,
          createdAt: new Date().toLocaleDateString(),
        },
      ]);
    }
  };

  const isCurrentPageBookmarked = bookmarks.some((b) => b.pageNumber === currentPage);

  // Format timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Color theme variables
  const themeClasses = {
    light: 'bg-stone-100 text-stone-900 border-stone-200',
    sepia: 'bg-[#Fbf7ed] text-[#3d3224] border-[#E8e0cb]',
    dark: 'bg-stone-950 text-stone-100 border-stone-800',
  };

  const pageContainerThemes = {
    light: 'bg-white text-stone-900 shadow-sm border-stone-200',
    sepia: 'bg-[#F7F2E4] text-[#2c2214] shadow-sm border-[#e4dcbf]',
    dark: 'bg-stone-900 text-stone-100 shadow-sm border-stone-800',
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col select-none drm-protected-surface ${themeClasses[themeMode]}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Top Bar Reader Navigation */}
      <div className="h-14 px-4 border-b flex items-center justify-between shrink-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
            title="Quitter le lecteur"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-stone-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
              {book.title}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>DRM Sécurisé</span>
            </span>
          </div>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold tabular-nums px-2">
            Page {currentPage} / {book.totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= maxAllowedPage}
            className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Tools: Zoom, Study Timer, Theme, Sidebar */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Test Screenshot Trap Button */}
          <button
            onClick={() => setIsShieldActive(!isShieldActive)}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
            title="Tester le masquage anti-capture d'écran"
          >
            <EyeOff className="w-3.5 h-3.5 text-amber-600" />
            <span>{isShieldActive ? 'Démasquer' : 'Test Anti-Capture'}</span>
          </button>

          {/* Pomodoro Focus Timer */}
          <div className="hidden md:flex items-center gap-1 text-xs px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded-md">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-mono tabular-nums">{formatTime(secondsRemaining)}</span>
            <button
              onClick={() => setTimerActive(!timerActive)}
              className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 hover:underline ml-1"
            >
              {timerActive ? 'Pause' : 'Focus'}
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-0.5 bg-stone-100 dark:bg-stone-800 rounded-md p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
              className="p-1 hover:bg-white dark:hover:bg-stone-700 rounded transition-colors"
              title="Zoom arrière"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 tabular-nums">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(140, z + 15))}
              className="p-1 hover:bg-white dark:hover:bg-stone-700 rounded transition-colors"
              title="Zoom avant"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center gap-0.5 bg-stone-100 dark:bg-stone-800 rounded-md p-0.5">
            <button
              onClick={() => setThemeMode('light')}
              className={`p-1 rounded ${themeMode === 'light' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'}`}
              title="Fond Blanc"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setThemeMode('sepia')}
              className={`p-1 rounded ${themeMode === 'sepia' ? 'bg-[#F2ECE0] shadow-xs text-amber-900' : 'text-stone-500'}`}
              title="Sépia"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`p-1 rounded ${themeMode === 'dark' ? 'bg-stone-700 shadow-xs text-white' : 'text-stone-500'}`}
              title="Mode Sombre"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${
              isCurrentPageBookmarked ? 'text-amber-600' : 'text-stone-500'
            }`}
            title="Marque-page"
          >
            <Bookmark className={`w-4 h-4 ${isCurrentPageBookmarked ? 'fill-amber-600' : ''}`} />
          </button>

          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
            title="Sommaire et annotations"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Reading Canvas & Container */}
      <div className="flex-1 relative overflow-auto flex items-start justify-center p-4 sm:p-8">
        {/* Anti-Screen Capture Shield Overlay (Fires on blur, snipping tool, or shortcut) */}
        {isShieldActive && (
          <div className="absolute inset-0 z-40 bg-stone-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-100">
            <div className="max-w-md p-6 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl">
              <div className="w-12 h-12 mx-auto bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">
                {lang === 'fr'
                  ? 'Contenu Masqué — Protection Anti-Capture'
                  : 'تم حجب المحتوى — حماية حقوق التأليف والنشر'}
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed mb-6">
                {lang === 'fr'
                  ? 'Pour empêcher l\'extraction illégale et les captures d\'écran par outils tiers, la page se masque instantanément lors de la perte de focus de l\'application.'
                  : 'لحماية المحاضرات والكتب الجامعية من التسريب والقرصنة، يتم إخفاء المحتوى فور فقدان تركيز نافذة التطبيق أو تشغيل أدوات القص.'}
              </p>
              <button
                onClick={() => setIsShieldActive(false)}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                {lang === 'fr' ? 'Reprendre la lecture sécurisée' : 'العودة للمتابعة الآمنة'}
              </button>
            </div>
          </div>
        )}

        {/* Alert Notification Toast */}
        {activeAlert && (
          <div className="fixed top-16 right-4 z-50 max-w-sm p-4 bg-amber-950 border border-amber-600 text-amber-100 rounded-xl shadow-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <div className="font-bold text-amber-200 mb-0.5">{activeAlert.title}</div>
              <div className="text-stone-300">{activeAlert.message}</div>
            </div>
            <button
              onClick={() => setActiveAlert(null)}
              className="text-stone-400 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sample Locked Prompt for Unacquired Books */}
        {!isAcquired && currentPage > book.sampleMaxPage ? (
          <div className="max-w-lg mx-auto my-12 p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-lg text-center">
            <div className="w-14 h-14 mx-auto bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
              {lang === 'fr' ? 'Fin de l\'Extrait Gratuit' : 'نهاية العينة المجانية للدرس'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
              {lang === 'fr'
                ? `Vous avez atteint la limite de prévisualisation (page ${book.sampleMaxPage}/${book.totalPages}). Pour accéder à l'intégralité du manuel et à tous les chapitres d'examen, débloquez votre licence étudiante.`
                : `لقد اطلعت على الصفحات التجريبية المسموحة (${book.sampleMaxPage}/${book.totalPages}). لاقتناء الكتاب بالكامل والقراءة داخل التطبيق، يرجى تفعيل ترخيصك الجامعي.`}
            </p>
            <button
              onClick={() => onAcquireBook(book.id)}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {book.isFree
                ? lang === 'fr'
                  ? 'Activer l\'accès gratuit'
                  : 'تفعيل الوصول المجاني'
                : lang === 'fr'
                ? `Acquérir le cours (${book.priceMAD} DH)`
                : `اقتناء الكتاب (${book.priceMAD} درهم)`}
            </button>
          </div>
        ) : (
          /* The Academic Reading Page Canvas Container */
          <div
            style={{ width: `${Math.min(960, 780 * (zoomLevel / 100))}px` }}
            className={`relative min-h-[920px] p-8 sm:p-12 md:p-16 rounded-xl border ${pageContainerThemes[themeMode]} transition-all duration-150 leading-relaxed`}
          >
            {/* Dynamic Moving Forensic Watermark (Floats diagonally across page) */}
            <div
              style={{
                top: `${watermarkPos.y}%`,
                left: `${watermarkPos.x}%`,
                transform: 'translate(-50%, -50%) rotate(-25deg)',
              }}
              className="absolute pointer-events-none z-20 transition-all duration-1000 ease-out text-center opacity-15 hover:opacity-25"
            >
              <div className="font-mono text-xs font-black tracking-widest text-stone-950 dark:text-white uppercase">
                FAC EN PDF · ÉTUDIANT: {student.studentId}
              </div>
              <div className="font-mono text-[10px] text-stone-800 dark:text-stone-300">
                {student.email} · IP: {student.ipAddress}
              </div>
              <div className="font-mono text-[9px] text-stone-600 dark:text-stone-400">
                DRM LICENCE #{student.drmLicenseKey.slice(0, 14)} · REPRODUCTION INTERDITE
              </div>
            </div>

            {/* Static diagonal watermark pattern across entire page for photographic leak mitigation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.035] flex items-center justify-center select-none">
              <div className="rotate-[-35deg] text-stone-900 dark:text-white font-mono text-lg font-black text-center space-y-12">
                <div>FAC EN PDF · {student.studentId} · {student.email}</div>
                <div>FAC EN PDF · {student.studentId} · {student.email}</div>
                <div>FAC EN PDF · {student.studentId} · {student.email}</div>
                <div>FAC EN PDF · {student.studentId} · {student.email}</div>
              </div>
            </div>

            {/* Page Header */}
            <div className="border-b border-stone-200/80 dark:border-stone-800 pb-3 mb-6 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span className="font-medium tracking-wide uppercase">{pageData.header}</span>
              <span className="font-mono tabular-nums">Page {pageData.pageNumber}</span>
            </div>

            {/* Chapter Title */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1 text-balance">
                {pageData.chapterTitle}
              </h2>
              <div className="h-0.5 w-12 bg-amber-600 rounded-full" />
            </div>

            {/* Main Academic Content Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-justify">
              {pageData.content.map((paragraph, idx) => (
                <p key={idx} className="first-letter:font-semibold">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Key Academic Takeaways Box (if present) */}
            {pageData.keyPoints && pageData.keyPoints.length > 0 && (
              <div className="my-8 p-4 bg-stone-50/80 dark:bg-stone-800/60 border-l-4 border-amber-600 rounded-r-lg">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-2">
                  {lang === 'fr' ? 'Points Clés & Synthèse du Module' : 'النقاط الجوهرية والملخص الأكاديمي'}
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                  {pageData.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold shrink-0">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Legal Article or Economic Formula Box (if present) */}
            {pageData.formulaOrCase && (
              <div className="my-6 p-4 rounded-lg bg-stone-100/90 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 font-serif italic text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                {pageData.formulaOrCase}
              </div>
            )}

            {/* Page Footer */}
            <div className="mt-12 pt-4 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
              <span>{book.author} — {book.facultyLabel}</span>
              <span className="font-mono">FAC-PDF-SECURE-PAGE-{pageData.pageNumber}</span>
            </div>
          </div>
        )}
      </div>

      {/* Slide-out Sidebar: Sommaire & Notes */}
      {sidebarOpen && (
        <aside className="absolute top-14 right-0 bottom-0 w-80 sm:w-96 bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 z-40 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          <div className="p-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveTab('toc')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'toc'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {lang === 'fr' ? 'Sommaire' : 'الفهرس'}
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {lang === 'fr' ? 'Notes' : 'ملاحظاتي'}
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'bookmarks'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {lang === 'fr' ? 'Signets' : 'الإشارات'}
              </button>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'toc' && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  {lang === 'fr' ? 'Table des Matières' : 'قائمة الفصول والمباحث'}
                </h3>
                {book.chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      if (isAcquired || ch.startPage <= book.sampleMaxPage) {
                        setCurrentPage(ch.startPage);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      currentPage >= ch.startPage && currentPage < ch.startPage + ch.pageCount
                        ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 font-bold text-amber-900 dark:text-amber-200'
                        : 'border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span className="line-clamp-2">{ch.title}</span>
                    <span className="text-[10px] font-mono text-stone-400 shrink-0 ml-2">
                      p. {ch.startPage}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'fr'
                      ? `Ajouter une note (Page ${currentPage})`
                      : `تدوين ملاحظة في الصفحة ${currentPage}`}
                  </label>
                  <textarea
                    rows={3}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder={
                      lang === 'fr'
                        ? 'Ex: Définition importante pour l\'examen partiel...'
                        : 'اكتب ملاحظتك هنا للحفظ والمراجعة...'
                    }
                    className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNoteText.trim()}
                    className="mt-2 w-full py-1.5 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold rounded-md disabled:opacity-40 transition-colors"
                  >
                    {lang === 'fr' ? 'Enregistrer ma note' : 'حفظ الملاحظة'}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                    {lang === 'fr' ? 'Mes Notes Sauvegardées' : 'الملاحظات السابقة'}
                  </h4>
                  {notes.length === 0 ? (
                    <p className="text-xs text-stone-400 italic">
                      {lang === 'fr' ? 'Aucune note pour ce livre.' : 'لا توجد ملاحظات مسجلة بعد.'}
                    </p>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-800 rounded-lg text-xs"
                      >
                        <div className="flex justify-between text-[10px] text-amber-700 dark:text-amber-400 font-semibold mb-1">
                          <span>Page {note.pageNumber}</span>
                          <span>{note.createdAt}</span>
                        </div>
                        <p className="text-stone-800 dark:text-stone-200">{note.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                  {lang === 'fr' ? 'Marque-pages Posés' : 'الصفحات المؤشرة'}
                </h4>
                {bookmarks.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">
                    {lang === 'fr'
                      ? 'Cliquez sur l\'icône signet en haut pour marquer une page.'
                      : 'اضغط على رمز الإشارة المرجعية أعلى القارئ لتثبيت الصفحة.'}
                  </p>
                ) : (
                  bookmarks.map((bm, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(bm.pageNumber)}
                      className="w-full text-left p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 rounded-lg text-xs hover:border-amber-500 transition-colors"
                    >
                      <div className="font-semibold text-stone-900 dark:text-white">
                        Page {bm.pageNumber}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">{bm.chapterTitle}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};
