import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  AudioLines, AudioWaveform, ArrowLeft, ArrowUpLeft, BookOpen, Check,
  CheckCircle2, ChevronLeft, CircleHelp, Cloud, ExternalLink, FileAudio,
  FileUp, FolderOpen, Headphones, Home, Info, Link2, Play, Plus,
  ShieldCheck, Smartphone, Sparkles, Upload, Waves, X, Zap
} from "lucide-react";

const COLAB_URL = "https://colab.research.google.com/github/iahispano/applio/blob/main/assets/Applio.ipynb";

type Page = "home" | "connect" | "convert" | "training" | "voices" | "guide";

const navItems: { id: Page; label: string; icon: typeof Home }[] = [
  { id: "home", label: "الرئيسية", icon: Home },
  { id: "connect", label: "ربط المشروع", icon: Link2 },
  { id: "convert", label: "تحويل الصوت", icon: AudioLines },
  { id: "training", label: "تدريب نموذج", icon: Waves },
  { id: "voices", label: "مكتبة الأصوات", icon: FolderOpen },
  { id: "guide", label: "دليل التشغيل", icon: BookOpen }
];

const pageTitles: Record<Page, { title: string; subtitle: string }> = {
  home: { title: "مساحة العمل", subtitle: "كل أدواتك الصوتية في مكان واحد." },
  connect: { title: "ربط المشروع", subtitle: "أدخل رابط Gradio الذي أنشأه دفتر Applio في Colab لعرضه داخل مساحة العمل." },
  convert: { title: "تحويل الصوت", subtitle: "جهّز التسجيل واختر نموذج الصوت، ثم أكمل المعالجة في Applio." },
  training: { title: "تدريب نموذج صوتي", subtitle: "جهّز ملفات التسجيل قبل فتح دفتر Applio في Colab." },
  voices: { title: "مكتبة الأصوات", subtitle: "تابع نماذجك التي أنشأتها واحفظها في Google Drive." },
  guide: { title: "دليل التشغيل", subtitle: "خطوات واضحة لبدء جلسة Applio المجانية عبر Colab." }
};

function BrandMark() {
  return <div className="brand-mark"><AudioWaveform size={25} strokeWidth={2.1} /></div>;
}

