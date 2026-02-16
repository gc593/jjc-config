
import React, { useState, useEffect, useCallback } from 'react';
import { EventConfig, DeviceType, ThemePreset } from './types';
import { generateHTML } from './utils/template';
import { GoogleGenAI, Type } from "@google/genai";

// Reusable Components
const SidebarSection: React.FC<{
  title: string;
  id: string;
  isCollapsed: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}> = ({ title, id, isCollapsed, onToggle, children }) => {
  return (
    <div className="mb-6 border-b border-[#2a2a2a]">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between py-3 group"
      >
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#888] group-hover:text-[#ccc] transition-colors">
          {title}
        </span>
        <span className={`text-[#888] text-[10px] transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}>
          ▼
        </span>
      </button>
      {!isCollapsed && <div className="pb-4 animate-fadeIn">{children}</div>}
    </div>
  );
};

const Field: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-[11px] font-semibold text-[#888] mb-1.5 tracking-wide">
      {label}
    </label>
    {children}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="w-full bg-[#111] border border-[#2a2a2a] rounded-md px-3 py-2 text-[13px] text-[#e5e5e5] focus:border-[#c23b22] focus:outline-none transition-colors"
  />
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    rows={props.rows || 3}
    className="w-full bg-[#111] border border-[#2a2a2a] rounded-md px-3 py-2 text-[13px] text-[#e5e5e5] focus:border-[#c23b22] focus:outline-none transition-colors resize-y"
  />
);

const Toggle: React.FC<{
  label: string;
  active: boolean;
  onToggle: () => void;
}> = ({ label, active, onToggle }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-[13px] text-[#e5e5e5]">{label}</span>
    <button
      onClick={onToggle}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${active ? 'bg-[#c23b22]' : 'bg-[#2a2a2a]'}`}
    >
      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${active ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

const App: React.FC = () => {
  const [config, setConfig] = useState<EventConfig>({
    eventNameEn: 'Karaoke Night',
    eventNameJp: 'カラオケナイト',
    eventDate: 'Saturday, March 8 · 7:00 PM',
    eventDateCard: 'Sat, March 8',
    eventTime: '7:00 PM to 10:00 PM',
    eventVenue: 'Venue TBA',
    eventVenueNote: 'Ithaca, NY. Address shared upon RSVP.',
    eventPrice: '8',
    eventPriceNote: 'Covers room, food, and drinks.',
    eventCapacity: '25 spots',
    eventURL: 'https://cornelluniversity.campusgroups.com/jjc/rsvp_boot?id=YOUR_EVENT_ID',
    heroTagline: 'An evening of music, food, and good company. Hosted by the new JJC board for the people who actually make Johnson worth it.',
    transitionJp: '一期一会',
    transitionSub: 'One moment, one encounter',
    expHeadline: "This isn't another club event.",
    expDesc: "It's a private room, a full song catalog, a table full of food, and three hours where nobody talks about recruiting.",
    quoteText: '"We\'re not the old JJC. We\'re building something people actually want to show up to."',
    quoteAttr: 'JJC Executive Board · 2025',
    inc1: 'Private karaoke room',
    inc1d: 'Full catalog: English, Japanese, Korean, and more.',
    inc2: 'Food and drinks all night',
    inc2d: 'Provided throughout the evening. Come hungry.',
    inc3: 'Three hours, no interruptions',
    inc3d: 'Just music, friends, and questionable song choices.',
    inc4: 'A legitimate reason to close your laptop',
    inc4d: 'Casework can wait. Your duet partner can\'t.',
    accent: '#c23b22',
    gold: '#b8860b',
    paper: '#f5f0e8',
    dark: '#0a0a0a',
    ink: '#1a1a1a',
    showPreloader: true,
    showTransition: true,
    showExperience: true,
    showInclusions: true,
    showQuote: true,
    showKanji: true,
  });

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'sec-event': false,
    'sec-copy': false,
    'sec-inc': true,
    'sec-colors': true,
    'sec-sections': true,
  });

  const [device, setDevice] = useState<DeviceType>('desktop');
  const [toast, setToast] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateConfig = (key: keyof EventConfig, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const presets: Record<string, ThemePreset> = {
    default: { accent: '#c23b22', gold: '#b8860b', paper: '#f5f0e8', dark: '#0a0a0a', ink: '#1a1a1a' },
    midnight: { accent: '#4a7dff', gold: '#a0a0a0', paper: '#eef1f6', dark: '#0a0e1a', ink: '#1a1e2a' },
    sakura: { accent: '#d4737a', gold: '#c4956a', paper: '#faf5f3', dark: '#1a0a0e', ink: '#2a1a1e' },
    matcha: { accent: '#5a8a5a', gold: '#a09050', paper: '#f2f5ee', dark: '#0a1a0a', ink: '#1a2a1a' },
    ink: { accent: '#888888', gold: '#666666', paper: '#fafafa', dark: '#000000', ink: '#111111' },
    cornell: { accent: '#b31b1b', gold: '#8b0000', paper: '#faf8f5', dark: '#0a0404', ink: '#1a1010' }
  };

  const applyPreset = (name: string) => {
    const p = presets[name];
    setConfig(prev => ({ ...prev, ...p }));
    showToast(`Applied ${name} theme`);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setGenStep(s => (s + 1) % 4);
      }, 1500);
    } else {
      setGenStep(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const loadingMessages = ["Drafting...", "Polishing...", "Translating...", "Optimizing..."];

  const generateWithAI = async () => {
    if (!config.eventNameEn) {
      showToast("Please enter an event name first!");
      return;
    }
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as a senior event marketer for the Johnson Japan Club at Cornell. 
        Event Title: "${config.eventNameEn}"
        
        Write high-end, elite, and catchy marketing copy. 
        REQUIRED: 
        1. Translate the event name to cool, professional Japanese for 'eventNameJp'.
        2. Create unique 'expHeadline' and 'expDesc' for the theme.
        
        Return JSON matching this schema:
        {
          "eventNameJp": "Japanese translation of event name",
          "heroTagline": "A punchy 2-sentence hook",
          "expHeadline": "A creative section title for the experience section",
          "expDesc": "A descriptive paragraph explaining the vibe and experience",
          "inc1": "Feature 1", "inc1d": "Description 1",
          "inc2": "Feature 2", "inc2d": "Description 2",
          "inc3": "Feature 3", "inc3d": "Description 3",
          "inc4": "Feature 4", "inc4d": "Description 4",
          "quoteText": "A powerful quote about club culture",
          "quoteAttr": "Attribute to JJC Executive Board"
        }`,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
          temperature: 0.8,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              eventNameJp: { type: Type.STRING },
              heroTagline: { type: Type.STRING },
              expHeadline: { type: Type.STRING },
              expDesc: { type: Type.STRING },
              inc1: { type: Type.STRING },
              inc1d: { type: Type.STRING },
              inc2: { type: Type.STRING },
              inc2d: { type: Type.STRING },
              inc3: { type: Type.STRING },
              inc3d: { type: Type.STRING },
              inc4: { type: Type.STRING },
              inc4d: { type: Type.STRING },
              quoteText: { type: Type.STRING },
              quoteAttr: { type: Type.STRING }
            },
            required: ["eventNameJp", "heroTagline", "expHeadline", "expDesc", "inc1", "inc2", "inc3", "inc4", "quoteText"]
          }
        }
      });

      const rawJson = response.text || '{}';
      const result = JSON.parse(rawJson);
      
      setConfig(prev => ({ 
        ...prev, 
        eventNameJp: result.eventNameJp || prev.eventNameJp,
        heroTagline: result.heroTagline || prev.heroTagline,
        expHeadline: result.expHeadline || prev.expHeadline,
        expDesc: result.expDesc || prev.expDesc,
        inc1: result.inc1 || prev.inc1,
        inc1d: result.inc1d || prev.inc1d,
        inc2: result.inc2 || prev.inc2,
        inc2d: result.inc2d || prev.inc2d,
        inc3: result.inc3 || prev.inc3,
        inc3d: result.inc3d || prev.inc3d,
        inc4: result.inc4 || prev.inc4,
        inc4d: result.inc4d || prev.inc4d,
        quoteText: result.quoteText || prev.quoteText,
        quoteAttr: result.quoteAttr || prev.quoteAttr
      }));
      
      showToast("AI copy and Japanese name generated!");
    } catch (error) {
      console.error("AI Error:", error);
      showToast("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const exportHTMLFile = () => {
    const html = generateHTML(config);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.eventNameEn.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded index.html!');
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#111] overflow-hidden">
      {/* Top Bar (Mobile) */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-[#2a2a2a] shrink-0">
        <div className="flex items-center gap-2 text-[12px] font-bold">
          <div className="w-2 h-2 rounded-full bg-[#c23b22]" />
          JJC CONFIG
        </div>
        <button 
          onClick={exportHTMLFile}
          className="bg-[#c23b22] text-white px-3 py-1 rounded-md text-[11px] font-bold"
        >
          EXPORT
        </button>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[420px] bg-[#1a1a1a] border-r border-[#2a2a2a] overflow-y-auto custom-scrollbar flex flex-col shrink-0">
        <div className="hidden lg:flex items-center justify-between p-6 bg-[#1a1a1a] border-b border-[#2a2a2a] sticky top-0 z-20">
          <div className="flex items-center gap-3 text-[13px] font-bold tracking-tight">
            <div className="w-2 h-2 rounded-full bg-[#c23b22]" />
            JJC Event Config
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 rounded-md text-[11px] font-bold border border-[#2a2a2a] bg-[#222] hover:bg-[#333] transition-colors"
            >
              Reset
            </button>
            <button 
              onClick={exportHTMLFile}
              className="px-4 py-1.5 rounded-md text-[11px] font-bold bg-[#c23b22] hover:bg-[#d94a30] transition-colors"
            >
              Download
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Event Info */}
          <SidebarSection 
            title="1. Event Info" 
            id="sec-event" 
            isCollapsed={collapsedSections['sec-event']} 
            onToggle={toggleSection}
          >
            <Field label="Event Name (English)">
              <Input value={config.eventNameEn} onChange={e => updateConfig('eventNameEn', e.target.value)} />
            </Field>
            <Field label="Event Name (Japanese)">
              <Input value={config.eventNameJp} onChange={e => updateConfig('eventNameJp', e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date Display">
                <Input value={config.eventDate} onChange={e => updateConfig('eventDate', e.target.value)} />
              </Field>
              <Field label="Date (card)">
                <Input value={config.eventDateCard} onChange={e => updateConfig('eventDateCard', e.target.value)} />
              </Field>
            </div>
            <Field label="Time Range">
              <Input value={config.eventTime} onChange={e => updateConfig('eventTime', e.target.value)} />
            </Field>
            <Field label="Venue">
              <Input value={config.eventVenue} onChange={e => updateConfig('eventVenue', e.target.value)} />
            </Field>
            <Field label="Venue Note">
              <Input value={config.eventVenueNote} onChange={e => updateConfig('eventVenueNote', e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price ($)">
                <Input type="number" value={config.eventPrice} onChange={e => updateConfig('eventPrice', e.target.value)} />
              </Field>
              <Field label="Capacity">
                <Input value={config.eventCapacity} onChange={e => updateConfig('eventCapacity', e.target.value)} />
              </Field>
            </div>
            <Field label="CampusGroups RSVP URL">
              <Input value={config.eventURL} onChange={e => updateConfig('eventURL', e.target.value)} />
            </Field>
          </SidebarSection>

          {/* Turbo AI Copy Assistant */}
          <div className="mb-6 p-4 bg-[#222] border border-[#333] rounded-lg">
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-bold tracking-widest text-white uppercase">Turbo AI Assistant</h3>
                <span className="text-[9px] bg-[#c23b22] text-white px-1.5 py-0.5 rounded font-black tracking-tighter">ULTRA FAST</span>
             </div>
             <p className="text-[11px] text-[#888] mb-4 leading-relaxed">Generates professional copy and translates the event name to Japanese.</p>
             <button
              onClick={generateWithAI}
              disabled={isGenerating}
              className={`w-full py-2.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-2 transition-all shadow-xl ${
                isGenerating 
                  ? 'bg-[#333] text-[#555] cursor-not-allowed' 
                  : 'bg-white text-black hover:scale-[1.02] hover:bg-[#eee]'
              }`}
             >
               {isGenerating ? (
                 <>
                   <span className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                   {loadingMessages[genStep]}
                 </>
               ) : (
                 <>✨ Instant Generate</>
               )}
             </button>
          </div>

          {/* Copy */}
          <SidebarSection 
            title="2. Copy & Messaging" 
            id="sec-copy" 
            isCollapsed={collapsedSections['sec-copy']} 
            onToggle={toggleSection}
          >
            <Field label="Hero Tagline">
              <TextArea value={config.heroTagline} onChange={e => updateConfig('heroTagline', e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Transition (JP)">
                <Input value={config.transitionJp} onChange={e => updateConfig('transitionJp', e.target.value)} />
              </Field>
              <Field label="Transition (Sub)">
                <Input value={config.transitionSub} onChange={e => updateConfig('transitionSub', e.target.value)} />
              </Field>
            </div>
            <Field label="Experience Headline">
              <Input value={config.expHeadline} onChange={e => updateConfig('expHeadline', e.target.value)} />
            </Field>
            <Field label="Experience Description">
              <TextArea value={config.expDesc} onChange={e => updateConfig('expDesc', e.target.value)} />
            </Field>
            <Field label="Quote Text">
              <TextArea value={config.quoteText} onChange={e => updateConfig('quoteText', e.target.value)} />
            </Field>
            <Field label="Quote Attribution">
              <Input value={config.quoteAttr} onChange={e => updateConfig('quoteAttr', e.target.value)} />
            </Field>
          </SidebarSection>

          {/* What's Included */}
          <SidebarSection 
            title="3. What's Included" 
            id="sec-inc" 
            isCollapsed={collapsedSections['sec-inc']} 
            onToggle={toggleSection}
          >
            <div className="space-y-6">
              {(['1', '2', '3', '4']).map(num => (
                <div key={num} className="p-3 bg-[#111] border border-[#2a2a2a] rounded-md">
                   <div className="text-[9px] font-black text-[#c23b22] mb-2">INCLUSION 0{num}</div>
                   <Field label="Title">
                     <Input value={(config as any)[`inc${num}`]} onChange={e => updateConfig(`inc${num}` as any, e.target.value)} />
                   </Field>
                   <Field label="Description">
                     <Input value={(config as any)[`inc${num}d`]} onChange={e => updateConfig(`inc${num}d` as any, e.target.value)} />
                   </Field>
                </div>
              ))}
            </div>
          </SidebarSection>

          {/* Colors */}
          <SidebarSection 
            title="4. Branding & Colors" 
            id="sec-colors" 
            isCollapsed={collapsedSections['sec-colors']} 
            onToggle={toggleSection}
          >
            <div className="grid grid-cols-3 gap-2 mb-6">
              {Object.keys(presets).map(name => (
                <button
                  key={name}
                  onClick={() => applyPreset(name)}
                  className={`py-2 rounded-md text-[10px] font-bold border transition-all ${
                    config.accent === presets[name].accent ? 'border-[#c23b22] bg-[#c23b22]/10 text-[#c23b22]' : 'border-[#2a2a2a] bg-[#111] text-[#888] hover:text-[#ccc]'
                  }`}
                >
                  {name.toUpperCase()}
                </button>
              ))}
            </div>
            
            {(['accent', 'gold', 'paper', 'dark', 'ink'] as const).map(colorKey => (
              <div key={colorKey} className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-md border-2 border-[#2a2a2a] overflow-hidden shrink-0">
                  <input 
                    type="color" 
                    className="w-12 h-12 -m-2 cursor-pointer"
                    value={config[colorKey]}
                    onChange={e => updateConfig(colorKey, e.target.value)}
                  />
                </div>
                <div className="flex-1 text-[12px] text-[#888] capitalize">{colorKey}</div>
                <input 
                  type="text"
                  className="w-20 bg-[#111] border border-[#2a2a2a] rounded px-2 py-1 text-[10px] font-mono text-[#888] text-center uppercase"
                  value={config[colorKey]}
                  onChange={e => updateConfig(colorKey, e.target.value)}
                />
              </div>
            ))}
          </SidebarSection>

          {/* Sections Toggle */}
          <SidebarSection 
            title="5. Visibility & Flow" 
            id="sec-sections" 
            isCollapsed={collapsedSections['sec-sections']} 
            onToggle={toggleSection}
          >
            <Toggle label="Preloader Animation" active={config.showPreloader} onToggle={() => updateConfig('showPreloader', !config.showPreloader)} />
            <Toggle label="Transition (一期一会)" active={config.showTransition} onToggle={() => updateConfig('showTransition', !config.showTransition)} />
            <Toggle label="Experience Block" active={config.showExperience} onToggle={() => updateConfig('showExperience', !config.showExperience)} />
            <Toggle label="Inclusions List" active={config.showInclusions} onToggle={() => updateConfig('showInclusions', !config.showInclusions)} />
            <Toggle label="Quote / Interlude" active={config.showQuote} onToggle={() => updateConfig('showQuote', !config.showQuote)} />
            <Toggle label="Hero Background Kanji" active={config.showKanji} onToggle={() => updateConfig('showKanji', !config.showKanji)} />
          </SidebarSection>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 bg-[#0a0a0a] flex flex-col min-h-0">
        <div className="flex-1 p-4 lg:p-12 relative flex items-center justify-center overflow-hidden">
          <div 
            className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500 border border-[#2a2a2a]`}
            style={{ 
              width: device === 'mobile' ? '390px' : device === 'tablet' ? '768px' : '100%',
              height: '100%',
              maxWidth: '100%'
            }}
          >
            <iframe
              className="w-full h-full border-none"
              title="Page Preview"
              srcDoc={generateHTML(config)}
            />
          </div>
        </div>

        {/* Device Selection */}
        <div className="p-6 flex items-center justify-center gap-2 bg-[#1a1a1a] border-t border-[#2a2a2a]">
          {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map(d => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                device === d ? 'bg-[#222] text-[#fff]' : 'text-[#888] hover:text-[#ccc]'
              }`}
            >
              {d.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-24 right-8 bg-[#c23b22] text-white px-6 py-3 rounded-xl font-bold text-[13px] shadow-2xl animate-bounce-in z-[1000]">
          {toast}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        @keyframes bounceIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-in {
          animation: bounceIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
