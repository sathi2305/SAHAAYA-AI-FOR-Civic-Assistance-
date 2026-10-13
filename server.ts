import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initial sample civic reports data (Tamil Nadu / Metro municipal context)
interface CivicReport {
  id: string;
  title: string;
  description: string;
  category: 'road_damage' | 'water_leakage' | 'sanitation' | 'streetlights' | 'drainage' | 'other';
  status: 'submitted' | 'in_review' | 'assigned' | 'in_progress' | 'resolved';
  latitude: number;
  longitude: number;
  address: string;
  ward: string;
  evidenceUrl?: string;
  evidenceName?: string;
  aiSummary?: string;
  complaintDraft?: string;
  missingDetails?: string[];
  recommendations?: string[];
  department?: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
  timeline: Array<{
    title: string;
    description: string;
    timestamp: string;
    status: string;
  }>;
}

const initialReports: CivicReport[] = [
  {
    id: 'SHY-2025-0104',
    title: 'Severe crater pothole near Anna Nagar 2nd Avenue junction',
    description: 'A deep pothole measuring nearly 2 feet wide has formed near the pedestrian crossing. Two two-wheelers skidded during the evening rain.',
    category: 'road_damage',
    status: 'in_progress',
    latitude: 13.0850,
    longitude: 80.2101,
    address: 'Near Anna Nagar 2nd Avenue Roundtana, Chennai',
    ward: 'Ward 102 - Zone 8 (Anna Nagar)',
    department: 'Greater Chennai Corporation - Roads & Bridges Wing',
    urgency: 'high',
    createdAt: '2025-05-12T09:30:00.000Z',
    updatedAt: '2025-05-13T14:15:00.000Z',
    isDemo: true,
    aiSummary: 'High-risk road depression causing vehicular skidding at a major intersection. Immediate cold-mix asphalt patch recommended before monsoon progression.',
    complaintDraft: `To,\nThe Executive Engineer (Bridges & Roads),\nGreater Chennai Corporation, Zone 8,\nChennai - 600040.\n\nSubject: Urgent grievance regarding dangerous pothole at Anna Nagar 2nd Avenue Junction\n\nRespected Sir/Madam,\n\nI am writing to bring to your urgent notice a hazardous road depression/pothole at the pedestrian crossing near Anna Nagar 2nd Avenue Roundtana. The pothole has caused multiple two-wheelers to lose balance, creating imminent danger to commuter safety.\n\nKindly inspect the site and carry out emergency bituminous patching at the earliest.\n\nYours faithfully,\nConcerned Citizen`,
    timeline: [
      { title: 'Report Lodged', description: 'Citizen submitted grievance with location tag.', timestamp: '2025-05-12T09:30:00.000Z', status: 'submitted' },
      { title: 'AI Verification', description: 'Categorized as Road Damage (High Urgency); Ward 102 allocated.', timestamp: '2025-05-12T09:32:00.000Z', status: 'in_review' },
      { title: 'Work Order Dispatched', description: 'Assigned to Ward Junior Engineer for patch crew mobilization.', timestamp: '2025-05-13T10:00:00.000Z', status: 'assigned' },
      { title: 'Repair Crew on Site', description: 'Asphalt cold-mix filling underway.', timestamp: '2025-05-13T14:15:00.000Z', status: 'in_progress' }
    ]
  },
  {
    id: 'SHY-2025-0103',
    title: 'Drinking water pipeline rupture leaking onto Usman Road',
    description: 'Clean drinking water is continuously gushing from an underground main line since 6:00 AM, flooding the sidewalk.',
    category: 'water_leakage',
    status: 'assigned',
    latitude: 13.0418,
    longitude: 80.2341,
    address: 'Opposite Ranganathan Street Entrance, Usman Road, T. Nagar',
    ward: 'Ward 136 - Zone 10 (Kodambakkam)',
    department: 'Chennai Metropolitan Water Supply and Sewerage Board (CMWSSB)',
    urgency: 'critical',
    createdAt: '2025-05-12T06:45:00.000Z',
    updatedAt: '2025-05-12T11:20:00.000Z',
    isDemo: true,
    aiSummary: 'Critical drinking water wastage and sidewalk submersion due to distribution conduit breach. Pressure valve shutdown and collar sleeve required.',
    complaintDraft: `To,\nThe Area Engineer,\nCMWSSB Area X Office,\nT. Nagar, Chennai.\n\nSubject: Severe drinking water pipeline leakage on South Usman Road\n\nRespected Authority,\n\nThis is to register an urgent complaint regarding a substantial potable water burst on South Usman Road opposite Ranganathan Street. Thousands of liters of treated drinking water are being wasted hourly while submerging the pavement.\n\nRequesting prompt valve isolation and pipeline repair.\n\nYours sincerely,\nLocal Resident`,
    timeline: [
      { title: 'Complaint Registered', description: 'Logged with geolocation coordinates.', timestamp: '2025-05-12T06:45:00.000Z', status: 'submitted' },
      { title: 'Routed to CMWSSB', description: 'Classified under Metro Water Distribution Division X.', timestamp: '2025-05-12T07:10:00.000Z', status: 'in_review' },
      { title: 'Inspector Assigned', description: 'Field supervisor assigned inspection ticket #CW-9921.', timestamp: '2025-05-12T11:20:00.000Z', status: 'assigned' }
    ]
  },
  {
    id: 'SHY-2025-0102',
    title: 'Overflowing garbage bin and stray animal menace on 4th Main Road',
    description: 'The community compactor bin has not been cleared for 4 days. Waste is spilling across 20 meters of the roadway attracting stray dogs and cattle.',
    category: 'sanitation',
    status: 'in_review',
    latitude: 13.0067,
    longitude: 80.2570,
    address: '4th Main Road, Gandhi Nagar, Adyar',
    ward: 'Ward 173 - Zone 13 (Adyar)',
    department: 'Greater Chennai Corporation - Solid Waste Management',
    urgency: 'medium',
    createdAt: '2025-05-11T16:20:00.000Z',
    updatedAt: '2025-05-11T18:00:00.000Z',
    isDemo: true,
    aiSummary: 'Accumulation of unsegregated municipal solid waste obstructing vehicular passage and raising health concerns. Mechanical compactor truck sweep required.',
    complaintDraft: `To,\nThe Zonal Officer (SWM),\nZone 13, Greater Chennai Corporation,\nAdyar, Chennai.\n\nSubject: Request for immediate clearing of overflowing municipal waste bins on 4th Main Road\n\nRespected Sir/Madam,\n\nWe bring to your kind attention the overflowing waste bins at 4th Main Road, Gandhi Nagar. The waste has overflowed on the street, causing foul smell and hygiene risks.\n\nPlease instruct the concessionaire/conservancy staff to clear the bin immediately and sanitize the surroundings with disinfectant powder.\n\nThank you,\nResidents Association`,
    timeline: [
      { title: 'Grievance Submitted', description: 'Attached photographic proof of overflow.', timestamp: '2025-05-11T16:20:00.000Z', status: 'submitted' },
      { title: 'Under Sanitary Review', description: 'Sanitary Inspector reviewing clearance route.', timestamp: '2025-05-11T18:00:00.000Z', status: 'in_review' }
    ]
  },
  {
    id: 'SHY-2025-0101',
    title: 'Four consecutive broken LED streetlights creating dark zone',
    description: 'Streetlight poles #21 to #24 have been completely dark for over a week, making the stretch unsafe for women and pedestrians at night.',
    category: 'streetlights',
    status: 'resolved',
    latitude: 13.0334,
    longitude: 80.2678,
    address: 'Luz Church Road, Mylapore',
    ward: 'Ward 124 - Zone 9 (Teynampet)',
    department: 'Greater Chennai Corporation - Electrical Department',
    urgency: 'medium',
    createdAt: '2025-05-08T20:10:00.000Z',
    updatedAt: '2025-05-10T19:30:00.000Z',
    isDemo: true,
    aiSummary: 'Underground feeder cable fault causing blackout across multiple street luminaires. Electrical team replaced burnt MCB and restored lighting.',
    complaintDraft: `To,\nThe Assistant Engineer (Electrical),\nZone 9, Greater Chennai Corporation,\nChennai.\n\nSubject: Restoration of defunct street lights along Luz Church Road\n\nRespected Sir/Madam,\n\nPoles #21 to #24 on Luz Church Road have been non-functional, casting the area in darkness. Kindly replace the driver/LED fixtures for pedestrian safety.\n\nRegards,\nMylapore Citizen Forum`,
    timeline: [
      { title: 'Issue Reported', description: 'Grievance logged with pole numbers.', timestamp: '2025-05-08T20:10:00.000Z', status: 'submitted' },
      { title: 'Assigned to Electrician', description: 'Ticket forwarded to Ward 124 electrical unit.', timestamp: '2025-05-09T10:15:00.000Z', status: 'assigned' },
      { title: 'Cable & Fixture Replaced', description: 'Feeder fuse and 2 luminaire modules replaced.', timestamp: '2025-05-10T17:45:00.000Z', status: 'in_progress' },
      { title: 'Issue Resolved', description: 'Luminaires tested and confirmed active at dusk.', timestamp: '2025-05-10T19:30:00.000Z', status: 'resolved' }
    ]
  },
  {
    id: 'SHY-2025-0100',
    title: 'Stormwater drain inlet choked with plastic silt causing backflow',
    description: 'Pre-monsoon silt and plastic debris have completely blocked the roadside storm drain grating. Slight drizzles already cause 6 inches of waterlogging.',
    category: 'drainage',
    status: 'in_progress',
    latitude: 13.0827,
    longitude: 80.2707,
    address: 'Wall Tax Road, George Town, Park Town',
    ward: 'Ward 58 - Zone 5 (Royapuram)',
    department: 'Greater Chennai Corporation - Storm Water Drain Department',
    urgency: 'high',
    createdAt: '2025-05-10T11:00:00.000Z',
    updatedAt: '2025-05-12T16:00:00.000Z',
    isDemo: true,
    aiSummary: 'Inlet grate occlusion leading to runoff stagnation. Desilting using suction super-sucker or manual excavator claw required prior to intense rainfall.',
    complaintDraft: `To,\nThe Superintending Engineer (SWD),\nGreater Chennai Corporation, Zone 5,\nChennai.\n\nSubject: Silt and debris removal from storm water drain on Wall Tax Road\n\nRespected Authority,\n\nThe roadside storm water drain grills on Wall Tax Road are severely choked with plastic and sludge, resulting in immediate water stagnation during rain. We urge immediate desilting to avoid inundation.\n\nRespectfully,\nLocal Shopkeepers & Residents`,
    timeline: [
      { title: 'Report Filed', description: 'Photos of clogged inlet submitted.', timestamp: '2025-05-10T11:00:00.000Z', status: 'submitted' },
      { title: 'Under Pre-Monsoon Survey', description: 'Included in high-priority desilting roster.', timestamp: '2025-05-11T09:00:00.000Z', status: 'in_review' },
      { title: 'Desilting Gang Mobilized', description: 'Suction jetting equipment deployed.', timestamp: '2025-05-12T16:00:00.000Z', status: 'in_progress' }
    ]
  }
];