function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [trainingFiles, setTrainingFiles] = useState<File[]>([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [gradioUrl, setGradioUrl] = useState(() => localStorage.getItem("abbasdeep-gradio-url") || "");
  const [activeGradioUrl, setActiveGradioUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [notice, setNotice] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!selectedAudio) {
      setAudioUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(selectedAudio);
    setAudioUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedAudio]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 3600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const currentPage = pageTitles[page];

  const openColab = () => {
    window.open(COLAB_URL, "_blank", "noopener,noreferrer");
  };

  const connectProject = () => {
    setUrlError("");
    try {
      const parsed = new URL(gradioUrl.trim());
      const allowedHost = parsed.hostname === "gradio.live" || parsed.hostname.endsWith(".gradio.live");
      if (parsed.protocol !== "https:" || !allowedHost || parsed.username || parsed.password || (parsed.port && parsed.port !== "443")) {
        setUrlError("أدخل رابط HTTPS صالحاً من نطاق gradio.live، مثل https://95c194d89bf572aa0b.gradio.live/");
        return;
      }
      const cleanUrl = parsed.href;
      localStorage.setItem("abbasdeep-gradio-url", cleanUrl);
      setGradioUrl(cleanUrl);
      setActiveGradioUrl(cleanUrl);
      setPage("connect");
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setUrlError("الرابط غير مكتمل. انسخ رابط Gradio الذي ظهر في خلية تشغيل Applio والصقه هنا.");
    }
  };

  const openApplioExternally = () => {
    if (!activeGradioUrl) return;
    window.open(activeGradioUrl, "_blank", "noopener,noreferrer");
  };

  const openApplioInCurrentTab = () => {
    if (!activeGradioUrl) return;
    window.location.assign(activeGradioUrl);
  };

  const disconnectProject = () => {
    setActiveGradioUrl("");
    setGradioUrl("");
    localStorage.removeItem("abbasdeep-gradio-url");
    setUrlError("");
    setNotice("تم فصل رابط مشروع Applio من هذه الواجهة.");
  };

  const onAudioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && !file.type.startsWith("audio/")) {
      setNotice("يرجى اختيار ملف صوتي بصيغة مدعومة.");
      return;
    }
    setSelectedAudio(file);
  };

  const onTrainingFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("audio/"));
    setTrainingFiles(files);
    if (files.length === 0) setNotice("لم يتم العثور على ملفات صوتية في الاختيار.");
  };

  const navigate = (next: Page) => {
    setPage(next);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageContent = useMemo(() => {
    if (page === "home") {
      return (
        <>
          <section className="hero-card">
            <div className="hero-copy">
              <div className="eyebrow"><Sparkles size={14} /> استوديو الذكاء الصوتي</div>
              <h2>صوتك، مساحة عملك.</h2>
              <p>واجهة أبسط للوصول إلى Applio وتشغيل أدواته من هاتفك، مع الاحتفاظ بـ Google Colab كمحرك للمعالجة.</p>
              <div className="hero-actions">
                <button className="button button-light" onClick={openColab}><Play size={17} fill="currentColor" /> تشغيل Applio على Colab</button>
                <button className="button button-ghost-light" onClick={() => navigate("connect")}><Link2 size={16} /> ربط المشروع <ChevronLeft size={17} /></button>
              </div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="orb orb-one" />
              <div className="orb orb-two" />
              <div className="wave-visual">
                {Array.from({ length: 27 }, (_, i) => <i key={i} style={{ height: `${18 + Math.abs(Math.sin(i * 0.72)) * (i % 4 === 0 ? 74 : 48)}px` }} />)}
              </div>
              <div className="hero-floating"><AudioWaveform size={19} /><span>Voice studio</span></div>
            </div>
            <div className="hero-glow" />
          </section>

          <div className="section-heading">
            <div><h3>ابدأ من هنا</h3><p>انتقل مباشرة إلى المهمة التي تريد تنفيذها.</p></div>
          </div>
          <div className="action-grid">
            <button className="action-card" onClick={() => navigate("convert")}>
              <span className="action-icon purple"><AudioLines size={22} /></span>
              <span className="action-text"><strong>تحويل الصوت</strong><small>استخدام نموذج صوت جاهز</small></span>
              <ArrowUpLeft className="action-arrow" size={18} />
            </button>
            <button className="action-card" onClick={() => navigate("training")}>
              <span className="action-icon blue"><Waves size={22} /></span>
              <span className="action-text"><strong>تدريب نموذج</strong><small>إعداد تسجيلات صوتية جديدة</small></span>
              <ArrowUpLeft className="action-arrow" size={18} />
            </button>
            <button className="action-card" onClick={() => navigate("voices")}>
              <span className="action-icon green"><FolderOpen size={22} /></span>
              <span className="action-text"><strong>مكتبة الأصوات</strong><small>إدارة نماذجك المحفوظة</small></span>
              <ArrowUpLeft className="action-arrow" size={18} />
            </button>
          </div>

          <div className="project-connect-grid">
            <section className="panel project-step-card">
              <div className="project-step-number">01</div>
              <div className="project-step-icon"><Cloud size={22} /></div>
              <div className="project-step-copy"><h3>تشغيل Applio على Colab</h3><p>افتح دفتر Applio الرسمي، شغّل خلايا الإعداد والتشغيل، وانتظر ظهور رابط Gradio.</p></div>
              <button className="button button-primary button-full" onClick={openColab}>فتح Google Colab <ExternalLink size={16} /></button>
              <p className="micro-note"><Info size={13} /> موارد GPU ومدة الجلسة تخضع لحدود Google Colab.</p>
            </section>
            <section className="panel project-step-card project-link-card">
              <div className="project-step-number">02</div>
              <div className="project-step-icon"><Link2 size={22} /></div>
              <div className="project-step-copy"><h3>ربط المشروع</h3><p>بعد تشغيل Applio، انسخ رابط المشاركة الذي ينتهي بـ <code>gradio.live</code> والصقه هنا.</p></div>
              <label className="field-label" htmlFor="home-gradio-url">رابط تطبيق Applio في Colab</label>
              <input id="home-gradio-url" className="text-input" dir="ltr" inputMode="url" autoComplete="url" placeholder="https://95c194d89bf572aa0b.gradio.live/" value={gradioUrl} onChange={(event) => { setGradioUrl(event.target.value); setUrlError(""); }} onKeyDown={(event) => { if (event.key === "Enter") connectProject(); }} />
              {urlError && <p className="field-error">{urlError}</p>}
              <button className="button button-primary button-full" onClick={connectProject}><Link2 size={16} /> اتصال وعرض Applio</button>
              <p className="micro-note"><ShieldCheck size={14} /> يُحفظ الرابط على هذا الجهاز فقط. لن نطلب بيانات دخول Google أو رموز الجلسة.</p>
            </section>
          </div>
          <section className="panel privacy-note-panel">
            <div className="note-icon"><ShieldCheck size={20} /></div>
            <div><h3>خصوصيتك أولاً</h3><p>سجّل الدخول وامنح أذونات Drive داخل Google Colab نفسه. لا تدخل كلمة مرور Google أو رموز الوصول في abbasdeep.</p><button className="text-button" onClick={() => navigate("guide")}>اقرأ دليل التشغيل <ArrowLeft size={15} /></button></div>
          </section>
        </>
      );
    }

    if (page === "convert") {
      return (
        <div className="content-column">
          <section className="panel workflow-panel">
            <div className="step-label"><span>01</span> ملف الصوت المصدر</div>
            <label className="upload-zone audio-upload">
              <input type="file" accept="audio/*" onChange={onAudioChange} />
              <span className="upload-symbol"><FileAudio size={25} /></span>
              <strong>{selectedAudio ? selectedAudio.name : "اختر ملفاً صوتياً من جهازك"}</strong>
              <small>{selectedAudio ? `${(selectedAudio.size / 1024 / 1024).toFixed(2)} MB · جاهز للمعاينة` : "MP3 أو WAV أو M4A أو أي صيغة صوتية يدعمها المتصفح"}</small>
              <span className="button button-outline"><Upload size={16} /> استعراض الملفات</span>
            </label>
            {audioUrl && <div className="audio-preview"><div><Headphones size={18} /><span>معاينة التسجيل</span></div><audio controls src={audioUrl} /></div>}
          </section>

          <section className="panel workflow-panel">
            <div className="step-label"><span>02</span> نموذج الصوت المستهدف</div>
            <div className="empty-model-select">
              <div className="model-empty-icon"><FolderOpen size={22} /></div>
              <div><strong>اختر النموذج من مكتبة Applio</strong><p>تظهر النماذج التي أعددتها داخل Applio/Google Drive. هذه النسخة الأولية لا تستورد النماذج تلقائياً.</p></div>
              <button className="button button-outline" onClick={() => navigate("voices")}>مكتبة الأصوات</button>
            </div>
          </section>

          <section className="info-banner"><Info size={18} /><p>هذه الصفحة تجهّز ملفك وتوجّهك إلى Applio. التحويل الفعلي يتم داخل جلسة Applio، ولا تتم معالجة الصوت داخل هذا المتصفح في هذه المرحلة.</p></section>
          <button className="button button-primary button-large" onClick={openColab}><ExternalLink size={17} /> فتح Applio لمتابعة التحويل</button>
        </div>
      );
    }

    if (page === "training") {
      return (
        <div className="content-column">
          <section className="panel workflow-panel">
            <div className="step-label"><span>01</span> تسجيلات التدريب</div>
            <label className="upload-zone training-upload">
              <input type="file" accept="audio/*" multiple onChange={onTrainingFilesChange} />
              <span className="upload-symbol"><FileUp size={26} /></span>
              <strong>أضف ملفات التسجيل الصوتي</strong>
              <small>اختر عدة ملفات من جهازك لمراجعة أسمائها قبل رفعها إلى بيئة Applio.</small>
              <span className="button button-outline"><Plus size={16} /> اختيار ملفات</span>
            </label>
            {trainingFiles.length > 0 && (
              <div className="file-list">
                <div className="file-list-heading"><strong>الملفات المختارة ({trainingFiles.length})</strong><button className="text-button danger-text" onClick={() => setTrainingFiles([])}>مسح القائمة</button></div>
                {trainingFiles.map((file, index) => <div className="file-row" key={`${file.name}-${index}`}><FileAudio size={17} /><span>{file.name}</span><small>{(file.size / 1024 / 1024).toFixed(2)} MB</small><CheckCircle2 size={16} className="file-check" /></div>)}
              </div>
            )}
          </section>
          <section className="panel tips-panel">
            <h3><Sparkles size={18} /> قبل بدء التدريب</h3>
            <ul><li>استخدم تسجيلات تملكها أو لديك إذن صريح من صاحب الصوت لاستخدامها.</li><li>يفضل أن تكون التسجيلات واضحة وخالية من الموسيقى والضوضاء العالية.</li><li>تجنب خلط أصوات متحدثين مختلفين في مجموعة تدريب واحدة.</li><li>ستحتاج إلى رفع الملفات داخل واجهة Applio بعد فتح Colab؛ اختيارها هنا لا يرسلها تلقائياً.</li></ul>
          </section>
          <button className="button button-primary button-large" onClick={openColab}><ExternalLink size={17} /> فتح دفتر Applio لبدء التدريب</button>
        </div>
      );
    }

    if (page === "voices") {
      return (
        <div className="content-column">
          <section className="empty-library panel">
            <div className="empty-art"><div><AudioWaveform size={34} /></div><i /><i /><i /></div>
            <span className="eyebrow eyebrow-muted">مكتبتك الصوتية</span>
            <h2>ستظهر نماذجك هنا</h2>
            <p>أنشئ النموذج داخل Applio واحفظ ملفات النموذج والفهرس في Google Drive. في هذه النسخة الأولية، لا توجد مزامنة تلقائية مع Drive بعد.</p>
            <button className="button button-primary" onClick={openColab}><ExternalLink size={16} /> فتح Applio</button>
          </section>
          <section className="info-banner"><Info size={18} /><p>ملفات نماذج Applio قد تشمل امتدادات مثل <code>.pth</code> و<code>.index</code>. احتفظ بنسخة احتياطية منها في Drive.</p></section>
        </div>
      );
    }

    if (page === "connect") {
      return (
        <div className="content-column connect-workspace">
          <section className="panel connect-panel">
            <div className="panel-title-row">
              <div><h3>ربط مشروع Applio</h3><p>الصق رابط Gradio الذي أنشأته جلسة Colab.</p></div>
              <span className={`connect-badge ${activeGradioUrl ? "connected-badge" : ""}`}><Link2 size={14} /> {activeGradioUrl ? "تم إدخال الرابط" : "بانتظار الرابط"}</span>
            </div>
            <label className="field-label" htmlFor="gradio-url">رابط تطبيق Applio</label>
            <input id="gradio-url" className="text-input" dir="ltr" inputMode="url" autoComplete="url" placeholder="https://95c194d89bf572aa0b.gradio.live/" value={gradioUrl} onChange={(event) => { setGradioUrl(event.target.value); setUrlError(""); }} onKeyDown={(event) => { if (event.key === "Enter") connectProject(); }} />
            {urlError && <p className="field-error">{urlError}</p>}
            <div className="connect-actions">
              <button className="button button-primary" onClick={connectProject}><Link2 size={16} /> اتصال بالمشروع</button>
              <button className="button button-soft" onClick={openApplioExternally} disabled={!activeGradioUrl}><ExternalLink size={16} /> فتح خارجياً</button>
              <button className="button button-soft" onClick={disconnectProject}><X size={16} /> فصل الرابط</button>
            </div>
            <p className="micro-note"><Info size={14} /> إذا منع المتصفح عرض Gradio داخل إطار، استخدم زر «فتح خارجياً». قد يحتاج الرابط إلى جلسة Colab نشطة.</p>
          </section>

          {activeGradioUrl ? (
            <section className="gradio-workspace-panel">
              <div className="gradio-workspace-toolbar">
                <div><span className="gradio-live-indicator" /><strong>رابط Applio محفوظ</strong><small dir="ltr">{activeGradioUrl}</small></div>
                <button className="icon-button" onClick={openApplioExternally} aria-label="فتح واجهة Applio في تبويب جديد"><ExternalLink size={18} /></button>
              </div>
              <div className="gradio-launch-state">
                <div className="gradio-launch-icon"><AudioWaveform size={34} /></div>
                <span className="eyebrow eyebrow-muted">APPLIO / GRADIO SHARE</span>
                <h2>الرابط صالح، لكن لا يمكن ضمان عرضه داخل إطار</h2>
                <p>تم إدخال رابط Gradio وحفظه. بعض روابط المشاركة لا تسمح بتضمين الواجهة داخل موقع آخر؛ لذلك أزلنا مساحة الإطار الرمادية. افتح Applio مباشرة في هذه الشاشة لتحصل على الواجهة التفاعلية كاملة.</p>
                <div className="gradio-launch-actions">
                  <button className="button button-primary button-large" onClick={openApplioInCurrentTab}><Play size={17} fill="currentColor" /> تشغيل Applio في هذه الشاشة</button>
                  <button className="button button-outline" onClick={openApplioExternally}><ExternalLink size={16} /> فتح في تبويب جديد</button>
                </div>
                <p className="micro-note"><ShieldCheck size={14} /> يفتح الزر الأول رابط Gradio مباشرة في علامة التبويب الحالية. استخدم زر الرجوع في المتصفح للعودة إلى abbasdeep؛ سيبقى الرابط محفوظاً.</p>
              </div>
            </section>
          ) : (
            <section className="panel connect-empty-state">
              <div className="connect-empty-icon"><AudioWaveform size={32} /></div>
              <h2>مساحة Applio جاهزة للربط</h2>
              <p>1. شغّل دفتر Applio في Colab. 2. انسخ رابط <code>gradio.live</code> الذي يظهر في خلية التشغيل. 3. الصقه في الحقل أعلاه واضغط «اتصال بالمشروع».</p>
              <button className="button button-outline" onClick={openColab}><ExternalLink size={16} /> فتح دفتر Applio</button>
            </section>
          )}
          <section className="info-banner"><Info size={18} /><p>رابط Gradio يكون عاماً لمن يمتلكه، وينتهي عند انتهاء الجلسة أو صلاحية الرابط. لا تشارك الرابط علناً إذا كانت واجهة Applio تتيح عمليات أو ملفات لا تريد كشفها.</p></section>
          <section className="info-banner"><Info size={18} /><p>تنبيه Colab المجاني: قد تنهي Google الجلسة عند تجاوز واجهة الدفتر للاعتماد أساساً على واجهة ويب خارجية. لا يضمن abbasdeep أن استخدام iframe بهذه الطريقة مسموح أو مستقر على الخطة المجانية.</p></section>
        </div>
      );
    }

    return (
      <div className="content-column">
        <section className="panel guide-panel">
          <div className="guide-intro"><div className="guide-icon"><BookOpen size={22} /></div><div><h3>تشغيل Applio عبر Colab</h3><p>اتبع هذه الخطوات في كل مرة تريد فيها بدء جلسة جديدة.</p></div></div>
          <div className="guide-steps">
            <div className="guide-step"><span>1</span><div><strong>افتح دفتر Applio الرسمي</strong><p>سيتم فتح Google Colab في صفحة منفصلة. سجّل الدخول إلى حساب Google من موقع Google نفسه.</p></div><button className="icon-button" onClick={openColab} aria-label="فتح Colab"><ExternalLink size={17} /></button></div>
            <div className="guide-step"><span>2</span><div><strong>شغّل خلايا الدفتر</strong><p>اقرأ التعليمات، وامنح أذونات Drive التي يطلبها الدفتر عند الحاجة، ثم شغّل خلايا الإعداد والتشغيل بالترتيب.</p></div></div>
            <div className="guide-step"><span>3</span><div><strong>انتظر واجهة Applio</strong><p>عند اكتمال التشغيل، يعرض الدفتر رابط واجهة المشاركة إذا كانت متاحة في جلستك.</p></div></div>
            <div className="guide-step"><span>4</span><div><strong>اربط المشروع داخل abbasdeep</strong><p>ارجع إلى صفحة «ربط المشروع»، والصق رابط Gradio في الحقل المخصص ثم اضغط «اتصال بالمشروع» لعرض الواجهة داخل مساحة العمل إذا سمح المتصفح بذلك.</p></div><button className="icon-button" onClick={() => navigate("connect")} aria-label="ربط المشروع"><Link2 size={17} /></button></div>
          </div>
          <a className="button button-primary button-full" href={COLAB_URL} target="_blank" rel="noreferrer">فتح دفتر Applio الرسمي <ExternalLink size={16} /></a>
        </section>

        <section className="panel mobile-compat-panel">
          <div className="panel-title-row">
            <div><h3><Smartphone size={17} /> تحسين العرض على الهاتف</h3><p>واجهة Applio الحديثة تتضمن بالفعل تخطيطاً متجاوباً.</p></div>
            <span className="connect-badge">Mobile layout</span>
          </div>
          <div className="mobile-feature-grid">
            <div><CheckCircle2 size={17} /><span><strong>قائمة جانبية مختصرة</strong><small>تتحول إلى زر قائمة عند الشاشات الصغيرة.</small></span></div>
            <div><CheckCircle2 size={17} /><span><strong>تنقل مناسب للمس</strong><small>أقسام الواجهة تظهر في شبكة بدلاً من الشريط الجانبي.</small></span></div>
            <div><CheckCircle2 size={17} /><span><strong>نتائج عمودية</strong><small>مخرجات الصوت والرسوم تنتقل إلى عمود واحد على الهاتف.</small></span></div>
          </div>
          <div className="mobile-policy-note">
            <strong><Info size={15} /> تنبيه مهم لمستخدمي Colab المجاني</strong>
            <p>تنص سياسة Google على أن تجاوز واجهة الدفتر للاعتماد أساساً على واجهة ويب خارجية غير مسموح به في بيئة Colab المجانية. لذلك افتح الدفتر واستخدم واجهته بوصفها مساحة العمل الأساسية. لا تستخدم رابط Gradio كواجهة التشغيل الرئيسية في جلسة Colab المجانية.</p>
          </div>
          <p className="micro-note">أضفنا في المستودع تحسينات CSS اختيارية لعناصر Applio الصغيرة، مع أداة تطبيق آمنة وقابلة للتراجع. وهي مخصصة لبيئة محلية أو بيئة تشغيل تسمح بالواجهة الخارجية، وليست التفافاً على قيود Colab المجاني.</p>
        </section>

        <section className="panel guide-connect-cta">
          <div><h3>جاهز لربط Applio؟</h3><p>أدخل رابط Gradio من صفحة ربط المشروع ليظهر داخل abbasdeep.</p></div>
          <button className="button button-primary" onClick={() => navigate("connect")}><Link2 size={16} /> الانتقال إلى ربط المشروع</button>
        </section>
        <section className="info-banner"><Info size={18} /><p>قد تتوقف جلسة Colab أو ينتهي رابط المشاركة عند انتهاء الجلسة. افتح الدفتر مجدداً لإنشاء جلسة جديدة عند الحاجة.</p></section>
      </div>
    );
  }, [page, selectedAudio, audioUrl, trainingFiles, gradioUrl, activeGradioUrl, urlError]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup"><BrandMark /><div><strong>abbasdeep</strong><span>AI VOICE STUDIO</span></div><button className="mobile-close icon-button" onClick={() => setMobileMenuOpen(false)} aria-label="إغلاق القائمة"><X size={19} /></button></div>
        <div className="sidebar-caption">مساحة العمل</div>
        <nav className="side-nav">
          {navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => navigate(item.id)}><Icon size={19} /><span>{item.label}</span>{page === item.id && <i />}</button>; })}
        </nav>
        <div className="sidebar-bottom">
          <div className="colab-mini"><div className="colab-mini-icon"><Cloud size={18} /></div><div><strong>Google Colab</strong><span>المعالجة السحابية</span></div><span className="mini-status" /></div>
          <button className="help-link" onClick={() => navigate("guide")}><CircleHelp size={17} /> المساعدة والإعداد</button>
          <div className="sidebar-version">abbasdeep <span>v0.1.0</span></div>
        </div>
      </aside>

      {mobileMenuOpen && <button className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} aria-label="إغلاق القائمة" />}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-start"><button className="menu-trigger icon-button" onClick={() => setMobileMenuOpen(true)} aria-label="القائمة"><span className="menu-lines" /></button><div className="breadcrumb">استوديو الأصوات <ChevronLeft size={14} /> <strong>{currentPage.title}</strong></div></div>
          <div className="topbar-end"><div className="runtime-pill"><span className="status-dot status-idle" /> <span>{activeGradioUrl ? "رابط Applio محفوظ" : "Colab غير متصل"}</span></div><button className="topbar-launch" onClick={openColab}><Zap size={15} /> تشغيل Colab</button><div className="profile-avatar">A</div></div>
        </header>

        <div className="page-wrap">
          <div className="page-heading"><div><div className="page-kicker">ABBASDEEP / WORKSPACE</div><h1>{currentPage.title}</h1><p>{currentPage.subtitle}</p></div>{page !== "home" && <button className="button button-outline heading-action" onClick={openColab}><ExternalLink size={15} /> فتح Colab</button>}</div>
          {pageContent}
          <footer className="page-footer"><span>abbasdeep © 2026</span><span>واجهة مساعدة لـ Applio · محرك المعالجة بواسطة Google Colab</span></footer>
        </div>
      </main>

      <nav className="mobile-nav">
        {navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={page === item.id ? "mobile-nav-active" : ""} onClick={() => navigate(item.id)}><Icon size={19} /><span>{item.label}</span></button>; })}
      </nav>
      {notice && <div className="toast"><Check size={16} />{notice}</div>}
    </div>
  );
}

export default App;
