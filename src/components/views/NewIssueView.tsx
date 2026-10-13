import React, { useState, useRef } from 'react';
import { 
  AlertTriangle, 
  Droplets, 
  Trash2, 
  Lightbulb, 
  Waves, 
  HelpCircle,
  MapPin, 
  UploadCloud, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Bot, 
  X, 
  Camera, 
  FileText, 
  ShieldCheck,
  Send,
  Loader2,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CivicCategory, AiAnalysisResult } from '../../types';
import { CivicMap } from '../common/CivicMap';
import { UrgencyBadge } from '../common/Badges';

export const NewIssueView: React.FC = () => {
  const { 
    t, 
    language, 
    draftIssue, 
    setDraftIssue, 
    createReport, 
    openReportDetails, 
    addToast 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
  const [locatingGps, setLocatingGps] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(draftIssue.evidenceUrl || null);
  const [imageName, setImageName] = useState<string | null>(draftIssue.evidenceName || null);
  const [complaintText, setComplaintText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: Array<{ id: CivicCategory; title: string; desc: string; icon: any; color: string; bg: string }> = [
    { id: 'road_damage', title: t.categories.road_damage.title, desc: t.categories.road_damage.desc, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
    { id: 'water_leakage', title: t.categories.water_leakage.title, desc: t.categories.water_leakage.desc, icon: Droplets, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
    { id: 'sanitation', title: t.categories.sanitation.title, desc: t.categories.sanitation.desc, icon: Trash2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { id: 'streetlights', title: t.categories.streetlights.title, desc: t.categories.streetlights.desc, icon: Lightbulb, color: 'text-yellow-300', bg: 'bg-yellow-500/10 border-yellow-500/30' },
    { id: 'drainage', title: t.categories.drainage.title, desc: t.categories.drainage.desc, icon: Waves, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
    { id: 'other', title: t.categories.other.title, desc: t.categories.other.desc, icon: HelpCircle, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  ];

  // GPS geolocation handler
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      addToast('error', 'Geolocation is not supported by your browser.');
      return;
    }

    setLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setDraftIssue(prev => ({
          ...prev,
          latitude,
          longitude,
          address: `Geo-tagged coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        }));
        setLocatingGps(false);
        addToast('success', t.wizard.locationAcquired);
      },
      (err) => {
        setLocatingGps(false);
        addToast('info', 'Location permission denied. You can manually enter street or click on map.');
      },
      { timeout: 8000 }
    );
  };

  // Image upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      addToast('error', 'File size exceeds 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setImageName(file.name);
      setDraftIssue(prev => ({
        ...prev,
        evidenceUrl: base64,
        evidenceName: file.name
      }));
      addToast('success', 'Photo evidence attached.');
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageName(null);
    setDraftIssue(prev => ({
      ...prev,
      evidenceUrl: undefined,
      evidenceName: undefined
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Trigger AI Analysis for Step 5
  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draftIssue.title,
          description: draftIssue.description,
          category: draftIssue.category,
          location: `${draftIssue.address}, ${draftIssue.ward}`,
          language
        })
      });

      if (res.ok) {
        const data: AiAnalysisResult = await res.json();
        setAiAnalysis(data);
        setComplaintText(data.complaint_draft || '');
        if (data.category && data.category !== draftIssue.category) {
          // AI refined the category
          setDraftIssue(prev => ({ ...prev, category: data.category }));
        }
      }
    } catch (err) {
      console.warn('AI analysis failed, using local drafting:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!draftIssue.title.trim()) {
        addToast('error', 'Please enter an issue title.');
        return;
      }
      if (!draftIssue.description.trim()) {
        addToast('error', 'Please provide a description.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
      runAiAnalysis();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const newReport = await createReport({
        title: draftIssue.title,
        description: draftIssue.description,
        category: draftIssue.category,
        latitude: draftIssue.latitude,
        longitude: draftIssue.longitude,
        address: draftIssue.address,
        ward: draftIssue.ward,
        evidenceUrl: imagePreview || undefined,
        evidenceName: imageName || undefined,
        aiSummary: aiAnalysis?.summary,
        complaintDraft: complaintText,
        urgency: aiAnalysis?.urgency || 'medium',
        department: aiAnalysis?.department
      });

      if (newReport) {
        openReportDetails(newReport.id);
      }
    } catch {
      addToast('error', 'Failed to lodge report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER & STEPPER */}
      <div className="p-6 rounded-2xl bg-[#071B38] border border-[#164A80] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#164A80]/60 mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-white">
              Report a Civic Grievance
            </h1>
            <p className="text-xs text-[#8EA9CF]">
              Multi-step verified submission with automated AI triage & municipal drafting
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#00C8FF] bg-[#00C8FF]/10 px-3 py-1 rounded-full border border-[#00C8FF]/30 self-start sm:self-auto">
            Step {currentStep} of 5
          </span>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
          {[
            { num: 1, label: t.wizard.step1 },
            { num: 2, label: t.wizard.step2 },
            { num: 3, label: t.wizard.step3 },
            { num: 4, label: t.wizard.step4 },
            { num: 5, label: t.wizard.step5 },
          ].map(s => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div 
                key={s.num} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => {
                  if (s.num < currentStep) setCurrentStep(s.num);
                }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs transition mb-1.5 ${
                    isDone
                      ? 'bg-[#16D6B0] text-black font-bold shadow-[0_0_12px_#16D6B0]'
                      : isCurrent
                      ? 'bg-gradient-to-r from-[#00C8FF] to-[#246BFD] text-black font-bold shadow-[0_0_15px_#00C8FF]'
                      : 'bg-[#0A2040] text-[#8EA9CF] border border-[#164A80]'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                <span className={`text-[10px] hidden sm:block truncate w-full ${isCurrent ? 'text-[#00C8FF] font-bold' : 'text-[#8EA9CF]'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="p-6 rounded-2xl bg-[#071B38] border border-[#164A80] shadow-xl">
        {/* STEP 1: CATEGORY SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white mb-1">
                {t.wizard.selectCategory}
              </h2>
              <p className="text-xs text-[#8EA9CF]">
                {t.wizard.selectCategoryDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {categories.map(cat => {
                const Icon = cat.icon;
                const isSelected = draftIssue.category === cat.id;

                return (
                  <div
                    key={cat.id}
                    onClick={() => setDraftIssue(prev => ({ ...prev, category: cat.id }))}
                    className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#0A2040] border-[#00C8FF] shadow-[0_0_20px_rgba(0,200,255,0.25)]'
                        : 'bg-[#0A2040]/40 border-[#164A80]/60 hover:border-[#164A80] hover:bg-[#0A2040]/70'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cat.bg}`}>
                      <Icon className={`w-5 h-5 ${cat.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{cat.title}</span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#00C8FF] text-black flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8EA9CF] leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-white mb-1">
                {t.wizard.step2}: Issue Title & Description
              </h2>
              <p className="text-xs text-[#8EA9CF]">
                Provide factual observations to help municipal engineers understand the scope.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8EA9CF] mb-1.5">
                  {t.wizard.issueTitle} *
                </label>
                <input
                  type="text"
                  value={draftIssue.title}
                  onChange={(e) => setDraftIssue(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t.wizard.issueTitlePlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A2040] border border-[#164A80] text-sm text-white placeholder-[#8EA9CF]/60 focus:outline-none focus:border-[#00C8FF] transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8EA9CF]">
                    {t.wizard.description} *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (!draftIssue.description) {
                        setDraftIssue(prev => ({
                          ...prev,
                          description: 'There is a severe infrastructure issue noticed here that has remained unresolved. It creates immediate hazards for vehicles and pedestrians, and requires prompt field inspection and repair.'
                        }));
                      }
                    }}
                    className="text-[11px] text-[#00C8FF] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Suggest Text</span>
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={draftIssue.description}
                  onChange={(e) => setDraftIssue(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t.wizard.descriptionPlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A2040] border border-[#164A80] text-sm text-white placeholder-[#8EA9CF]/60 focus:outline-none focus:border-[#00C8FF] transition leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-white mb-1">
                {t.wizard.locationHeading}
              </h2>
              <p className="text-xs text-[#8EA9CF]">
                {t.wizard.locationDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8EA9CF] mb-1.5">
                  {t.wizard.addressLabel}
                </label>
                <input
                  type="text"
                  value={draftIssue.address}
                  onChange={(e) => setDraftIssue(prev => ({ ...prev, address: e.target.value }))}
                  placeholder={t.wizard.addressPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A2040] border border-[#164A80] text-sm text-white focus:outline-none focus:border-[#00C8FF] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8EA9CF] mb-1.5">
                  {t.wizard.wardLabel}
                </label>
                <input
                  type="text"
                  value={draftIssue.ward}
                  onChange={(e) => setDraftIssue(prev => ({ ...prev, ward: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A2040] border border-[#164A80] text-sm text-white focus:outline-none focus:border-[#00C8FF] transition"
                />
              </div>
            </div>

            {/* GPS Trigger Button */}
            <div>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locatingGps}
                className="px-4 py-2 rounded-xl bg-[#0A2040] hover:bg-[#164A80] border border-[#00C8FF]/40 text-xs font-semibold text-[#00C8FF] transition flex items-center gap-2"
              >
                {locatingGps ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                <span>{locatingGps ? t.wizard.locating : t.wizard.detectLocation}</span>
              </button>
            </div>

            {/* Interactive Pin-Drop Map */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8EA9CF] mb-2">
                Pin Location on Map
              </label>
              <CivicMap
                reports={[]}
                center={[draftIssue.latitude, draftIssue.longitude]}
                zoom={14}
                height="260px"
                allowPinDrop={true}
                onLocationSelect={(lat, lng) => {
                  setDraftIssue(prev => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                    address: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
                  }));
                  addToast('info', `Pinned at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                }}
              />
            </div>
          </div>
        )}

        {/* STEP 4: EVIDENCE */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-white mb-1">
                {t.wizard.evidenceHeading}
              </h2>
              <p className="text-xs text-[#8EA9CF]">
                {t.wizard.evidenceDesc}
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />

            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#164A80] hover:border-[#00C8FF] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition bg-[#0A2040]/30 hover:bg-[#0A2040]/50"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#00C8FF]/10 border border-[#00C8FF]/30 flex items-center justify-center text-[#00C8FF] mb-3">
                  <Camera className="w-7 h-7" />
                </div>
                <div className="text-sm font-bold text-white mb-1">
                  {t.wizard.dragDropText}
                </div>
                <div className="text-xs text-[#8EA9CF]">
                  {t.wizard.supportedFiles}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#0A2040] border border-[#164A80] space-y-3">
                <div className="relative rounded-xl overflow-hidden max-h-64 border border-[#164A80] flex justify-center bg-black/40">
                  <img
                    src={imagePreview}
                    alt="Evidence Preview"
                    className="max-h-64 object-contain"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white transition"
                    title={t.wizard.removeFile}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-[#8EA9CF]">
                  <span className="font-mono text-white truncate max-w-xs">{imageName}</span>
                  <button
                    onClick={removeImage}
                    className="text-rose-400 hover:underline font-semibold"
                  >
                    {t.wizard.removeFile}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: REVIEW & AI TRIAGE */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00C8FF] animate-pulse" />
                <h2 className="text-base font-bold text-white">
                  {t.wizard.reviewHeading}
                </h2>
              </div>
              <p className="text-xs text-[#8EA9CF] mt-1">
                {t.wizard.reviewDesc}
              </p>
            </div>

            {isAnalyzing ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#00C8FF] animate-spin" />
                <div className="text-sm font-bold text-white">
                  Analyzing Grievance with SAHAAYA AI Engine...
                </div>
                <div className="text-xs text-[#8EA9CF]">
                  Categorizing jurisdiction, assessing public hazard, and drafting municipal petition.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* AI Assessment Card */}
                {aiAnalysis && (
                  <div className="p-4 rounded-xl bg-[#0A2040] border border-[#00C8FF]/40 space-y-3 shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#164A80]/70">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-[#00C8FF]" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          AI Triage Assessment
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#00C8FF]/15 text-[#00C8FF] border border-[#00C8FF]/30 font-semibold">
                          {aiAnalysis.confidence}% Confidence
                        </span>
                      </div>
                      <UrgencyBadge urgency={aiAnalysis.urgency} />
                    </div>

                    <p className="text-xs text-[#EAF3FF] leading-relaxed">
                      {aiAnalysis.summary}
                    </p>

                    <div className="text-xs text-[#8EA9CF]">
                      <span className="font-semibold text-white">Designated Body: </span>
                      <span className="text-[#00C8FF]">{aiAnalysis.department}</span>
                    </div>

                    {/* Missing Details Checklist */}
                    {aiAnalysis.missing_details && aiAnalysis.missing_details.length > 0 && (
                      <div className="pt-2 border-t border-[#164A80]/60">
                        <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Info className="w-3.5 h-3.5" />
                          <span>{t.wizard.missingInfoNotice}</span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-[#8EA9CF] space-y-1">
                          {aiAnalysis.missing_details.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Editable Formal Complaint Letter Draft */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8EA9CF]">
                      Formal Municipal Complaint Letter (Editable)
                    </label>
                    <span className="text-[11px] text-[#00C8FF]">Ready for submission</span>
                  </div>
                  <textarea
                    rows={8}
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#06142B] border border-[#164A80] text-xs font-mono text-[#EAF3FF] focus:outline-none focus:border-[#00C8FF] transition leading-relaxed resize-y"
                  />
                  <p className="text-[10px] text-[#8EA9CF] mt-1">
                    * This draft is prepared for the citizen's review. You may modify names, dates, or details freely before saving.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BOTTOM CONTROLS */}
        <div className="flex items-center justify-between pt-6 border-t border-[#164A80]/60 mt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2.5 rounded-xl bg-[#0A2040] hover:bg-[#164A80] text-xs font-semibold text-[#8EA9CF] hover:text-white transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.wizard.back}</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#246BFD] to-[#7028FF] text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(36,107,253,0.3)] hover:opacity-95 transition flex items-center gap-1.5"
            >
              <span>{t.wizard.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting || isAnalyzing}
              onClick={handleSubmit}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#00C8FF] to-[#246BFD] text-black text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(0,200,255,0.4)] hover:opacity-95 transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>{t.wizard.submitting}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-black" />
                  <span>{t.wizard.submitReport}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
