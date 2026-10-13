/**
 * Verification test suite for SAHAAYA AI Platform
 */
import assert from 'assert';
import { translations } from '../src/data/translations';

async function runTests() {
  console.log('🧪 Starting SAHAAYA AI verification tests...');

  // 1. Translations validation
  console.log('1. Testing bilingual translation dictionary completeness...');
  assert(translations.en.brand.name === 'SAHAAYA AI', 'Brand name must exist in English');
  assert(translations.ta.brand.name === 'சஹாயா AI', 'Brand name must exist in Tamil');
  assert(translations.en.categories.road_damage.title === 'Road Damage', 'Road damage category in EN');
  assert(translations.ta.categories.road_damage.title === 'சாலை சேதம் & பள்ளம்', 'Road damage category in TA');
  assert(translations.en.status.resolved === 'Resolved', 'Resolved status in EN');
  assert(translations.ta.status.resolved === 'தீர்க்கப்பட்டது', 'Resolved status in TA');
  console.log('✅ Translation dictionary verified.');

  // 2. Health check endpoint test
  console.log('2. Testing /api/health endpoint...');
  const healthRes = await fetch('http://localhost:3000/api/health');
  assert(healthRes.status === 200, 'Health endpoint should return 200');
  const healthData = await healthRes.json();
  assert(healthData.status === 'healthy', 'Status should be healthy');
  assert(healthData.reportsCount >= 5, 'Reports count should have seeded data');
  console.log('✅ Health check passed:', healthData.aiEngine);

  // 3. Reports retrieval & filtering test
  console.log('3. Testing /api/reports listing...');
  const reportsRes = await fetch('http://localhost:3000/api/reports');
  assert(reportsRes.status === 200, 'Reports listing should return 200');
  const reportsData = await reportsRes.json();
  assert(Array.isArray(reportsData.reports), 'Reports should be an array');
  assert(reportsData.reports.length >= 5, 'Seeded reports count should be >= 5');
  console.log(`✅ Reports list verified with ${reportsData.reports.length} records.`);

  // 4. Report creation test
  console.log('4. Testing /api/reports creation...');
  const newReportPayload = {
    title: 'Automated Test: Broken Manhole Cover',
    description: 'Manhole cover displaced on Velachery Main Road causing hazard for two-wheelers',
    category: 'drainage',
    latitude: 12.9815,
    longitude: 80.2180,
    address: 'Near Phoenix MarketCity, Velachery',
    ward: 'Ward 178 - Zone 13',
    urgency: 'high'
  };

  const createRes = await fetch('http://localhost:3000/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newReportPayload)
  });
  assert(createRes.status === 201, 'Create report should return 201');
  const createdReport = await createRes.json();
  assert(createdReport.id.startsWith('SHY-'), 'ID should start with SHY-');
  assert(createdReport.status === 'submitted', 'Initial status must be submitted');
  console.log(`✅ Created report with ID ${createdReport.id}`);

  // 5. Report status update test
  console.log('5. Testing /api/reports/:id status update...');
  const patchRes = await fetch(`http://localhost:3000/api/reports/${createdReport.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'in_progress' })
  });
  assert(patchRes.status === 200, 'Patch should return 200');
  const patchedReport = await patchRes.json();
  assert(patchedReport.status === 'in_progress', 'Status must be updated to in_progress');
  assert(patchedReport.timeline.length >= 3, 'Timeline should record status change');
  console.log(`✅ Report status updated to ${patchedReport.status}`);

  // 6. Report deletion test
  console.log('6. Testing /api/reports/:id deletion...');
  const deleteRes = await fetch(`http://localhost:3000/api/reports/${createdReport.id}`, {
    method: 'DELETE'
  });
  assert(deleteRes.status === 200, 'Delete should return 200');
  console.log('✅ Report deleted successfully.');

  // 7. AI Analysis Endpoint test
  console.log('7. Testing /api/ai/analyze-issue...');
  const aiRes = await fetch('http://localhost:3000/api/ai/analyze-issue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Water pipe leak on Usman Road',
      description: 'Continuous drinking water leakage on footpath',
      category: 'water_leakage',
      location: 'T. Nagar, Chennai',
      language: 'en'
    })
  });
  assert(aiRes.status === 200, 'AI analyze should return 200');
  const aiData = await aiRes.json();
  assert(aiData.category === 'water_leakage', 'Category should be water_leakage');
  assert(typeof aiData.complaint_draft === 'string', 'Complaint draft must be a string');
  assert(Array.isArray(aiData.missing_details), 'Missing details must be array');
  console.log('✅ AI Analyze response validated with confidence score:', aiData.confidence);

  // 8. Map issues endpoint test
  console.log('8. Testing /api/map/issues...');
  const mapRes = await fetch('http://localhost:3000/api/map/issues');
  assert(mapRes.status === 200, 'Map issues endpoint should return 200');
  const mapData = await mapRes.json();
  assert(mapData.count >= 5, 'Map should contain at least 5 geolocated issues');
  console.log(`✅ Map issues verified with ${mapData.count} points.`);

  // 9. Project Knowledge Chatbot query test
  console.log('9. Testing /api/ai/chat with project query...');
  const chatRes = await fetch('http://localhost:3000/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'What is the tech stack of SAHAAYA AI?',
      language: 'en'
    })
  });
  assert(chatRes.status === 200, 'Chat endpoint should return 200');
  const chatData = await chatRes.json();
  assert(typeof chatData.reply === 'string' && chatData.reply.length > 20, 'Reply must be comprehensive string');
  assert(Array.isArray(chatData.suggestions), 'Suggestions must be an array');
  console.log('✅ Project Chatbot query passed. Reply preview:', chatData.reply.slice(0, 70) + '...');

  console.log('\n🎉 ALL 9 TESTS PASSED SUCCESSFULLY! 🚀');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