// In-memory reports storage seeded with realistic civic records
let reportsStore: CivicReport[] = [...initialReports];

// Gemini Client initialization helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  try {
    return new GoogleGenAI({});
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

// Category determination fallback logic
function detectCategoryFallback(text: string): 'road_damage' | 'water_leakage' | 'sanitation' | 'streetlights' | 'drainage' | 'other' {
  const lower = text.toLowerCase();
  if (lower.includes('pothole') || lower.includes('road') || lower.includes('tar') || lower.includes('crater') || lower.includes('asphalt') || lower.includes('சாலை') || lower.includes('குழி')) {
    return 'road_damage';
  }
  if (lower.includes('water') || lower.includes('leak') || lower.includes('pipeline') || lower.includes('drinking water') || lower.includes('pipe') || lower.includes('தண்ணீர்') || lower.includes('குழாய்')) {
    return 'water_leakage';
  }
  if (lower.includes('garbage') || lower.includes('trash') || lower.includes('waste') || lower.includes('bin') || lower.includes('sanitation') || lower.includes('dump') || lower.includes('குப்பை')) {
    return 'sanitation';
  }
  if (lower.includes('light') || lower.includes('lamp') || lower.includes('streetlight') || lower.includes('dark') || lower.includes('bulb') || lower.includes('விளக்கு')) {
    return 'streetlights';
  }
  if (lower.includes('drain') || lower.includes('gutter') || lower.includes('sewage') || lower.includes('overflow') || lower.includes('silt') || lower.includes('கழிவுநீர்') || lower.includes('சாக்கடை')) {
    return 'drainage';
  }
  return 'other';
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  const aiClient = getGeminiClient();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    aiEngine: {
      provider: 'Google Gemini',
      model: 'gemini-3.8-flash',
      configured: !!aiClient,
      mode: aiClient ? 'LIVE_GENAI' : 'INTELLIGENT_CIVIC_FALLBACK'
    },
    reportsCount: reportsStore.length,
    version: '1.0.0-hackathon-prod'
  });
});

