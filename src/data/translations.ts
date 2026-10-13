export const translations = {
  en: {
    brand: {
      name: 'SAHAAYA AI',
      tagline: 'Every Problem. A Clearer Next Step.',
      subtitle: 'AI-Powered Civic Assistance Platform'
    },
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      newIssue: 'New Issue',
      myReports: 'My Reports',
      aiAssistant: 'AI Assistant',
      mapView: 'Map View',
      communityImpact: 'Community Impact',
      settings: 'Settings',
      learnMore: 'Learn More',
      reportProblem: 'Report a Problem',
      features: 'Features',
      howItWorks: 'How It Works',
      about: 'About',
      contact: 'Contact'
    },
    dashboard: {
      greeting: 'Good morning, Citizen',
      wardBadge: 'Ward 142 • Central Metro Zone',
      taglineCommunity: 'Empowering safer, cleaner neighborhoods through AI-driven public service collaboration.',
      heroTitle: 'Report Civic Issues in 60 Seconds',
      heroSubtitle: 'Capture road depressions, leaking mains, sanitation delays, or dark streets. Our AI formats official municipal grievances automatically.',
      reportNewIssue: 'Report a New Issue',
      viewFullMap: 'View Full Map',
      activeIssues: 'Active Issues',
      resolvedToday: 'Resolved This Week',
      avgResponse: 'Avg. Response Time',
      communityImpact: 'Community Fixes',
      recentReports: 'Recent Community Reports',
      viewAllReports: 'View All Reports',
      recentLocations: 'Incident Geospatial Radar',
      quickActions: 'Quick Actions',
      uploadEvidence: 'Upload Photo Evidence',
      trackReport: 'Track Existing Report',
      viewOnMap: 'Locate on Map',
      aiAssistantCardTitle: 'Live AI Civic Guide',
      aiAssistantCardDesc: 'Need help finding the right department or drafting an escalation?',
      askSahaaya: 'Consult AI Assistant',
      voiceAssistPrompt: 'Tap to speak or type in English / Tamil'
    },
    categories: {
      road_damage: {
        title: 'Road Damage',
        desc: 'Potholes, broken tar, asphalt craters, missing manhole covers',
        badge: 'High Safety Risk'
      },
      water_leakage: {
        title: 'Water Leakage',
        desc: 'Drinking water pipe bursts, open valves, potable water wastage',
        badge: 'Resource Waste'
      },
      sanitation: {
        title: 'Sanitation',
        desc: 'Overflowing public bins, uncleared dump yards, unhygienic spots',
        badge: 'Public Health'
      },
      streetlights: {
        title: 'Streetlights',
        desc: 'Non-functional lamps, flickering poles, dark corridors',
        badge: 'Night Hazard'
      },
      drainage: {
        title: 'Drainage',
        desc: 'Clogged storm drains, sewage overflows, stagnant monsoon gutters',
        badge: 'Inundation Risk'
      },
      other: {
        title: 'Other Civic Grievance',
        desc: 'Encroachments, fallen tree branches, damaged public signage',
        badge: 'General Civic'
      }
    },
    status: {
      submitted: 'Submitted',
      in_review: 'In Review',
      assigned: 'Assigned',
      in_progress: 'In Progress',
      resolved: 'Resolved'
    },
    urgency: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical'
    },
    wizard: {
      step1: '1. Category',
      step2: '2. Details',
      step3: '3. Location',
      step4: '4. Evidence',
      step5: '5. Review & AI Draft',
      selectCategory: 'Select the Issue Category',
      selectCategoryDesc: 'Choose the municipal domain that best matches your observation.',
      issueTitle: 'Issue Title / Summary',
      issueTitlePlaceholder: 'e.g., Deep pothole near Anna Nagar 2nd Avenue bus stop',
      description: 'Detailed Description',
      descriptionPlaceholder: 'Describe the problem clearly. Mention visible hazards, how long it has persisted, and affected commuters...',
      aiAutoDraftPrompt: 'Let AI draft and enhance your description',
      locationHeading: 'Incident Location & Ward Details',
      locationDesc: 'Pinpoint the location to help field crews navigate directly to the spot.',
      addressLabel: 'Street Address or Prominent Landmark',
      addressPlaceholder: 'e.g., Opposite Apollo Pharmacy, 4th Cross Road',
      wardLabel: 'Municipal Ward / Zone',
      detectLocation: 'Use My Current Location',
      locating: 'Acquiring GPS coordinates...',
      locationAcquired: 'Coordinates tagged successfully',
      evidenceHeading: 'Upload Photo or Video Evidence',
      evidenceDesc: 'Optional photographic evidence speeds up municipal inspection and priority assignment.',
      dragDropText: 'Drag & drop photo evidence, or click to browse',
      supportedFiles: 'Supported: JPG, PNG, WEBP (Max 10MB)',
      removeFile: 'Remove photo',
      reviewHeading: 'Review & AI-Powered Grievance Triage',
      reviewDesc: 'SAHAAYA AI validates your report, flags missing details, and prepares a formal complaint letter.',
      submitting: 'Saving Report & Generating Grievance...',
      submitReport: 'Submit Verified Grievance',
      saveDraft: 'Save Local Draft',
      next: 'Continue',
      back: 'Previous',
      confidence: 'AI Assessment Confidence',
      missingInfoNotice: 'Recommended Details to Add:',
      actionableSteps: 'Next Steps for Speedy Resolution:'
    },
    assistant: {
      title: 'SAHAAYA AI Civic Copilot',
      subtitle: 'Ask about ward authorities, emergency numbers, complaint drafting, or municipal escalations.',
      inputPlaceholder: 'Ask a question or describe a problem in your street...',
      send: 'Send',
      clearChat: 'Clear Session',
      convertToReport: 'Convert to Official Report',
      suggestedQuestions: 'Frequently Asked Civic Inquiries',
      demoNotice: 'Running on SAHAAYA Intelligent Engine. Responses are advisory and non-governmental.'
    },
    reports: {
      title: 'My Civic Grievance Reports',
      subtitle: 'Track status changes, assigned municipal officers, and repair updates in real-time.',
      searchPlaceholder: 'Search by ticket ID, street, or description...',
      allCategories: 'All Categories',
      allStatuses: 'All Statuses',
      filterCategory: 'Category',
      filterStatus: 'Status',
      noReportsFound: 'No reports matched your search criteria.',
      reportId: 'Ticket ID',
      issue: 'Issue Summary',
      location: 'Ward & Location',
      date: 'Submitted',
      statusCol: 'Status',
      actions: 'Actions',
      viewDetails: 'Inspect Details',
      copyDraft: 'Copy Letter Draft',
      updateStatus: 'Simulate Ward Progress',
      deleteReport: 'Delete'
    },
    map: {
      title: 'Citywide Incident Radar',
      subtitle: 'Explore active citizen reports, hotspot densities, and verified repair interventions.',
      allFilters: 'All Incident Types',
      locateMe: 'Center on My GPS',
      activeMarkers: 'Active Markers on Map',
      legend: 'Category Color Guide',
      clickToInspect: 'Click any marker to inspect incident details and complaint draft.'
    },
    settings: {
      title: 'Platform Preferences & Security',
      subtitle: 'Customize language, alerts, and examine privacy commitments.',
      languageHeading: 'Language Selection',
      languageDesc: 'Switch between English and தமிழ் across all views and AI workflows.',
      notificationsHeading: 'Notification Subscriptions',
      emailAlerts: 'Email updates when ward officers change ticket status',
      smsAlerts: 'SMS alerts when repair crew begins on-site work',
      privacyHeading: 'Responsible AI & Data Privacy',
      privacyNotice: 'SAHAAYA AI processes citizen inputs strictly to assist with drafting municipal grievances. We never sell citizen locations or photo evidence to third parties. Reports submitted for demonstration are kept in-memory.',
      clearData: 'Reset Local Storage Cache',
      clearSuccess: 'Local preferences cleared successfully.'
    }
  },
  ta: {
    brand: {
      name: 'சஹாயா AI',
      tagline: 'ஒவ்வொரு பிரச்சனைக்கும்... தெளிவான அடுத்த படி.',
      subtitle: 'செயற்கை நுண்ணறிவு அடிப்படையிலான பொதுமக்கள் சேவை தளம்'
    },
    nav: {
      home: 'முகப்பு',
      dashboard: 'டாஷ்போர்டு',
      newIssue: 'புதிய புகார்',
      myReports: 'என் புகார்கள்',
      aiAssistant: 'AI உதவியாளர்',
      mapView: 'வரைபடம்',
      communityImpact: 'சமூக தாக்கம்',
      settings: 'அமைப்புகள்',
      learnMore: 'மேலும் அறிய',
      reportProblem: 'புகார் அளிக்க',
      features: 'அம்சங்கள்',
      howItWorks: 'செயல்படும் விதம்',
      about: 'எங்களை பற்றி',
      contact: 'தொடர்புக்கு'
    },
    dashboard: {
      greeting: 'வணக்கம், குடிமக்களே',
      wardBadge: 'வார்டு 142 • மத்திய மண்டலம்',
      taglineCommunity: 'செயற்கை நுண்ணறிவு வழிகாட்டுதலுடன் தூய்மையான மற்றும் பாதுகாப்பான நகரத்தை உருவாக்குவோம்.',
      heroTitle: '60 வினாடிகளில் நகராட்சி புகார்களை பதிவு செய்யுங்கள்',
      heroSubtitle: 'சாலை பள்ளங்கள், குடிநீர் குழாய் உடைப்பு, குப்பை தேக்கம், எரியாத தெருவிளக்குகள் குறித்து புகார் அளியுங்கள். AI தானாக அதிகாரப்பூர்வ மனுவை தயார் செய்யும்.',
      reportNewIssue: 'புதிய புகார் பதிவு செய்',
      viewFullMap: 'முழு வரைபடத்தை பார்',
      activeIssues: 'நடப்பு புகார்கள்',
      resolvedToday: 'இவ்வாரம் தீர்க்கப்பட்டவை',
      avgResponse: 'சராசரி பதில் நேரம்',
      communityImpact: 'சமூக நன்மைகள்',
      recentReports: 'அண்மைய மக்கள் புகார்கள்',
      viewAllReports: 'அனைத்து புகார்களையும் பார்',
      recentLocations: 'நகர இடங்கள் ரேடார்',
      quickActions: 'விரைவு நடவடிக்கைகள்',
      uploadEvidence: 'புகைப்பட ஆதாரம் பதிவேற்று',
      trackReport: 'புகார் நிலையை அறி',
      viewOnMap: 'வரைபடத்தில் பார்க்க',
      aiAssistantCardTitle: 'நேரடி AI நகராட்சி வழிகாட்டி',
      aiAssistantCardDesc: 'சரியான துறை அல்லது புகார் மனு எழுத உதவி தேவையா?',
      askSahaaya: 'AI உதவியாளரிடம் கேள்',
      voiceAssistPrompt: 'தமிழில் அல்லது ஆங்கிலத்தில் கேட்கலாம்'
    },
    categories: {
      road_damage: {
        title: 'சாலை சேதம் & பள்ளம்',
        desc: 'ஆபத்தான சாலை பள்ளங்கள், தார் விரிசல், பாதாள சாக்கடை மூடி சேதம்',
        badge: 'அதிமுக்கிய பாதுகாப்பு'
      },
      water_leakage: {
        title: 'குடிநீர் கசிவு',
        desc: 'குடிநீர் குழாய் உடைப்பு, வீணாகும் குடிநீர், வால்வு பழுது',
        badge: 'வளப் பாதுகாப்பு'
      },
      sanitation: {
        title: 'திடக்கழிவு மேலாண்மை',
        desc: 'நிரம்பி வழியும் குப்பை தொட்டிகள், அகற்றப்படாத கழிவுகள், சுகாதார சீர்கேடு',
        badge: 'பொது சுகாதாரம்'
      },
      streetlights: {
        title: 'தெருவிளக்குகள்',
        desc: 'எரியாத தெரு விளக்குகள், மின்கம்ப பழுது, இருட்டான தெருக்கள்',
        badge: 'இரவு நேர பாதுகாப்பு'
      },
      drainage: {
        title: 'மழைநீர் வடிகால் & கழிவுநீர்',
        desc: 'அடைபட்ட மழைநீர் வடிகால்கள், நிரம்பி வழியும் சாக்கடை, நீர் தேக்கம்',
        badge: 'வெள்ள அபாயம்'
      },
      other: {
        title: 'பிற நகராட்சி புகார்கள்',
        desc: 'ஆக்கிரமிப்புகள், முறிந்த மரக்கிளைகள், பழுதான அறிவிப்பு பலகைகள்',
        badge: 'பொதுவானவை'
      }
    },
    status: {
      submitted: 'பதிவு செய்யப்பட்டது',
      in_review: 'ஆய்வில் உள்ளது',
      assigned: 'அதிகாரிக்கு ஒதுக்கப்பட்டது',
      in_progress: 'பணியில் உள்ளது',
      resolved: 'தீர்க்கப்பட்டது'
    },
    urgency: {
      low: 'குறைந்த அவசரம்',
      medium: 'நடுத்தர அவசரம்',
      high: 'அதிக அவசரம்',
      critical: 'அதிமுக்கியம்'
    },
    wizard: {
      step1: '1. பிரிவு',
      step2: '2. விவரம்',
      step3: '3. இடம்',
      step4: '4. ஆதாரம்',
      step5: '5. சரிபார்த்தல் & AI மனு',
      selectCategory: 'புகாரின் பிரிவை தேர்ந்தெடுக்கவும்',
      selectCategoryDesc: 'உங்கள் புகாருக்கு ஏற்ற சரியான நகராட்சி பிரிவை தேர்ந்தெடுக்கவும்.',
      issueTitle: 'புகார் தலைப்பு',
      issueTitlePlaceholder: 'எ.கா: அண்ணா நகர் 2வது அவென்யூ பேருந்து நிறுத்தம் அருகே ஆழமான குழி',
      description: 'முழு விவரம்',
      descriptionPlaceholder: 'பிரச்சனையை தெளிவாக விவரிக்கவும். எத்தனை நாட்களாக உள்ளது, ஏற்படும் ஆபத்துகள் என்ன...',
      aiAutoDraftPrompt: 'விவரங்களை AI மூலம் மெருகேற்றுக',
      locationHeading: 'இடம் மற்றும் வார்டு விவரங்கள்',
      locationDesc: 'பராமரிப்பு பணியாளர்கள் நேரடியாக சென்றடைய துல்லியமான இடத்தை குறிக்கவும்.',
      addressLabel: 'தெரு முகவரி அல்லது அடையாளக்குறி',
      addressPlaceholder: 'எ.கா: அப்பல்லோ மருந்தகம் எதிரில், 4வது குறுக்கு தெரு',
      wardLabel: 'நகராட்சி வார்டு / மண்டலம்',
      detectLocation: 'எனது இருப்பிடத்தை கண்டறி',
      locating: 'GPS இருப்பிடம் பெறப்படுகிறது...',
      locationAcquired: 'இருப்பிடம் வெற்றிகரமாக பெறப்பட்டது',
      evidenceHeading: 'புகைப்பட சான்றை பதிவேற்றவும்',
      evidenceDesc: 'புகைப்படம் இணைப்பது விரைவான ஆய்வு மற்றும் நடவடிக்கைக்கு உதவும்.',
      dragDropText: 'புகைப்படத்தை இங்கு இழுத்து போடவும், அல்லது கிளிக் செய்யவும்',
      supportedFiles: 'வடிவங்கள்: JPG, PNG, WEBP (அதிகபட்சம் 10MB)',
      removeFile: 'நீக்கு',
      reviewHeading: 'சரிபார்த்தல் மற்றும் AI புகார் மனு',
      reviewDesc: 'SAHAAYA AI உங்கள் புகாரை ஆய்வு செய்து, விடுபட்ட விவரங்களை சரிபார்த்து, அதிகாரப்பூர்வ கடிதத்தை உருவாக்குகிறது.',
      submitting: 'புகார் பதிவு செய்யப்படுகிறது...',
      submitReport: 'புகாரை அதிகாரப்பூர்வமாக பதிவு செய்',
      saveDraft: 'வரைவாக சேமி',
      next: 'அடுத்து',
      back: 'முந்தையது',
      confidence: 'AI நம்பகத்தன்மை மதிப்பீடு',
      missingInfoNotice: 'சேர்க்க பரிந்துரைக்கப்படும் விவரங்கள்:',
      actionableSteps: 'விரைவான தீர்வுக்கு அடுத்த கட்டங்கள்:'
    },
    assistant: {
      title: 'சஹாயா AI நகராட்சி ஆலோசகர்',
      subtitle: 'வார்டு அதிகாரிகள், அவசர எண்கள், புகார் கடிதம் வரைவு குறித்து கேளுங்கள்.',
      inputPlaceholder: 'உங்கள் தெருவில் உள்ள பிரச்சனையை பற்றி கேட்கவும்...',
      send: 'அனுப்பு',
      clearChat: 'புதிய உரையாடல்',
      convertToReport: 'புகாராக மாற்று',
      suggestedQuestions: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
      demoNotice: 'SAHAAYA AI நுண்ணறிவு அமைப்பில் இயங்குகிறது. பதில்கள் வழிகாட்டுதலுக்கு மட்டுமே.'
    },
    reports: {
      title: 'என் நகராட்சி புகார்கள்',
      subtitle: 'புகார் நிலை மாற்றங்கள், ஒதுக்கப்பட்ட அதிகாரிகள் மற்றும் பணி முன்னேற்றங்களை கண்காணிக்கவும்.',
      searchPlaceholder: 'புகார் எண், தெரு அல்லது விவரம் மூலம் தேடுங்கள்...',
      allCategories: 'அனைத்து பிரிவுகளும்',
      allStatuses: 'அனைத்து நிலைகளும்',
      filterCategory: 'பிரிவு',
      filterStatus: 'நிலை',
      noReportsFound: 'தேடலுக்குரிய புகார்கள் ஏதும் கிடைக்கவில்லை.',
      reportId: 'புகார் எண்',
      issue: 'புகார் விவரம்',
      location: 'இடம் & வார்டு',
      date: 'நாள்',
      statusCol: 'நிலை',
      actions: 'செயல்கள்',
      viewDetails: 'முழு விவரம்',
      copyDraft: 'கடிதத்தை நகலெடு',
      updateStatus: 'முன்னேற்றத்தை மாற்று',
      deleteReport: 'நீக்கு'
    },
    map: {
      title: 'நகர இடங்கள் நிகழ்வு ரேடார்',
      subtitle: 'நகரம் முழுவதும் உள்ள புகார்கள் மற்றும் தீர்க்கப்பட்ட இடங்களை ஊடாடும் வரைபடத்தில் காண்க.',
      allFilters: 'அனைத்து வகை புகார்கள்',
      locateMe: 'என் இருப்பிடம்',
      activeMarkers: 'வரைபடத்தில் உள்ள இடங்கள்',
      legend: 'வண்ணக் குறியீடுகள்',
      clickToInspect: 'விவரங்களை பார்க்க ஏதேனும் குறியீட்டை கிளிக் செய்யவும்.'
    },
    settings: {
      title: 'அமைப்புகள் மற்றும் பாதுகாப்பு',
      subtitle: 'மொழி, அறிவிப்புகள் மற்றும் தனிநபர் பாதுகாப்பு கொள்கைகளை நிர்வகிக்கவும்.',
      languageHeading: 'மொழி தேர்வு',
      languageDesc: 'ஆங்கிலம் மற்றும் தமிழ் மொழிகளுக்கு இடையே மாற்றவும்.',
      notificationsHeading: 'அறிவிப்பு அமைப்புகள்',
      emailAlerts: 'மின்னஞ்சல் மூலம் புகார் நிலை அறிவிப்புகள் பெறவும்',
      smsAlerts: 'பணியாளர்கள் வந்தடைந்ததும் SMS தகவல் பெறவும்',
      privacyHeading: 'பொறுப்பான AI மற்றும் தனியுரிமை',
      privacyNotice: 'சஹாயா AI மக்களின் தரவுகளை நகராட்சி மனுக்களை எளிதாக்க மட்டுமே பயன்படுத்துகிறது. விளம்பரதாரர்களுக்கு இடமோ படங்களோ பகிரப்படாது.',
      clearData: 'தற்காலிக சேமிப்பை அழி',
      clearSuccess: 'அமைப்புகள் வெற்றிகரமாக அழிக்கப்பட்டன.'
    }
  }
};
