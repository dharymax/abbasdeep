import { useState } from "react";
import {
  AudioWaveform, BookOpen, CheckCircle2, ChevronLeft, ExternalLink,
  Github, HardDrive, Home, Info, NotebookPen, Play, ShieldCheck,
  Zap
} from "lucide-react";

const NOTEBOOK_URL = "https://colab.research.google.com/github/dharymax/abbasdeep/blob/main/notebooks/abbasdeep.ipynb";
const GITHUB_NOTEBOOK_URL = "https://github.com/dharymax/abbasdeep/blob/main/notebooks/abbasdeep.ipynb";
const RAW_NOTEBOOK_URL = "https://raw.githubusercontent.com/dharymax/abbasdeep/main/notebooks/abbasdeep.ipynb";

type Page = "home" | "guide";
const navItems: { id: Page; label: string; icon: typeof Home }[] = [
  { id: "home", label: "الرئيسية", icon: Home },
  { id: "guide", label: "طريقة التشغيل", icon: BookOpen }
];

function BrandMark() {
  return <div className="brand-mark"><AudioWaveform size={25} strokeWidth={2.1} /></div>;
}

function App() {
  const [page, setPage] = useState<Page>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const openNotebook = () => window.open(NOTEBOOK_URL, "_blank", "noopener,noreferrer");
  const openGithubNotebook = () => window.open(GITHUB_NOTEBOOK_URL, "_blank", "noopener,noreferrer");
  const downloadNotebook = () => window.open(RAW_NOTEBOOK_URL, "_blank", "noopener,noreferrer");
  const navigate = (next: Page) => {
    setPage(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell launcher-shell" dir="rtl">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <BrandMark />
          <div><strong>abbasdeep</strong><span>AI VOICE STUDIO</span></div>
          <button className="mobile-close icon-button" onClick={() => setMenuOpen(false)} aria-label="إغلاق القائمة">×</button>
        </div>
        <div className="sidebar-caption">مركز التشغيل</div>
        <nav className="side-nav">
          {navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => navigate(item.id)}><Icon size={19}/><span>{item.label}</span>{page === item.id && <i/>}</button>; })}
        </nav>
        <div className="sidebar-bottom">
          <div className="colab-mini"><div className="colab-mini-icon"><HardDrive size={18}/></div><div><strong>Google Colab</strong><span>بيئة تشغيل المحرك</span></div><span className="mini-status"/></div>
          <div className="sidebar-version">abbasdeep <span>v0.2.0</span></div>
        </div>
      </aside>

      {menuOpen && <button className="mobile-overlay" onClick={() => setMenuOpen(false)} aria-label="إغلاق القائمة"/>}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-start"><button className="menu-trigger icon-button" onClick={() => setMenuOpen(true)} aria-label="القائمة"><span className="menu-lines"/></button><div className="breadcrumb">استوديو الأصوات <ChevronLeft size={14}/><strong>{page === "home" ? "مركز التشغيل" : "طريقة التشغيل"}</strong></div></div>
          <div className="topbar-end"><div className="runtime-pill"><span className="status-dot status-idle"/> <span>يتطلب جلسة Colab</span></div><button className="topbar-launch" onClick={openNotebook}><Zap size={15}/> فتح الدفتر</button><div className="profile-avatar">A</div></div>
        </header>

        <div className="page-wrap launcher-page">
          {page === "home" ? (
            <>
              <div className="page-heading"><div><div className="page-kicker">ABBASDEEP / COLAB WORKSPACE</div><h1>استوديو الأصوات</h1><p>واجهة abbasdeep تعمل داخل دفتر Google Colab، دون خادم GPU خاص.</p></div></div>
              <section className="launcher-hero">
                <div className="launcher-hero-copy">
                  <div className="eyebrow"><AudioWaveform size={14}/> ABBASDEEP VOICE STUDIO</div>
                  <h2>افتح الاستوديو وابدأ العمل.</h2>
                  <p>يجهّز الدفتر محرك Applio داخل جلسة Colab، ثم يعرض واجهة abbasdeep مباشرة في مخرجات الدفتر. لا حاجة إلى رابط Gradio منفصل أو iframe.</p>
                  <div className="launcher-actions"><button className="button button-light" onClick={openNotebook}><Play size={17} fill="currentColor"/> فتح abbasdeep في Colab</button><button className="button button-ghost-light" onClick={() => navigate("guide")}><BookOpen size={16}/> شرح التشغيل</button></div>
                </div>
                <div className="launcher-hero-art" aria-hidden="true"><div className="launcher-orb launcher-orb-a"/><div className="launcher-orb launcher-orb-b"/><div className="launcher-wave">{Array.from({length:27},(_,i)=><i key={i} style={{height:`${18+Math.abs(Math.sin(i*.72))*(i%4===0?72:45)}px`}}/>)}</div><div className="launcher-float"><AudioWaveform size={18}/> Colab-powered studio</div></div>
              </section>
              <div className="section-heading"><div><h3>ثلاث خطوات فقط</h3><p>لا تنقل الملفات أو الجلسات إلى خادم خارجي.</p></div></div>
              <div className="launcher-steps">
                <section className="panel launcher-step"><span className="launcher-step-number">01</span><div className="launcher-step-icon"><NotebookPen size={22}/></div><h3>افتح دفتر Colab</h3><p>افتح دفتر abbasdeep باستخدام حساب Google الذي ستشغّل عليه الجلسة.</p><button className="button button-primary button-full" onClick={openNotebook}>فتح الدفتر <ExternalLink size={15}/></button></section>
                <section className="panel launcher-step"><span className="launcher-step-number">02</span><div className="launcher-step-icon"><HardDrive size={22}/></div><h3>اربط Drive وشغّل الخلايا</h3><p>امنح صلاحية Drive، ثم شغّل التثبيت والمزامنة بالترتيب. استخدم GPU فقط عندما يتاح لك.</p><button className="button button-outline button-full" onClick={() => navigate("guide")}>عرض الخطوات <ChevronLeft size={15}/></button></section>
                <section className="panel launcher-step"><span className="launcher-step-number">03</span><div className="launcher-step-icon"><AudioWaveform size={22}/></div><h3>استخدم واجهة abbasdeep</h3><p>تظهر الواجهة داخل الدفتر نفسه. رابط المشاركة ليس مطلوباً لتشغيل الواجهة داخل Colab.</p><div className="step-status"><CheckCircle2 size={16}/> دون لصق رابط يدوي</div></section>
              </div>
              <section className="launcher-note"><ShieldCheck size={20}/><div><strong>الخصوصية وطريقة الاستخدام</strong><p>Drive والنماذج تبقى في حسابك. لا يطلب abbasdeep كلمة مرور Google أو رموز الوصول. استخدم أصواتك أو أصواتاً لديك إذن صريح باستخدامها؛ لا تستخدمه لانتحال هوية شخص أو تضليل الآخرين.</p></div></section>
              <section className="launcher-links panel"><div><h3>روابط الدفتر والمصدر</h3><p>إن لم يفتح Colab الدفتر الخاص مباشرة، افتح GitHub أو نزّل ملف Notebook ثم ارفعه من قائمة File داخل Colab.</p></div><div className="launcher-link-actions"><button className="button button-soft" onClick={openGithubNotebook}><Github size={16}/> GitHub</button><button className="button button-outline" onClick={downloadNotebook}><NotebookPen size={16}/> تنزيل الدفتر</button></div></section>
            </>
          ) : (
            <>
              <div className="page-heading"><div><div className="page-kicker">ABBASDEEP / QUICK START</div><h1>طريقة التشغيل</h1><p>اتبع الخطوات بالترتيب داخل Google Colab.</p></div></div>
              <div className="guide-list">
                <section className="panel guide-card"><span>1</span><div><h3>افتح دفتر abbasdeep</h3><p>اضغط فتح الدفتر. إذا طلب Colab الوصول إلى GitHub الخاص، وافق على ربط GitHub أو نزّل ملف الدفتر وارفعه يدوياً.</p><button className="button button-primary" onClick={openNotebook}>فتح abbasdeep في Colab <ExternalLink size={15}/></button></div></section>
                <section className="panel guide-card"><span>2</span><div><h3>اربط Google Drive</h3><p>شغّل أول خلية ووافق على إذن Drive. ستُستخدم صلاحية Drive لحفظ مجلد النماذج وملفات التدريب في مجلد abbasdeepBackup.</p></div></section>
                <section className="panel guide-card"><span>3</span><div><h3>جهّز بيئة التشغيل</h3><p>شغّل خلية تثبيت Applio وانتظر ظهور رسالة اكتمال تثبيت المتطلبات. عند بدء جلسة Colab جديدة ستحتاج إلى تكرار هذه الخطوة.</p></div></section>
                <section className="panel guide-card"><span>4</span><div><h3>زامن الملفات</h3><p>شغّل خلية المزامنة حتى تكون النماذج وملفات التدريب محفوظة في Google Drive قبل تشغيل التطبيق.</p></div></section>
                <section className="panel guide-card"><span>5</span><div><h3>شغّل واجهة abbasdeep</h3><p>شغّل خلية التشغيل الأخيرة. ستظهر الواجهة داخل مخرجات الخلية. اترك جلسة Colab مفتوحة أثناء العمل.</p></div></section>
              </div>
              <div className="policy-card"><Info size={18}/><p>حدود GPU ومدة الجلسة وإمكانية توفر الموارد يحددها Google Colab وتتغير حسب الحساب والاستخدام. لا توجد طريقة مضمونة لاستمرار الجلسة بعد انتهاء الموارد أو الخمول.</p></div>
              <section className="launcher-links panel"><div><h3>فتح الدفتر الآن</h3><p>النسخة الموجودة في مستودعك الخاص.</p></div><button className="button button-primary" onClick={openNotebook}>فتح الدفتر <ExternalLink size={15}/></button></section>
            </>
          )}
          <footer className="page-footer"><span>abbasdeep © 2026</span><span>واجهة تشغيل · محرك Applio · Google Colab</span></footer>
        </div>
      </main>
      <nav className="mobile-nav">{navItems.map((item)=>{const Icon=item.icon;return <button key={item.id} className={page===item.id?"mobile-nav-active":""} onClick={()=>navigate(item.id)}><Icon size={19}/><span>{item.label}</span></button>;})}</nav>
    </div>
  );
}
export default App;