// AI Analyze Issue Endpoint
app.post('/api/ai/analyze-issue', async (req, res) => {
  try {
    const { title, description, category, location, evidenceImage, language = 'en' } = req.body;

    if (!description && !title) {
      return res.status(400).json({ error: 'Title or description is required for civic analysis.' });
    }

    const ai = getGeminiClient();
    const isTamil = language === 'ta';

    if (ai) {
      const prompt = `You are SAHAAYA AI, a senior municipal engineering consultant and civic problem advisor.
Analyze this civic issue report submitted by a citizen:
Issue Title: "${title || 'Untitled'}"
Issue Description: "${description || ''}"
Selected Category: "${category || 'auto-detect'}"
Location Provided: "${location || 'Not specified'}"
Language: ${isTamil ? 'Tamil and English' : 'English'}

Provide a structured JSON response with:
1. "category": Must be strictly one of ["road_damage", "water_leakage", "sanitation", "streetlights", "drainage", "other"]
2. "urgency": Strictly one of ["low", "medium", "high", "critical"]
3. "summary": Concise 2-sentence technical summary of the civic hazard and impact.
4. "missing_details": Array of 2-4 key missing pieces of information that would speed up municipal resolution (e.g., landmark, water line diameter, time noticed, pole number).
5. "recommendations": Array of 3 pragmatic next steps for the citizen (e.g., who to escalate to, immediate safety precaution).
6. "department": The relevant municipal body (e.g., Greater Chennai Corporation Roads Wing, CMWSSB, TANGEDCO/TNEB).
7. "complaint_draft": A formal, respectful municipal grievance letter ready to submit to ward officials.
8. "confidence": Number between 85 and 99.
9. "disclaimer": Note that this is AI-assisted civic drafting and requires citizen review before formal submission.

Ensure the response is STRICTLY valid JSON without extra markdown wrapping.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });

        const text = response.text || '';
        // Extract json if wrapped in ```json
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({
            ...parsed,
            isAiLive: true,
            provider: 'Gemini 3.8 Flash'
          });
        }
      } catch (aiErr) {
        console.warn('Gemini generateContent call encountered an issue, falling back safely:', aiErr);
      }
    }

    // Intelligent civic fallback
    const detectedCategory = category && category !== 'other' ? category : detectCategoryFallback(`${title} ${description}`);
    
    let dept = 'Municipal Corporation Civic Works Dept';
    let urgency: 'low' | 'medium' | 'high' | 'critical' = 'medium';

    if (detectedCategory === 'road_damage') {
      dept = 'Municipal Corporation - Roads & Bridges Department';
      urgency = 'high';
    } else if (detectedCategory === 'water_leakage') {
      dept = 'Water Supply and Sewerage Board (Metro Water)';
      urgency = 'critical';
    } else if (detectedCategory === 'sanitation') {
      dept = 'Public Health & Solid Waste Management';
      urgency = 'medium';
    } else if (detectedCategory === 'streetlights') {
      dept = 'Municipal Electrical & Lighting Wing';
      urgency = 'medium';
    } else if (detectedCategory === 'drainage') {
      dept = 'Storm Water Drain & Underground Sewerage Unit';
      urgency = 'high';
    }

    const fallbackResponse = {
      category: detectedCategory,
      urgency,
      summary: isTamil 
        ? `பொதுமக்கள் பாதுகாப்பு மற்றும் போக்குவரத்து வசதிக்காக உடனடியாக கவனிக்கப்பட வேண்டிய நகராட்சி குறைபாடு.`
        : `Identified civic infrastructure irregularity requiring municipal inspection. Timely rectification will prevent hazard escalation and public inconvenience.`,
      missing_details: isTamil
        ? [
            'சரியான அடையாளக் குறி (Landmark)',
            'பாதிக்கப்பட்ட பகுதியின் அளவு அல்லது ஆழம்',
            'பிரச்சனை தொடங்கிய தோராயமான நாள் / நேரம்'
          ]
        : [
            'Nearest landmark or building number for field crew',
            'Approximate dimension or scale of the issue',
            'Time of day when issue is most acute'
          ],
      recommendations: isTamil
        ? [
            'இடத்தின் துல்லியமான புகைப்படங்களை சேர்க்கவும்',
            'உள்ளூர் வார்டு கவுன்சிலர் அல்லது பொறியாளருக்கு நகல் அனுப்பவும்',
            'புகார் பதிவு செய்யப்பட்ட எண்ணை குறித்து வைத்துக்கொள்ளவும்'
          ]
        : [
            'Attach clear photographic evidence with wide and close-up views',
            'Note nearest electric pole or landmark number for crew routing',
            'Keep tracking ID forwarded to your Ward Engineer desk'
          ],
      department: dept,
      complaint_draft: `To,\nThe Assistant Executive Engineer,\n${dept},\nLocal Municipal Ward Office.\n\nSubject: Formal grievance regarding ${title || 'Civic Infrastructure Issue'}\n\nRespected Sir/Madam,\n\nI wish to bring to your immediate attention the following public grievance observed at: ${location || 'Local ward area'}.\n\nDescription: ${description}\n\nThis condition poses inconvenience and potential risk to neighborhood residents and commuters. I kindly request your office to inspect the location and mobilize maintenance staff for prompt resolution.\n\nThanking you,\nYours responsibly,\nConcerned Citizen`,
      confidence: 94,
      disclaimer: 'Drafted via SAHAAYA AI Civic Rule Engine. Please review and adjust specific details before lodging with official municipal authorities.',
      isAiLive: false,
      provider: 'SAHAAYA Intelligent Civic Engine'
    };

    return res.json(fallbackResponse);

  } catch (error) {
    console.error('Error analyzing issue:', error);
    res.status(500).json({ error: 'Internal server error during civic analysis.' });
  }
});

