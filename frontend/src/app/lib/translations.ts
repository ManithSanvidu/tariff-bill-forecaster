export type Language = "en" | "si" | "ta";

export interface Translations {
  appName: string;
  appSubtitle: string;
  utilityArbitrage: string;
  electricity: string;
  water: string;
  addReading: string;
  household: string;
  refresh: string;
  limitationNotice: string;
  pucslSchedule: string;
  tabForecaster: string;
  tabTrends: string;
  tabPreferences: string;
  antiSlabAlertTitle: string;
  potentialSaving: string;
  remainingDays: string;
  dailyCutNeeded: string;
  crossingConfidence: string;
  projectedMonthEndUnits: string;
  unitsKwh: string;
  interval80: string;
  projectedBill: string;
  expectedRange: string;
  cycleElapsed: string;
  days: string;
  daysLeft: string;
  recordedToDate: string;
  tariffSlabLevel: string;
  approachingThreshold: string;
  ofCurrentBlockConsumed: string;
  consumptionDisaggregation: string;
  baselineHouseholdLoad: string;
  baselineDescription: string;
  weatherDrivenLoad: string;
  weatherDescription: string;
  historicalTrends: string;
  historicalSubtitle: string;
  tempLabel: string;
  unitsLabel: string;
  appPreferences: string;
  weeklyReminderTitle: string;
  weeklyReminderDesc: string;
  weeklyReminderStatusOn: string;
  weeklyReminderStatusOff: string;
  testNotificationBtn: string;
  notificationPermissionRequested: string;
  languageTitle: string;
  languageDesc: string;
  settingsSavedNotice: string;
  recordMeterReading: string;
  inputMethod: string;
  scanMeterOcr: string;
  readingSavedSuccess: string;
  ocrCandidateExtracted: string;
  ocrDialInspectPrompt: string;
  ocrConfirmCheckbox: string;
  cumulativeDialReading: string;
  readingDateLabel: string;
  cancelBtn: string;
  confirmSaveBtn: string;
  backToHome: string;
  reminderNoticeActive: string;
  reminderPromptWeekend: string;
  dismissNotice: string;
  logoutBtn: string;
  switchAccount: string;
  logoutConfirm: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "TariffArbitrage.lk",
    appSubtitle: "Utility Tariff Arbitrage & Disaggregation",
    utilityArbitrage: "Utility Tariff Arbitrage & Disaggregation",
    electricity: "Electricity",
    water: "Water",
    addReading: "Add Reading",
    household: "Household",
    refresh: "Refresh",
    limitationNotice: "Limitation Notice: Tariff rates are unverified placeholders. Actual bill may vary.",
    pucslSchedule: "PUCSL Schedule",
    tabForecaster: "Month-End Forecaster",
    tabTrends: "Historical Trends & Weather",
    tabPreferences: "Preferences & i18n",
    antiSlabAlertTitle: "Anti-Slab Alert",
    potentialSaving: "Potential Saving",
    remainingDays: "Remaining Days",
    dailyCutNeeded: "Daily Cut Needed",
    crossingConfidence: "Crossing Confidence",
    projectedMonthEndUnits: "Projected Month-End Units",
    unitsKwh: "kWh units",
    interval80: "80% Interval",
    projectedBill: "Projected Bill (Config Engine)",
    expectedRange: "Expected Range",
    cycleElapsed: "Cycle Elapsed",
    days: "days",
    daysLeft: "left",
    recordedToDate: "Recorded",
    tariffSlabLevel: "Tariff Slab Level",
    approachingThreshold: "Approaching Next Threshold",
    ofCurrentBlockConsumed: "of current block consumed",
    consumptionDisaggregation: "Consumption Disaggregation",
    baselineHouseholdLoad: "Baseline Household Load",
    baselineDescription: "Routine lighting, refrigeration, appliances.",
    weatherDrivenLoad: "Weather-Driven Load",
    weatherDescription: "Weather forecast cooling load (+CDD) impact.",
    historicalTrends: "Historical Consumption vs Weather Overlay",
    historicalSubtitle: "Monthly billed units correlated with Open-Meteo temperature and rainfall",
    tempLabel: "Temp (°C)",
    unitsLabel: "Units",
    appPreferences: "Application Preferences",
    weeklyReminderTitle: "Weekly Reminder Notifications",
    weeklyReminderDesc: "Prompt for sparse manual meter reading on weekends",
    weeklyReminderStatusOn: "Weekly reminder is active (scheduled every Saturday morning).",
    weeklyReminderStatusOff: "Weekly reminder is paused.",
    testNotificationBtn: "Send Test Browser Notification",
    notificationPermissionRequested: "Browser notifications enabled! You will be reminded on weekends.",
    languageTitle: "Language / භාෂාව / மொழி",
    languageDesc: "Select interface localization",
    settingsSavedNotice: "Preferences updated and saved to your device.",
    recordMeterReading: "Record Meter Reading",
    inputMethod: "Input Method",
    scanMeterOcr: "Scan Meter (OCR Assist)",
    readingSavedSuccess: "Reading saved and confirmed successfully!",
    ocrCandidateExtracted: "OCR candidate value extracted",
    ocrDialInspectPrompt: "Please inspect the dial and confirm or correct the number below before saving.",
    ocrConfirmCheckbox: "I confirm this reading matches my physical meter",
    cumulativeDialReading: "Cumulative Dial Reading",
    readingDateLabel: "Reading Date",
    cancelBtn: "Cancel",
    confirmSaveBtn: "Confirm & Save Reading",
    backToHome: "Back to Home",
    reminderNoticeActive: "Weekend Reading Reminder",
    reminderPromptWeekend: "It's time for your weekly sparse meter check! Record today's reading to keep your Anti-Slab forecast razor sharp.",
    dismissNotice: "Dismiss",
    logoutBtn: "Log Out",
    switchAccount: "Switch / Register Another Household",
    logoutConfirm: "Are you sure you want to log out of this account?"
  },
  si: {
    appName: "TariffArbitrage.lk",
    appSubtitle: "විදුලි හා ජල ගාස්තු පුරෝකථන පද්ධතිය",
    utilityArbitrage: "ගාස්තු කළමනාකරණය සහ උපයෝගිතා විශ්ලේෂණය",
    electricity: "විදුලිය",
    water: "ජලය",
    addReading: "මීටර් අගය ඇතුළත් කරන්න",
    household: "නිවස",
    refresh: "යාවත්කාලීන කරන්න",
    limitationNotice: "සීමා නිවේදනය: ගාස්තු අනුපාත ආසන්න ඇස්තමේන්තු වේ. සැබෑ බිල්පත වෙනස් විය හැක.",
    pucslSchedule: "PUCSL ගාස්තු ලේඛනය",
    tabForecaster: "මාසාන්ත බිල්පත් පුරෝකථනය",
    tabTrends: "පසුගිය භාවිතය සහ කාලගුණ දත්ත",
    tabPreferences: "මනාප සහ භාෂාව (Settings)",
    antiSlabAlertTitle: "Anti-Slab අනතුරු ඇඟවීම",
    potentialSaving: "ඉතිරි කරගත හැකි මුදල",
    remainingDays: "ඉතිරි දින ගණන",
    dailyCutNeeded: "දෛනිකව අඩු කළ යුතු ප්‍රමාණය",
    crossingConfidence: "සීමාව ඉක්මවීමේ සම්භාවිතාව",
    projectedMonthEndUnits: "මාසාන්තයේ අපේක්ෂිත ඒකක",
    unitsKwh: "kWh ඒකක",
    interval80: "80% සම්භාවිතා පරාසය",
    projectedBill: "ඇස්තමේන්තුගත බිල (LKR)",
    expectedRange: "අපේක්ෂිත බිල්පත් පරාසය",
    cycleElapsed: "ගතවූ දින ගණන",
    days: "දින",
    daysLeft: "ඉතිරිව ඇත",
    recordedToDate: "දැනට වාර්තාගත අගය",
    tariffSlabLevel: "වත්මන් ගාස්තු කාණ්ඩය",
    approachingThreshold: "ඊළඟ කාණ්ඩ සීමාව",
    ofCurrentBlockConsumed: "වත්මන් කාණ්ඩයෙන් භාවිත කළ ප්‍රතිශතය",
    consumptionDisaggregation: "භාවිතය වෙන්කර හඳුනාගැනීම",
    baselineHouseholdLoad: "මූලික ගෘහස්ථ භාවිතය",
    baselineDescription: "සාමාන්‍ය ආලෝකකරණය, ශීතකරණ සහ උපකරණ භාවිතය.",
    weatherDrivenLoad: "කාලගුණය නිසා සිදුවූ අමතර භාවිතය",
    weatherDescription: "ඉදිරි උණුසුම් කාලගුණ තත්ත්වය (+CDD) නිසා එක්වන අමතර ඒකක.",
    historicalTrends: "පසුගිය භාවිතය සහ කාලගුණ සටහන",
    historicalSubtitle: "Open-Meteo උෂ්ණත්වය හා වර්ෂාපතනය සමග බිල්පත් ඒකක සැසඳීම",
    tempLabel: "උෂ්ණත්වය (°C)",
    unitsLabel: "ඒකක (kWh)",
    appPreferences: "යෙදුම් මනාප (Preferences)",
    weeklyReminderTitle: "සතිපතා මතක් කිරීම් (Weekly Reminders)",
    weeklyReminderDesc: "සති අන්තයේ මීටර් අගය සටහන් කරගැනීමට මතක් කරන්න",
    weeklyReminderStatusOn: "සතිපතා සිහිකැඳවීම සක්‍රීයයි (සෑම සෙනසුරාදා දිනකම).",
    weeklyReminderStatusOff: "සතිපතා සිහිකැඳවීම අක්‍රීය කර ඇත.",
    testNotificationBtn: "පරීක්ෂණ දැනුම්දීමක් එවන්න",
    notificationPermissionRequested: "බ්‍රවුසර දැනුම්දීම් සක්‍රීය කරන ලදී! සති අන්තයේදී මතක් කරනු ලැබේ.",
    languageTitle: "භාෂාව / Language / மொழி",
    languageDesc: "අතුරුමුහුණතේ භාෂාව තෝරන්න",
    settingsSavedNotice: "ඔබගේ මනාප සාර්ථකව සුරැකිණි.",
    recordMeterReading: "මීටර් කියවීම ඇතුළත් කිරීම",
    inputMethod: "ආදාන ක්‍රමය",
    scanMeterOcr: "කැමරාවෙන් ස්කෑන් කරන්න (OCR)",
    readingSavedSuccess: "මීටර් අගය සාර්ථකව තහවුරු කර සුරැකිණි!",
    ocrCandidateExtracted: "OCR මගින් හඳුනාගත් අගය",
    ocrDialInspectPrompt: "කරුණාකර මීටරය පරීක්ෂා කර අගය නිවැරදි දැයි තහවුරු කරන්න.",
    ocrConfirmCheckbox: "මෙම අගය මගේ සැබෑ මීටරයට ගැළපෙන බව තහවුරු කරමි",
    cumulativeDialReading: "මීටරයේ සම්පූර්ණ කියවීම",
    readingDateLabel: "දිනය",
    cancelBtn: "අවලංගු කරන්න",
    confirmSaveBtn: "තහවුරු කර සුරකින්න",
    backToHome: "මුල් පිටුවට",
    reminderNoticeActive: "සති අන්ත මීටර් මතක් කිරීම",
    reminderPromptWeekend: "අද ඔබගේ සතිපතා මීටර් කියවීම සටහන් කරගන්නා දිනයයි! නිවැරදි Anti-Slab අනතුරු ඇඟවීම් ලබාගැනීමට අදම අගය ඇතුළත් කරන්න.",
    dismissNotice: "වසන්න",
    logoutBtn: "ඉවත් වන්න (Log Out)",
    switchAccount: "වෙනත් ගිණුමකට මාරු වන්න / ලියාපදිංචි වන්න",
    logoutConfirm: "ඔබට මෙම ගිණුමෙන් ඉවත් වීමට අවශ්‍ය බව සහතිකද?"
  },
  ta: {
    appName: "TariffArbitrage.lk",
    appSubtitle: "மின் மற்றும் நீர் கட்டண முன்னறிவிப்பு முறைமை",
    utilityArbitrage: "கட்டண நடுவர் மற்றும் பயன்பாட்டு பகுப்பாய்வு",
    electricity: "மின்சாரம்",
    water: "நீர்",
    addReading: "மீட்டர் அளவீட்டைச் சேர்க்க",
    household: "குடும்பம்",
    refresh: "புதுப்பிக்கவும்",
    limitationNotice: "வரம்பு அறிவிப்பு: கட்டண விகிதங்கள் மதிப்பிடப்பட்டவை. உண்மையான கட்டணம் மாறுபடலாம்.",
    pucslSchedule: "PUCSL கட்டண அட்டவணை",
    tabForecaster: "மாத இறுதி முன்னறிவிப்பாளர்",
    tabTrends: "வரலாற்றுப் போக்குகள் & வானிலை",
    tabPreferences: "விருப்பத்தேர்வுகள் & மொழி (Settings)",
    antiSlabAlertTitle: "Anti-Slab எச்சரிக்கை",
    potentialSaving: "சேமிக்கக்கூடிய தொகை",
    remainingDays: "மீதமுள்ள நாட்கள்",
    dailyCutNeeded: "தேவையான தினசரி குறைப்பு",
    crossingConfidence: "வரம்பை மீறும் நிகழ்தகவு",
    projectedMonthEndUnits: "எதிர்பார்க்கப்படும் மாத இறுதி அலகுகள்",
    unitsKwh: "kWh அலகுகள்",
    interval80: "80% இடைவெளி",
    projectedBill: "மதிப்பிடப்பட்ட கட்டணம் (LKR)",
    expectedRange: "எதிர்பார்க்கப்படும் கட்டண வரம்பு",
    cycleElapsed: "கடந்த நாட்கள்",
    days: "நாட்கள்",
    daysLeft: "மீதம்",
    recordedToDate: "பதிவுசெய்யப்பட்டது",
    tariffSlabLevel: "கட்டண அடுக்கு நிலை",
    approachingThreshold: "அடுத்த வரம்பை நெருங்குகிறது",
    ofCurrentBlockConsumed: "தற்போதைய அடுக்கில் பயன்படுத்தப்பட்ட சதவீதம்",
    consumptionDisaggregation: "பயன்பாட்டு பிரித்தெடுத்தல்",
    baselineHouseholdLoad: "அடிப்படை வீட்டு பயன்பாடு",
    baselineDescription: "வழக்கமான விளக்குகள், குளிர்சாதன பெட்டி மற்றும் உபகரணங்கள்.",
    weatherDrivenLoad: "வானிலை சார்ந்த பயன்பாடு",
    weatherDescription: "வெப்பமான வானிலை காரணமாக (+CDD) ஏற்படும் கூடுதல் குளிர்ச்சி சுமை.",
    historicalTrends: "வரலாற்று பயன்பாடு மற்றும் வானிலை தரவு",
    historicalSubtitle: "Open-Meteo வெப்பநிலை மற்றும் மழையுடன் ஒப்பிடப்பட்ட கட்டண அலகுகள்",
    tempLabel: "வெப்பநிலை (°C)",
    unitsLabel: "அலகுகள் (kWh)",
    appPreferences: "பயன்பாட்டு விருப்பத்தேர்வுகள்",
    weeklyReminderTitle: "வாராந்திர நினைவூட்டல் அறிவிப்புகள்",
    weeklyReminderDesc: "வார இறுதி நாட்களில் மீட்டர் அளவீட்டைப் பதிவுசெய்ய நினைவூட்டு",
    weeklyReminderStatusOn: "வாராந்திர நினைவூட்டல் செயலில் உள்ளது (ஒவ்வொரு சனிக்கிழமையும்).",
    weeklyReminderStatusOff: "வாராந்திர நினைவூட்டல் இடைநிறுத்தப்பட்டுள்ளது.",
    testNotificationBtn: "சோதனை அறிவிப்பை அனுப்பவும்",
    notificationPermissionRequested: "உலாவி அறிவிப்புகள் இயக்கப்பட்டன! வார இறுதியில் உங்களுக்கு நினைவூட்டப்படும்.",
    languageTitle: "மொழி / Language / භාෂාව",
    languageDesc: "இடைமுக மொழியைத் தேர்ந்தெடுக்கவும்",
    settingsSavedNotice: "விருப்பத்தேர்வுகள் சாதனத்தில் சேமிக்கப்பட்டன.",
    recordMeterReading: "மீட்டர் அளவீட்டைப் பதிவுசெய்க",
    inputMethod: "உள்ளீட்டு முறை",
    scanMeterOcr: "கேமரா மூலம் ஸ்கேன் செய் (OCR)",
    readingSavedSuccess: "அளவீடு வெற்றிகரமாக சேமிக்கப்பட்டது!",
    ocrCandidateExtracted: "OCR மூலம் கண்டறியப்பட்ட மதிப்பு",
    ocrDialInspectPrompt: "சேமிப்பதற்கு முன் அளவீட்டைச் சரிபார்த்து உறுதிப்படுத்தவும்.",
    ocrConfirmCheckbox: "இந்த வாசிப்பு எனது மீட்டருடன் பொருந்துகிறது என்பதை உறுதிப்படுத்துகிறேன்",
    cumulativeDialReading: "மீட்டரின் மொத்த அளவீடு",
    readingDateLabel: "அளவீட்டு தேதி",
    cancelBtn: "ரத்து செய்",
    confirmSaveBtn: "உறுதிசெய்து சேமிக்கவும்",
    backToHome: "முகப்புக்கு",
    reminderNoticeActive: "வார இறுதி மீட்டர் நினைவூட்டல்",
    reminderPromptWeekend: "உங்கள் வாராந்திர மீட்டர் அளவீட்டைப் பதிவுசெய்ய வேண்டிய நேரம் இது! துல்லியமான எச்சரிக்கைகளைப் பெற இன்றே அளவீட்டை உள்ளிடவும்.",
    dismissNotice: "நிராகரி",
    logoutBtn: "வெளியேறு (Log Out)",
    switchAccount: "வேறு கணக்குக்கு மாற / பதிவு செய்ய",
    logoutConfirm: "இந்தக் கணக்கிலிருந்து வெளியேற விரும்புகிறீர்களா?"
  }
};