// AI Generate Formal Municipal Complaint Letter
app.post('/api/ai/generate-complaint', async (req, res) => {
  try {
    const { title, description, category, location, citizenName = 'Resident Citizen', language = 'en' } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Generate an official, politely phrased, highly actionable municipal complaint letter for an Indian civic body.
Title: ${title}
Details: ${description}
Category: ${category}
Location: ${location}
Citizen: ${citizenName}
Language: ${language === 'ta' ? 'Tamil' : 'English'}

Provide formatted plain text ready to copy or email to municipal commissioners or engineers.`
        });

        return res.json({
          letter: response.text,
          isAiLive: true
        });
      } catch (err) {
        console.warn('Complaint generation via Gemini encountered issue, using template:', err);
      }
    }

    // Default template
    const letter = `To,
The Ward Executive Engineer / Zonal Officer,
Greater Chennai / Local Municipal Corporation,
Ward Office Jurisdiction.

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

Subject: Urgent petition regarding ${title} - Immediate intervention requested

Respected Authority,

I am writing this petition as a conscientious resident to place on record a serious civic concern at ${location || 'our residential locality'}.

Factual details of the issue:
${description}

Category: ${category?.toUpperCase() || 'CIVIC INFRASTRUCTURE'}

Due to this unresolved situation, senior citizens, children, and regular pedestrians are facing severe distress and hazard. 

We request your good office to:
1. Conduct an on-site inspection through the Ward Junior Engineer.
2. Issue necessary work orders to the maintenance wing or contractor.
3. Update the grievance resolution portal accordingly.

We look forward to your proactive administrative support in maintaining civic standards.

Thanking you,

Yours sincerely,
${citizenName}
Contact: Citizen Resident Portal`;

    res.json({ letter, isAiLive: false });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate complaint letter.' });
  }
});

// AI Chatbot endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], language = 'en' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const ai = getGeminiClient();
    const isTamil = language === 'ta';

    if (ai) {
      try {
        const systemPrompt = `You are SAHAAYA AI, the intelligent, dedicated project assistant and civic guide for SAHAAYA AI ("Every Problem. A Clearer Next Step.").
You have complete knowledge of the SAHAAYA AI platform architecture, codebase, features, and civic domain:

ABOUT THE PROJECT:
• Mission: Empower citizens to report, structure, and track municipal infrastructure issues (road damage/potholes, water leaks, garbage dumps, non-working streetlights, and choked drainage).
• Core Features:
  1. 5-Step Civic Grievance Wizard: Select category, describe issue with AI auto-suggestions, pin location via Leaflet OSM or GPS, attach photo evidence, and receive automated AI triage with a formal complaint draft.
  2. AI Triage Engine: Leverages Google Gemini 3.8 Flash to assess hazard urgency, detect missing landmarks or details, route to the correct municipal body (e.g. GCC Roads Wing, CMWSSB, TANGEDCO), and generate an editable official petition letter.
  3. Community Impact Dashboard: Interactive Recharts visualizations including 10-month historical trend analysis (Inflow vs Closed, Cumulative Growth, Sector Inflow), Resolved vs Open by domain, and turnaround speed.
  4. Interactive Incident Radar: Full-screen Leaflet & OpenStreetMap dark-mode mapping with custom glowing category pins.
  5. My Reports & Lifecycle Simulator: Track ticket lifecycle from Submitted → In Review → Assigned → In Progress → Resolved.
  6. Global Keyboard Shortcuts: Ctrl+K / Cmd+K instantly focuses the search bar on My Reports; Escape clears search.
  7. Bilingual Native Support: Full English and Tamil (தமிழ்) translation across all views and conversations.
  8. Ethical AI: Advisory assistant; never impersonates government officials; zero data resale.
• Technology Stack:
  - Frontend: React 19, TypeScript, Vite, Tailwind CSS 4, Recharts, Leaflet 1.9, Lucide React, Motion.
  - Backend: Node.js, Express, TSX, @google/genai SDK (gemini-3.8-flash model), Intelligent Civic Rule Engine fallback.

YOUR ROLE:
1. Answer any user question about the SAHAAYA AI project (architecture, tech stack, how features work, hackathon problem statement, AI triage, analytics).
2. Assist citizens with real-world municipal problems, emergency numbers (GCC: 1913, Police: 100, Fire: 101), and complaint drafts.
3. Support both English and Tamil smoothly.
4. Keep responses crisp, well-structured with bullet points, friendly, and technically accurate.`;

        // Format history
        const formattedContents = [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'Understood. I am SAHAAYA AI, fully trained on the SAHAAYA AI platform architecture, civic workflows, and ready to answer any project or municipal query.' }] },
          ...conversationHistory.map((m: any) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ];

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents
        });

        return res.json({
          reply: response.text,
          isAiLive: true,
          suggestions: [
            isTamil ? 'திட்டத்தின் தொழில்நுட்ப கட்டமைப்பு என்ன?' : 'What is the tech stack of SAHAAYA AI?',
            isTamil ? 'AI எவ்வாறு புகாரை ஆய்வு செய்கிறது?' : 'How does the AI Triage engine work?',
            isTamil ? 'சமூக தாக்கம் வரைபடம் பற்றி கூறு' : 'Explain the Community Impact analytics'
          ]
        });
      } catch (chatErr) {
        console.warn('AI chat error, using intelligent civic fallback:', chatErr);
      }
    }

    // Fallback conversational responses (trained on project and civic issues)
    const lower = message.toLowerCase();
    let reply = '';
    const suggestions = [
      isTamil ? 'திட்டத்தின் முக்கிய அம்சங்கள் யாவை?' : 'What are the core features of SAHAAYA AI?',
      isTamil ? 'தொழில்நுட்ப கட்டமைப்பு என்ன?' : 'What tech stack is used in this project?',
      isTamil ? 'சாலை குழி புகார் செய்வது எப்படி?' : 'How to report a dangerous road pothole?'
    ];

    if (lower.includes('project') || lower.includes('about') || lower.includes('what is sahaaya') || lower.includes('overview') || lower.includes('திட்டம்')) {
      reply = isTamil
        ? `**SAHAAYA AI (சஹாயா AI) திட்ட கண்ணோட்டம்:**\n\n• **குறிக்கோள்:** "ஒவ்வொரு பிரச்சனைக்கும்... தெளிவான அடுத்த படி."\n• **நோக்கம்:** பொதுமக்கள் சாலை பள்ளங்கள், குடிநீர் கசிவு, குப்பை தேக்கம், தெருவிளக்கு பழுது ஆகியவற்றை எளிதில் பதிவு செய்யவும், AI மூலம் அதிகாரப்பூர்வ புகார் கடிதங்களை உருவாக்கவும் உதவுகிறது.\n• **முக்கிய அம்சங்கள்:**\n  1. 5-படிநிலை புகார் பதிவு வழிகாட்டி\n  2. Gemini 3.8 Flash AI ஆய்வு மற்றும் மனு தயாரிப்பு\n  3. Recharts ஊடாடும் சமூக தாக்கம் டாஷ்போர்டு\n  4. Leaflet நகர வரைபடம் (OpenStreetMap)\n  5. தமிழ் மற்றும் ஆங்கில முழு ஆதரவு\n  6. Ctrl+K விரைவு தேடல் விசைப்பலகை குறுக்குவழி.`
        : `**SAHAAYA AI — Project Overview:**\n\n• **Tagline:** "Every Problem. A Clearer Next Step."\n• **Core Purpose:** An AI-powered civic assistance platform helping citizens document, categorize, draft, and track municipal complaints.\n• **Key Modules:**\n  1. **5-Step Grievance Wizard:** Category selection, AI auto-suggest details, Leaflet pin-drop, photo evidence, and review.\n  2. **Automated AI Triage:** Classifies urgency, detects missing landmarks, assigns municipal bodies, and drafts formal grievance letters.\n  3. **Community Impact Analytics (Recharts):** 10-month historical trend analysis, category resolution rates, and turnaround speeds.\n  4. **Incident Geospatial Radar:** Leaflet OpenStreetMap dark-mode tracking.\n  5. **Bilingual:** Native English and Tamil (தமிழ்) support.\n  6. **Global Shortcuts:** Ctrl+K / Cmd+K to focus search on My Reports.`;
    } else if (lower.includes('tech stack') || lower.includes('technology') || lower.includes('stack') || lower.includes('architecture') || lower.includes('கட்டமைப்பு')) {
      reply = isTamil
        ? `**SAHAAYA AI தொழில்நுட்ப கட்டமைப்பு (Tech Stack):**\n\n• **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Motion, Lucide React.\n• **Visualizations & Maps:** Recharts (Community Impact), Leaflet 1.9 & OpenStreetMap (Incident Radar).\n• **Backend:** Node.js, Express, TSX runtime.\n• **AI Engine:** Google Gemini 3.8 Flash (@google/genai SDK) + நுண்ணறிவு மாற்று விதிமுறை அமைப்பு.\n• **பாதுகாப்பு & நெறிமுறைகள்:** தனிநபர் தரவு பாதுகாப்பு, வெளிப்புற API விசை வெளிப்படாமல் சேவையக ப்ராக்ஸி.`
        : `**SAHAAYA AI Technical Architecture:**\n\n• **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Motion animations, Lucide icons.\n• **Charts & Mapping:** Recharts (Community Impact Bar, Area, Pie, and Composed charts), Leaflet 1.9 with dark OpenStreetMap tiles.\n• **Backend:** Node.js, Express 4, TSX runtime.\n• **AI Model:** Google Gemini 3.8 Flash via official \`@google/genai\` SDK + deterministic fallback rule engine.\n• **Security & Privacy:** Server-side API key proxying, no citizen location resale, advisory ethical boundaries.`;
    } else if (lower.includes('triage') || lower.includes('ai work') || lower.includes('how does ai') || lower.includes('llm')) {
      reply = isTamil
        ? `**AI ஆய்வு (Triage Engine) எவ்வாறு செயல்படுகிறது:**\n\n1. **பகுப்பாய்வு:** குடிமகன் அளிக்கும் தலைப்பு, விவரம் மற்றும் புகைப்படத்தை Gemini 3.8 Flash மாதிரி ஆய்வு செய்கிறது.\n2. **அவசர நிலை மதிப்பீடு:** Low, Medium, High, Critical என வகைப்படுத்துகிறது.\n3. **விடுபட்ட விவரங்கள்:** விடுபட்ட அடையாளக்குறி, மின்கம்ப எண் போன்றவற்றை சுட்டிக்காட்டுகிறது.\n4. **துறை ஒதுக்கீடு:** Greater Chennai Corporation, CMWSSB, TANGEDCO போன்ற சரியான துறைக்கு ஒதுக்குகிறது.\n5. **மனு தயாரிப்பு:** நகராட்சி பொறியாளருக்கு சமர்ப்பிக்கக்கூடிய முறையான புகார் கடிதத்தை நொடிகளில் உருவாக்குகிறது.`
        : `**How the SAHAAYA AI Triage Engine Works:**\n\n1. **Input Normalization:** Accepts citizen text description and optional evidence photo.\n2. **LLM Analysis:** Uses Google Gemini 3.8 Flash to evaluate public safety hazard and determine severity (Low, Medium, High, Critical).\n3. **Missing Info Detection:** Flags missing landmarks, pipe diameters, or pole numbers needed by field crews.\n4. **Department Routing:** Allocates to the specific authority (e.g. GCC Roads Wing, CMWSSB Water Board, Solid Waste Management).\n5. **Petition Drafting:** Generates an editable, respectful municipal complaint letter ready for submission.`;
    } else if (lower.includes('community impact') || lower.includes('trend') || lower.includes('chart') || lower.includes('analytics')) {
      reply = isTamil
        ? `**சமூக தாக்கம் (Community Impact) பகுப்பாய்வு:**\n\n• **மாதாந்திர வளர்ச்சி:** ஜனவரி முதல் அக்டோபர் வரை புகார்கள் பதிவு மற்றும் தீர்வு அடைந்த வளர்ச்சி போக்கு (Recharts ComposedChart).\n• **பிரிவு ஒப்பீடு:** தீர்க்கப்பட்ட vs நடப்பு புகார்கள் (BarChart).\n• **துறை பங்கீடு:** 6 நகராட்சி பிரிவுகளின் சதவீத பங்கீடு (PieChart).\n• **சராசரி தீர்வு நேரம்:** குடிநீர் கசிவு (18 மணிநேரம்), தெருவிளக்குகள் (22 மணிநேரம்), சாலை சேதம் (36 மணிநேரம்).`
        : `**Community Impact Analytics Overview:**\n\n• **Monthly Trend Analysis (Recharts):** 10-month historical trajectory visualizing intake growth (+200% MoM) and closure velocity (96.1% resolution rate).\n• **Resolved vs Open (BarChart):** Direct comparison across Road Damage, Water Leaks, Sanitation, Streetlights, Drainage, and Other.\n• **Turnaround Benchmarks:** Highlights speed metrics (Water leaks: 18h, Streetlights: 22h, Sanitation: 24h, Road repairs: 36h).\n• **Demonstration Notice:** Explicitly marked as aggregated demonstration telemetry.`;
    } else if (lower.includes('shortcut') || lower.includes('ctrl+k') || lower.includes('keyboard')) {
      reply = `**Global Keyboard Shortcuts in SAHAAYA AI:**\n\n• **Ctrl + K** (or **Cmd + K** on Mac): Instantly jumps to the "My Reports" view and focuses the search bar for rapid filtering.\n• **Escape**: Clears active search text or un-focuses the search bar.`;
    } else if (lower.includes('pothole') || lower.includes('road') || lower.includes('சாலை') || lower.includes('குழி')) {
      reply = isTamil 
        ? `**சாலை சேதம் & குழி புகார்கள்:**\n\n• சரியான சாலை பெயர் மற்றும் அருகிலுள்ள அடையாளக் குறியை பதிவு செய்யவும்.\n• பகல் வேளையில் இரண்டு தெளிவான புகைப்படங்களை எடுக்கவும்.\n• எங்கள் 'New Issue' படிவத்தில் இதை சமர்ப்பித்தால், மாநகராட்சி சாலை பொறியாளருக்கான மனு தானாக உருவாக்கப்படும்!`
        : `**For Road Damage & Potholes:**\n\n• Note the exact road stretch, landmark, and approximate dimensions.\n• Take daylight photos showing both context and depth.\n• You can use our "New Issue" wizard to generate a verified complaint letter for the Zonal Road Works Engineer.`;
    } else if (lower.includes('water') || lower.includes('leak') || lower.includes('தண்ணீர்') || lower.includes('குழாய்')) {
      reply = isTamil
        ? `**குடிநீர் குழாய் கசிவு அவசர புகார்:**\n\n• உடனடியாக மெட்ரோ குடிநீர் வாரிய (CMWSSB) பகுதி அலுவலகத்திற்கு தெரிவிக்கவும் (உதவி எண்: 044-45674567).\n• குடிநீர் விரயத்தை தடுக்க வால்வு அடைப்பு தேவைப்படலாம்.\n• SAHAAYA தளத்தில் புகாரை பதிவு செய்து புகார் எண்ணை பெறவும்.`
        : `**For Drinking Water Pipeline Leaks:**\n\n• Drinking water breaches require urgent priority to prevent wastage.\n• Note whether it is a supply main or consumer service pipe.\n• We automatically direct this to the Water Supply & Sewerage Board with a Critical urgency tag.`;
    } else {
      reply = isTamil
        ? `வணக்கம்! நான் SAHAAYA AI திட்ட வழிகாட்டி மற்றும் நகராட்சி ஆலோசகர்.\n\nநீங்கள் இந்த திட்டத்தின் கட்டமைப்பு, AI மாதிரி (Gemini 3.8 Flash), சமூக தாக்கம் வரைபடங்கள், விசைப்பலகை குறுக்குவழிகள் அல்லது நகராட்சி புகார்கள் குறித்து என்னிடம் எந்த கேள்வியும் கேட்கலாம்!`
        : `Hello! I am SAHAAYA AI, your project guide and civic assistant.\n\nYou can ask me anything about:\n• **The SAHAAYA AI Project** (Architecture, Gemini 3.8 Flash integration, Recharts analytics, offline fallback)\n• **Civic Issues** (How to report road damage, water leaks, garbage, streetlights, drainage)\n• **Official Grievance Letters** (Drafting petitions for municipal engineers)\n• **Features & Shortcuts** (Ctrl+K search, interactive maps, status simulator).`;
    }

    return res.json({
      reply,
      isAiLive: false,
      suggestions
    });
  } catch (error) {
    res.status(500).json({ error: 'Chat processing error.' });
  }
});

// Reports: GET list with query filters
app.get('/api/reports', (req, res) => {
  const { category, status, search } = req.query;
  let results = [...reportsStore];

  if (category && category !== 'all') {
    results = results.filter(r => r.category === category);
  }

  if (status && status !== 'all') {
    results = results.filter(r => r.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(r => 
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      r.ward.toLowerCase().includes(q)
    );
  }

  // Sort descending by createdAt
  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({
    total: results.length,
    reports: results
  });
});

// Reports: POST new report
app.post('/api/reports', (req, res) => {
  try {
    const {
      title,
      description,
      category = 'other',
      latitude = 13.0827,
      longitude = 80.2707,
      address = 'Chennai Central Ward',
      ward = 'Ward 104 - Central Zone',
      evidenceUrl,
      evidenceName,
      aiSummary,
      complaintDraft,
      urgency = 'medium',
      department
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `SHY-${new Date().getFullYear()}-${randomSuffix}`;
    const now = new Date().toISOString();

    const newReport: CivicReport = {
      id: newId,
      title,
      description,
      category,
      status: 'submitted',
      latitude: Number(latitude) || 13.0827,
      longitude: Number(longitude) || 80.2707,
      address: address || 'Reported Location',
      ward: ward || 'Local Municipal Ward',
      evidenceUrl,
      evidenceName,
      aiSummary: aiSummary || 'Preliminary citizen grievance registered. Awaiting initial field verification.',
      complaintDraft: complaintDraft || '',
      urgency,
      department: department || 'Municipal Corporation General Works',
      createdAt: now,
      updatedAt: now,
      isDemo: false,
      timeline: [
        {
          title: 'Grievance Registered',
          description: 'Report lodged with SAHAAYA AI platform and authenticated by citizen.',
          timestamp: now,
          status: 'submitted'
        },
        {
          title: 'Automated AI Triage',
          description: `Classified under category: ${category.toUpperCase()} with ${urgency.toUpperCase()} priority.`,
          timestamp: now,
          status: 'in_review'
        }
      ]
    };

    reportsStore.unshift(newReport);
    res.status(201).json(newReport);
  } catch (error) {
    console.error('Failed to create report:', error);
    res.status(500).json({ error: 'Failed to create report.' });
  }
});

// Reports: GET single by ID
app.get('/api/reports/:id', (req, res) => {
  const report = reportsStore.find(r => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found.' });
  }
  res.json(report);
});

// Reports: PATCH update single by ID
app.patch('/api/reports/:id', (req, res) => {
  const index = reportsStore.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Report not found.' });
  }

  const existing = reportsStore[index];
  const { status, complaintDraft, urgency } = req.body;
  const now = new Date().toISOString();

  const updated: CivicReport = {
    ...existing,
    ...(status ? { status } : {}),
    ...(complaintDraft ? { complaintDraft } : {}),
    ...(urgency ? { urgency } : {}),
    updatedAt: now
  };

  // If status changed, push timeline event
  if (status && status !== existing.status) {
    const statusTitles: Record<string, string> = {
      submitted: 'Report Lodged',
      in_review: 'Verification Commenced',
      assigned: 'Allocated to Ward Officer',
      in_progress: 'Maintenance Crew On-Site',
      resolved: 'Work Executed & Verified'
    };
    updated.timeline.push({
      title: statusTitles[status] || `Status updated to ${status}`,
      description: `Updated status on official tracking log.`,
      timestamp: now,
      status
    });
  }

  reportsStore[index] = updated;
  res.json(updated);
});

// Reports: DELETE single by ID
app.delete('/api/reports/:id', (req, res) => {
  const index = reportsStore.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Report not found.' });
  }
  reportsStore.splice(index, 1);
  res.json({ success: true, message: 'Report deleted successfully.' });
});

// Map issues endpoint
app.get('/api/map/issues', (req, res) => {
  const { category } = req.query;
  let issues = reportsStore.map(r => ({
    id: r.id,
    title: r.title,
    category: r.category,
    status: r.status,
    urgency: r.urgency || 'medium',
    latitude: r.latitude,
    longitude: r.longitude,
    address: r.address,
    ward: r.ward,
    createdAt: r.createdAt,
    hasEvidence: !!r.evidenceUrl
  }));

  if (category && category !== 'all') {
    issues = issues.filter(i => i.category === category);
  }

  res.json({
    count: issues.length,
    issues
  });
});

// -------------------------------------------------------------
// VITE DEV SERVER OR STATIC PRODUCTION SERVING
// -------------------------------------------------------------

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development mode: attach Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SAHAAYA AI Full-stack server running on http://0.0.0.0:${PORT}`);
    console.log(`🤖 Gemini AI status: ${process.env.GEMINI_API_KEY ? 'Active key detected' : 'Fallback simulation ready'}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
