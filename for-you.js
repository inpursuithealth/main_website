// Preloader
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 200);
  setTimeout(() => switchView(0), 400);
});

// Top bar scroll shadow
window.addEventListener('scroll', () => {
  const tb = document.getElementById('topBar') || document.getElementById('iph-topbar'); if (tb) tb.classList.toggle('scrolled', window.scrollY > 10);
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Star parallax
document.addEventListener('mousemove', (e) => {
  const stars = document.querySelectorAll('.star');
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  stars.forEach((star, i) => {
    const depth = (i % 3 + 1) * 0.3;
    star.style.transform = 'translate(' + (x * depth) + 'px, ' + (y * depth) + 'px)';
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      const top = target.getBoundingClientRect().top + window.pageYOffset - 64;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });
});

// ===== ESTIMATOR =====
const answers = {};
let deviceSelections = [];
function selectOpt(step, el, val) {
  el.parentElement.querySelectorAll('.est-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  answers[step] = val;
  setTimeout(() => {
    document.getElementById('estStep' + step).classList.remove('active');
    if (step < 4) { document.getElementById('estStep' + (step + 1)).classList.add('active'); }
    else { showResults(); }
  }, 300);
}
function toggleOpt(el, val) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) deviceSelections.push(val);
  else deviceSelections = deviceSelections.filter(d => d !== val);
}
function advanceFromDevices() {
  answers[3] = deviceSelections;
  document.getElementById('estStep3').classList.remove('active');
  document.getElementById('estStep4').classList.add('active');
}
function showResults() {
  document.getElementById('estStep4').classList.remove('active');
  document.getElementById('estResults').classList.add('active');

  /*
   * DEFENSIBLE ESTIMATION MODEL — Conservative methodology
   *
   * SAVINGS SOURCES (peer-reviewed / federal data):
   * 1. Rx price optimization: GoodRx 2023 data shows avg $150/yr saved per Rx by switching
   *    pharmacies or using manufacturer coupons. We use $100/Rx (conservative).
   * 2. Benefit recovery: Kaiser Family Foundation 2023 — avg insured American leaves
   *    $400–$750/yr in unclaimed preventive benefits. We use $350 base (conservative).
   * 3. Cost transparency: Healthcare Bluebook shows 30–300% price variance for identical
   *    procedures. RAND Corp 2022: avg $1,200 saved when patients comparison-shop.
   *    We apply $150/yr base (assumes ~1 shoppable event every 2 years = $300/2).
   * 4. Preventive screening catch: CMS data shows early detection saves $500–$2,000/yr.
   *    We apply $0 base (only add for chronic/prevention focus since not guaranteed).
   *
   * TIME SOURCES:
   * - Accenture 2022: avg American spends 1.5 hrs/month on healthcare admin
   *   (calls, scheduling, insurance disputes). Conservative: 12 hrs/yr recoverable.
   * - Pre-visit prep: avg 15 min saved per visit × avg 4 visits/yr = 1 hr.
   * - Rx shopping: 20 min/month currently spent comparing prices = 4 hrs/yr.
   *
   * REWARDS:
   * - Vitality/Virgin Pulse programs pay $100–$400/yr for health engagement.
   * - Brand offer value based on consumer health engagement data (Limeade, Rally).
   *   We use $8–$15/month base depending on profile (conservative).
   */

  const ins = answers[0], deps = answers[1], rx = answers[2], devs = answers[3] || [], focus = answers[4];

  // BASE: Benefit recovery + cost transparency
  let savings = 350 + 150; // $350 unclaimed benefits + $150 cost transparency
  let time = 12 + 1 + 4;   // 12 admin + 1 pre-visit + 4 Rx shopping = 17 hrs
  let rewards = 96;          // $8/mo base cashback

  // Insurance type affects benefit recovery potential
  if (ins === 'employer') { savings += 200; time += 2; rewards += 48; }      // Employer plans have more hidden benefits
  else if (ins === 'medicare') { savings += 300; time += 4; rewards += 36; }  // Medicare has extensive preventive coverage
  else if (ins === 'marketplace') { savings += 100; time += 2; rewards += 24; }
  else { savings += 0; time += 1; rewards += 12; }                            // Uninsured: fewer insurance benefits to recover

  // Rx savings: $100/medication/year (conservative vs GoodRx's $150 avg)
  let rxSavings = 0;
  if (rx === '1-2') { rxSavings = 150; time += 1; }       // 1.5 Rx avg × $100
  else if (rx === '3-5') { rxSavings = 400; time += 2; }  // 4 Rx avg × $100
  else if (rx === '6+') { rxSavings = 700; time += 3; }   // 7 Rx avg × $100
  savings += rxSavings;

  // Dependents: multiply Rx savings + benefit recovery (not cost transparency)
  let depMult = 1;
  if (deps === '1') depMult = 1.5;
  else if (deps === '2-3') depMult = 1.9;
  else if (deps === '4+') depMult = 2.3;
  savings = Math.round((savings - 150) * depMult + 150); // Cost transparency doesn't multiply
  time = Math.round(time * (depMult * 0.6 + 0.4));       // Time scales less than linearly
  rewards = Math.round(rewards * depMult);

  // Devices: modest time savings from automated data sync (no inflated rewards)
  const dc = devs.length;
  time += Math.min(dc, 4) * 1;       // Each device saves ~1 hr/yr in manual logging
  rewards += Math.min(dc, 4) * 24;   // $2/mo per connected device in engagement rewards
  if (devs.includes('cgm')) savings += 120; // CGM users save on A1C-related costs

  // Focus area adds targeted value
  if (focus === 'cost') savings += 200;                          // Extra cost-shopping behavior
  else if (focus === 'chronic') { savings += 400; time += 3; }  // Chronic conditions have more savings potential (CMS data)
  else if (focus === 'fitness') { rewards += 60; }               // Fitness engagement earns more brand offers
  else if (focus === 'prevent') { savings += 150; }              // Preventive catches have modest savings

  savings = Math.round(savings / 50) * 50;
  time = Math.round(time);
  rewards = Math.round(rewards / 10) * 10;

  document.getElementById('resMoney').textContent = '$' + savings.toLocaleString() + '+';
  document.getElementById('resTime').textContent = time + '+ hrs';
  document.getElementById('resOutcome').textContent = '$' + rewards + '+';
  const insLabels = { employer: 'employer PPO/HMO plan', marketplace: 'ACA marketplace plan', medicare: 'Medicare coverage', none: 'cash-pay status' };
  const depLabels = { '0': 'individual', '1': '2-person', '2-3': 'family', '4+': 'large family' };
  document.getElementById('resInsurance').textContent = (depLabels[deps] || '') + ' ' + (insLabels[ins] || 'your insurance');
  document.getElementById('resDevices').textContent = dc > 0 ? dc + ' connected device' + (dc > 1 ? 's' : '') : 'health app connections';
  const rxLabels = { '0': 'preventive care optimization', '1-2': '1-2 prescriptions', '3-5': '3-5 prescriptions', '6+': '6+ prescriptions' };
  document.getElementById('resRx').textContent = rxLabels[rx] || 'your health profile';
  if (focus === 'chronic') document.getElementById('resOutcomeLabel').textContent = 'In Rewards & Offers / Year (Condition Mgmt)';
  else if (focus === 'fitness') document.getElementById('resOutcomeLabel').textContent = 'In Rewards & Offers / Year (Performance)';
}
function goBack(step) {
  document.getElementById('estStep' + step).classList.remove('active');
  document.getElementById('estStep' + (step - 1)).classList.add('active');
}
function restartEst() {
  document.getElementById('estResults').classList.remove('active');
  document.querySelectorAll('.est-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.est-opt').forEach(o => o.classList.remove('selected'));
  document.getElementById('estStep0').classList.add('active');
  deviceSelections = [];
}

// ===== VIEW SWITCHER =====
function switchView(idx) {
  document.querySelectorAll('.view-tab').forEach((t, i) => t.classList.toggle('active', i === idx));
  document.querySelectorAll('.view-panel').forEach((p, i) => {
    p.classList.toggle('active', i === idx);
    if (i === idx) {
      // Animate app dashboard elements
      p.querySelectorAll('.app-card, .app-action-banner, .app-stats-row').forEach((c, j) => {
        c.style.opacity = '0'; c.style.transform = 'translateY(12px)';
        setTimeout(() => { c.style.transition = 'all 0.35s ease'; c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, 80 + j * 100);
      });
      // Animate lock screen + widget cards
      const cards = p.querySelectorAll('.notif-card, .lock-notif, .widget-card');
      cards.forEach((c, j) => {
        c.classList.remove('animate');
        setTimeout(() => c.classList.add('animate'), j * 150);
      });
    }
  });
}

// ===== PIPELINE ANIMATION =====
(function() {
  const pipeline = document.getElementById('pipeline');
  if (!pipeline) return;
  const counter = document.getElementById('pipeCounter');
  const fill = document.getElementById('pipeBarFill');
  const cards = document.querySelectorAll('#viewPanel0 .notif-card');
  let animated = false;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !animated) {
        animated = true;
        // Counter animation
        let count = 0;
        const target = 1847;
        function tick() {
          count = Math.min(count + Math.ceil((target - count) / 25) + Math.floor(Math.random() * 30), target);
          counter.textContent = count.toLocaleString();
          if (count < target) requestAnimationFrame(tick);
          else setInterval(() => {
            counter.textContent = (target + Math.floor(Math.random() * 80 - 40)).toLocaleString();
          }, 1200);
        }
        setTimeout(tick, 800);
        // Fill bar
        setTimeout(() => { fill.style.width = '100%'; fill.style.transition = 'width 1.8s ease'; }, 600);
        // Cascade phone cards
        cards.forEach((c, i) => {
          setTimeout(() => c.classList.add('animate'), 1400 + i * 220);
        });
      }
    });
  }, { threshold: 0.15 });
  obs.observe(pipeline);
})();

// ===== PERSONAS =====
function selectPersona(idx) {
  document.querySelectorAll('.persona-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
  document.querySelectorAll('.day-panel').forEach((p, i) => p.classList.toggle('active', i === idx));
}

// ===== HORIZONTAL MOMENT SELECTOR =====
function selectMoment(panel, idx) {
  const area = document.querySelector('#panel' + panel + ' .h-detail-area');
  if (!area) return;
  area.querySelectorAll('.h-moment').forEach((m, i) => m.classList.toggle('active', i === idx));
  const track = document.querySelector('#panel' + panel + ' .h-time-track');
  if (track) track.querySelectorAll('.h-time-pill').forEach((p, i) => p.classList.toggle('active', i === idx));
}

// Journey section handled by renderJourney()
const journeyData = {
  0: { name: 'Robert', times: [
    { title: 'Connect & Discover', items: [
      {t:'save', text:'Links Humana Medicare Advantage + Dexcom G7 + MyFitnessPal in 3 minutes'},
      {t:'save', text:'First Rx alert: <strong>Metformin is $43 cheaper</strong> at Costco on his plan'},
      {t:'outcome', text:'Glucose pattern tracking begins &mdash; correlating meals with Dexcom spikes'}
    ], stats: [{v:'$0',l:'Cost',c:'green'},{v:'3 min',l:'Setup',c:'blue'},{v:'1st',l:'Alert',c:'gold'}] },
    { title: 'First Savings Hit', items: [
      {t:'save', text:'Switched pharmacy &mdash; <strong>saving $516/year on metformin alone</strong>'},
      {t:'outcome', text:'Post-meal walk nudges timed to his actual spike window reduce glucose 18%'},
      {t:'reward', text:'Earned $18 cashback for A1C lab completion and walking streaks &mdash; deposited to bank or HSA'}
    ], stats: [{v:'$180',l:'Saved',c:'green'},{v:'2.1 hrs',l:'Saved',c:'blue'},{v:'340',l:'Points',c:'gold'}] },
    { title: 'Patterns Emerge', items: [
      {t:'outcome', text:'InPursuit detects his worst spikes happen Tues/Thurs after pasta dinners'},
      {t:'save', text:'Overdue diabetic eye exam surfaced &mdash; <strong>$20 screening prevents $15K treatment</strong>'},
      {t:'reward', text:'AG1 and Thorne offers unlocked based on his T2D management profile'}
    ], stats: [{v:'$620',l:'Saved',c:'green'},{v:'6 hrs',l:'Saved',c:'blue'},{v:'1,240',l:'Points',c:'gold'}] },
    { title: 'Running in the Background', items: [
      {t:'save', text:'Humana formulary changed &mdash; InPursuit <strong>auto-found a $0 generic alternative</strong>'},
      {t:'outcome', text:'A1C down 1.2 points. His endocrinologist reduced medication dosage'},
      {t:'reward', text:'Collected $280 in brand cashback &mdash; CGM supplies, supplement discounts. Choose bank, HSA, or gift card'}
    ], stats: [{v:'$3,800',l:'Saved',c:'green'},{v:'18 hrs',l:'Saved',c:'blue'},{v:'$280',l:'Cashback',c:'gold'}] },
    { title: 'Health Compound Interest', items: [
      {t:'save', text:'Open enrollment: InPursuit recommended a plan <strong>saving $1,400/yr</strong> with better Rx coverage'},
      {t:'outcome', text:'All screenings current. A1C from 8.1 to 6.4. Off one medication entirely'},
      {t:'reward', text:'Health profile attracts premium brand offers worth $1,200+/yr &mdash; cashback, discounts, and HSA credits'}
    ], stats: [{v:'$8,200+',l:'Saved',c:'green'},{v:'36+ hrs',l:'Saved',c:'blue'},{v:'$1,200+',l:'Cashback',c:'gold'}] }
  ]},
  1: { name: 'Sarah', times: [
    { title: 'Connect & Discover', items: [
      {t:'save', text:'Links Cigna PPO + Apple Watch + Ovia Pregnancy + Headspace in 3 minutes'},
      {t:'save', text:'First alert: <strong>Prenatal vitamins $31 cheaper</strong> as Rx on her Cigna formulary'},
      {t:'outcome', text:'Prenatal care timeline auto-generated from OB records &mdash; every remaining screening scheduled'}
    ], stats: [{v:'$0',l:'Cost',c:'green'},{v:'3 min',l:'Setup',c:'blue'},{v:'1st',l:'Alert',c:'gold'}] },
    { title: 'First Savings Hit', items: [
      {t:'save', text:'Delivery cost comparison: <strong>$4,700 difference</strong> between two in-network hospitals'},
      {t:'outcome', text:'Sleep disruption at 29 weeks flagged as normal &mdash; anxiety spiral prevented'},
      {t:'time', text:'Glucose screening reminder with $0 coverage confirmation + nearest lab with shortest wait'}
    ], stats: [{v:'$4,700',l:'Potential Savings',c:'green'},{v:'3.5 hrs',l:'Saved',c:'blue'},{v:'480',l:'Points',c:'gold'}] },
    { title: 'Third Trimester Intelligence', items: [
      {t:'outcome', text:'BP trending 128/82 &mdash; InPursuit creates a <strong>7-day tracking card</strong> for her OB visit'},
      {t:'time', text:'Cigna covers 20 therapy sessions/yr &mdash; 3 prenatal anxiety specialists surfaced with telehealth'},
      {t:'reward', text:'Nursery &amp; baby prep offers from partners: Hatch, Babylist &mdash; $180 in exclusive discounts'}
    ], stats: [{v:'$5,200',l:'Saved',c:'green'},{v:'8 hrs',l:'Saved',c:'blue'},{v:'$180',l:'Offers',c:'gold'}] },
    { title: 'New Mom, New Rhythms', items: [
      {t:'outcome', text:'Baby born healthy at 39 weeks. InPursuit <strong>auto-transitioned to postpartum + pediatric timelines</strong>'},
      {t:'save', text:'Lactation consultant covered at $0 under preventive. Postpartum visit + mental health screening scheduled'},
      {t:'reward', text:'Brand offers at key moments: formula samples, developmental toys, meal delivery &mdash; $320 in cashback + discounts'}
    ], stats: [{v:'$7,400',l:'Saved',c:'green'},{v:'22 hrs',l:'Saved',c:'blue'},{v:'$420',l:'Cashback',c:'gold'}] },
    { title: 'Family Health Hub', items: [
      {t:'save', text:'Baby added to Cigna at birth. InPursuit <strong>auto-built pediatric screening + immunization tracker</strong>'},
      {t:'outcome', text:'Postpartum depression caught early via HRV + Headspace patterns &mdash; therapy started within 48 hrs'},
      {t:'reward', text:'Family tier &mdash; $1,400+/yr in brand cashback + offers across mom + baby health profiles'}
    ], stats: [{v:'$12,000+',l:'Saved',c:'green'},{v:'40+ hrs',l:'Saved',c:'blue'},{v:'$1,400+',l:'Cashback',c:'gold'}] }
  ]},
  2: { name: 'Patrick', times: [
    { title: 'Connect & Discover', items: [
      {t:'time', text:'Links WHOOP + Oura + Levels CGM + Strava + Peloton + Anthem BCBS in 3 minutes'},
      {t:'outcome', text:'Five devices generating data &mdash; for the first time, <strong>all connected to his insurance benefits</strong>'},
      {t:'save', text:'First alert: Executive physical covered at $0 under preventive &mdash; he was paying $2,400 cash'}
    ], stats: [{v:'$0',l:'Cost',c:'green'},{v:'3 min',l:'Setup',c:'blue'},{v:'1st',l:'Alert',c:'gold'}] },
    { title: 'First Savings Hit', items: [
      {t:'save', text:'<strong>$2,400 saved</strong> by routing executive physical through Anthem preventive benefit'},
      {t:'outcome', text:'WHOOP recovery + Oura sleep + Levels glucose correlated for the first time'},
      {t:'reward', text:'Performance supplement offers: Momentous, AG1, Thorne &mdash; curated to his biometrics'}
    ], stats: [{v:'$2,400',l:'Saved',c:'green'},{v:'4 hrs',l:'Saved',c:'blue'},{v:'520',l:'Points',c:'gold'}] },
    { title: 'Optimization Mode', items: [
      {t:'outcome', text:'InPursuit finds his HRV drops 22% on meeting-heavy days &mdash; <strong>auto-suggests recovery protocols</strong>'},
      {t:'save', text:'Testosterone panel covered under Anthem at $30 &mdash; he was paying $380 at a longevity clinic'},
      {t:'reward', text:'Longevity Reddit saves cross-referenced with actual lab results &mdash; personalized relevance scores'}
    ], stats: [{v:'$3,200',l:'Saved',c:'green'},{v:'10 hrs',l:'Saved',c:'blue'},{v:'$340',l:'Offers',c:'gold'}] },
    { title: 'The Longevity Dashboard', items: [
      {t:'outcome', text:'6-month trend: <strong>resting HR down 8 bpm, HRV up 14ms, glucose variability down 30%</strong>'},
      {t:'save', text:'DEXA scan + coronary calcium score found in-network at $180 total vs. $1,200 cash'},
      {t:'reward', text:'Curated health feed is a longevity library &mdash; 47 saved articles connected to his biomarkers'}
    ], stats: [{v:'$6,800',l:'Saved',c:'green'},{v:'24 hrs',l:'Saved',c:'blue'},{v:'$680',l:'Cashback',c:'gold'}] },
    { title: 'Peak Performance', items: [
      {t:'save', text:'Open enrollment: InPursuit identified an HSA-eligible plan <strong>saving $3,200/yr</strong> with better labs coverage'},
      {t:'outcome', text:'Biological age testing: down 4.2 years. Every metric trending right, all connected in one place'},
      {t:'reward', text:'$2,400+/yr in performance brand cashback + offers + priority access to clinical trials'}
    ], stats: [{v:'$14,000+',l:'Saved',c:'green'},{v:'48+ hrs',l:'Saved',c:'blue'},{v:'$2,400+',l:'Cashback',c:'gold'}] }
  ]},
  3: { name: 'Maya', times: [
    { title: 'Connect & Discover', items: [
      {t:'time', text:'Links Garmin + Cronometer + parent&rsquo;s UHC PPO in 2 minutes from her phone'},
      {t:'outcome', text:'Pre-game fueling alerts start based on <strong>her actual Garmin training load data</strong>'},
      {t:'save', text:'Sports medicine visit: $40 copay on parent&rsquo;s plan &mdash; she didn&rsquo;t know she was covered'}
    ], stats: [{v:'$0',l:'Cost',c:'green'},{v:'2 min',l:'Setup',c:'blue'},{v:'1st',l:'Alert',c:'gold'}] },
    { title: 'Game Day Edge', items: [
      {t:'outcome', text:'Personalized pre-game nutrition plan: <strong>600+ cal 3 hours before</strong> based on her deficit patterns'},
      {t:'save', text:'3 in-network sports medicine docs near campus surfaced with real copay amounts'},
      {t:'reward', text:'Earned $14 cashback for hydration tracking + recovery streaks &mdash; deposited to bank or HSA'}
    ], stats: [{v:'$120',l:'Saved',c:'green'},{v:'1.5 hrs',l:'Saved',c:'blue'},{v:'280',l:'Points',c:'gold'}] },
    { title: 'Performance Patterns', items: [
      {t:'outcome', text:'Garmin shows overtraining signal &mdash; InPursuit correlates with <strong>iron levels from last lab</strong>'},
      {t:'time', text:'Iron panel covered at $0 under preventive &mdash; low ferritin confirmed, supplement protocol started'},
      {t:'reward', text:'Offers unlocked: Momentous, LMNT electrolytes, recovery tools &mdash; athlete-specific brands'}
    ], stats: [{v:'$480',l:'Saved',c:'green'},{v:'4 hrs',l:'Saved',c:'blue'},{v:'$160',l:'Offers',c:'gold'}] },
    { title: 'In-Season Autopilot', items: [
      {t:'outcome', text:'Sleep + recovery + nutrition auto-tracked. <strong>+12% sprint speed, -40% injury risk</strong>'},
      {t:'save', text:'PT visits covered at $30 each &mdash; 8 sessions used in-network she would have skipped'},
      {t:'reward', text:'Athlete profile attracts premium brand interest &mdash; Garmin, Hyperice, Therabody offers'}
    ], stats: [{v:'$1,400',l:'Saved',c:'green'},{v:'12 hrs',l:'Saved',c:'blue'},{v:'$320',l:'Cashback',c:'gold'}] },
    { title: 'Year-Round Athlete', items: [
      {t:'save', text:'Pre-season physical + all clearances <strong>routed through parent&rsquo;s plan at $0</strong> &mdash; was paying cash'},
      {t:'outcome', text:'Full athletic year tracked: sleep, nutrition, recovery, labs. D1 recruiting profile strengthened'},
      {t:'reward', text:'$800+/yr in athlete brand offers + supplement partnerships + recovery tool discounts'}
    ], stats: [{v:'$3,200+',l:'Saved',c:'green'},{v:'24+ hrs',l:'Saved',c:'blue'},{v:'$800+',l:'Cashback',c:'gold'}] }
  ]},
  4: { name: 'David', times: [
    { title: 'Connect & Discover', items: [
      {t:'time', text:'Links Aetna Intl PPO + Apple Watch + Withings BP + Headspace in 3 minutes'},
      {t:'outcome', text:'Medication card auto-generated: <strong>Lisinopril, Amlodipine, Atorvastatin</strong> &mdash; translated to 6 languages'},
      {t:'save', text:'First alert: international urgent care covered at $22 copay &mdash; not the $2,000+ he expected'}
    ], stats: [{v:'$0',l:'Cost',c:'green'},{v:'3 min',l:'Setup',c:'blue'},{v:'1st',l:'Alert',c:'gold'}] },
    { title: 'First Trip Protected', items: [
      {t:'save', text:'Tokyo urgent care: <strong>$22 copay vs. $2,000+ out-of-network ER</strong> &mdash; English-speaking doctor found'},
      {t:'time', text:'Emergency medical summary shared with Japanese doctor in 30 seconds &mdash; no paperwork'},
      {t:'outcome', text:'BP spike caught 3 days before it became dangerous &mdash; medication adjusted in real-time'}
    ], stats: [{v:'$1,800',l:'Saved',c:'green'},{v:'3 hrs',l:'Saved',c:'blue'},{v:'420',l:'Points',c:'gold'}] },
    { title: 'Global Health Profile', items: [
      {t:'outcome', text:'BP trends from 3 time zones analyzed &mdash; <strong>jet lag + sodium identified as triggers</strong>'},
      {t:'save', text:'International claims auto-filed across 2 countries &mdash; $0 surprise bills'},
      {t:'reward', text:'Travel health offers: medication delivery, travel insurance upgrades, international pharmacy access'}
    ], stats: [{v:'$3,600',l:'Saved',c:'green'},{v:'8 hrs',l:'Saved',c:'blue'},{v:'$240',l:'Offers',c:'gold'}] },
    { title: 'Continuity Everywhere', items: [
      {t:'save', text:'4 international trips. <strong>Zero billing surprises. Zero continuity gaps</strong> between providers'},
      {t:'outcome', text:'PCP has real-time view of every international visit, med change, and vital trend'},
      {t:'reward', text:'Global health profile attracts premium travel health and pharma brand partnerships'}
    ], stats: [{v:'$7,200',l:'Saved',c:'green'},{v:'20 hrs',l:'Saved',c:'blue'},{v:'$480',l:'Cashback',c:'gold'}] },
    { title: 'World-Class Care Anywhere', items: [
      {t:'save', text:'Aetna plan optimized at open enrollment &mdash; <strong>$2,100 saved</strong> with better international coverage'},
      {t:'outcome', text:'BP controlled globally. Medication synced across 3 countries. Zero gaps in 12 months'},
      {t:'reward', text:'$1,600+/yr in travel health cashback + global pharmacy network + medical concierge offers'}
    ], stats: [{v:'$11,000+',l:'Saved',c:'green'},{v:'40+ hrs',l:'Saved',c:'blue'},{v:'$1,600+',l:'Cashback',c:'gold'}] }
  ]},
  5: { name: 'Elena', times: [
    { title: 'Connect & Discover', items: [
      {t:'save', text:'Links BCBS PPO + Apple Watch + oncology portal in 3 minutes'},
      {t:'save', text:'First Rx alert: <strong>generic anti-nausea medication saves $89/month</strong>'},
      {t:'outcome', text:'HRV and anxiety markers begin syncing &mdash; baseline established before chemo cycle 3'}
    ], stats: [{v:'$0',l:'Cost',c:'green'},{v:'3 min',l:'Setup',c:'blue'},{v:'1st',l:'Rx Alert',c:'gold'}] },
    { title: 'First Savings Hit', items: [
      {t:'save', text:'Discovers <strong>30 mental health sessions fully covered</strong> by BCBS &mdash; was paying $180/session cash'},
      {t:'outcome', text:'Drug interaction check flags supplement risk with AC-T chemo regimen'},
      {t:'reward', text:'Cancer care offers unlocked: meal delivery, wig services, compression wear &mdash; $120 in discounts'}
    ], stats: [{v:'$5,400',l:'Identified',c:'green'},{v:'4 hrs',l:'Saved',c:'blue'},{v:'$120',l:'Offers',c:'gold'}] },
    { title: 'Cancer Care Clarity', items: [
      {t:'outcome', text:'AI builds <strong>pre-visit prep for every oncology appointment</strong> with latest labs + side effects log'},
      {t:'save', text:'Insurance pre-authorization tracked for PET scan &mdash; no surprise denials, $0 out-of-pocket'},
      {t:'time', text:'Symptom log auto-shared with oncologist 24 hours before each visit &mdash; more productive appointments'}
    ], stats: [{v:'$7,200',l:'Saved',c:'green'},{v:'12 hrs',l:'Saved',c:'blue'},{v:'$340',l:'Offers',c:'gold'}] },
    { title: 'Evidence-Based Warrior', items: [
      {t:'outcome', text:'Longitudinal symptom tracking: <strong>fatigue, nausea, anxiety mapped across 4 chemo cycles</strong>'},
      {t:'save', text:'$2,800+ saved on Rx switches, therapy sessions, and recovered out-of-network claims'},
      {t:'reward', text:'Clinical trial matching based on her specific cancer profile &mdash; 2 eligible trials surfaced'}
    ], stats: [{v:'$10,000',l:'Saved',c:'green'},{v:'28 hrs',l:'Saved',c:'blue'},{v:'2',l:'Trials Found',c:'gold'}] },
    { title: 'Beating Cancer, Informed', items: [
      {t:'save', text:'<strong>$18,000+ saved</strong> across Rx, therapy, imaging, and insurance navigation in one year'},
      {t:'outcome', text:'Complete oncology record with treatment timeline &mdash; any new provider sees the full picture in seconds'},
      {t:'reward', text:'Survivorship tier &mdash; $1,800+/yr in brand cashback + cancer survivor community + preventive screening offers'}
    ], stats: [{v:'$18,000+',l:'Saved',c:'green'},{v:'48+ hrs',l:'Saved',c:'blue'},{v:'$1,800+',l:'Cashback',c:'gold'}] }
  ]}
};

let currentJPersona = 0, currentJTime = 0;

function selectJourneyPersona(idx) {
  currentJPersona = idx;
  document.querySelectorAll('.journey-persona-tab').forEach(function(t, i) { t.classList.toggle('active', i === idx); });
  renderJourney();
}

function selectJourneyTime(idx) {
  currentJTime = idx;
  document.querySelectorAll('.journey-time-btn').forEach(function(t, i) {
    t.classList.toggle('active', i === idx);
    t.classList.toggle('passed', i < idx);
  });
  document.getElementById('jtFill').style.width = (idx / 4 * 100) + '%';
  renderJourney();
}

function renderJourney() {
  var d = journeyData[currentJPersona].times[currentJTime];
  var container = document.getElementById('journeyContent');
  var statsBar = document.getElementById('journeyStats');
  var html = '<div class="journey-grid">';
  html += '<div class="journey-card"><h4>' + d.title + '</h4>';
  d.items.forEach(function(item) {
    html += '<div class="journey-item"><div class="ji ji-' + item.t + '"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div><div>' + item.text + '</div></div>';
  });
  html += '</div>';
  var names = ['Robert','Sarah','Patrick','Maya','David','Elena'];
  var timeLabels = ['Day 1','Week 1','Month 1','6 Months','Year 1'];
  var contexts = {
    0: ['Recently diagnosed T2D. Overpaying for Rx. Missing free screenings.','Pharmacy switched. Glucose tracking active. First streaks started.','Patterns emerging. Overdue screenings surfaced. Brand offers unlocking.','A1C improving. Medication reduced. Rewards compounding silently.','All metrics trending right. Plan optimized. Health compounding.'],
    1: ['28 weeks pregnant. Overwhelmed. Every symptom triggers a Google spiral.','29 weeks. Delivery costs compared. Sleep anxiety addressed. Screenings on track.','32 weeks. Third trimester deep. BP monitoring. Therapy coverage surfaced.','Baby is 3 months old. Postpartum care active. Pediatric milestones tracking.','Baby is 9 months old. Family health profiles connected. Mom thriving.'],
    2: ['Five devices, zero insurance connection. Paying cash for covered services.','Executive physical routed through insurance. $2,400 saved day one.','HRV + sleep + glucose correlated. Longevity labs covered in-network.','6-month biomarker trends all improving. Curated health feed growing.','Biological age down. Every metric connected. Peak performance mode.'],
    3: ['D1 forward on parent\u2019s plan. Doesn\u2019t know what\u2019s covered. Under-fueling.','Pre-game nutrition dialed in. Sports medicine coverage discovered.','Iron deficiency caught via device + lab correlation. Protocol started.','Full season tracked. Sprint speed up 12%. Injury risk down 40%.','Year-round athlete profile. Recruiting data strengthened. Fully optimized.'],
    4: ['3 meds, 6 countries/yr, zero continuity. ER visits = $2,000+ surprises.','First international urgent care at $22. Medical summary shared in 30 seconds.','BP triggers mapped across time zones. International claims auto-filed.','4 trips, zero billing surprises. PCP sees every visit in real-time.','Global health profile optimized. Medication synced across 3 countries.'],
    5: ['Breast cancer diagnosis. Overwhelmed by treatment costs and insurance complexity.','$5,400 in mental health coverage discovered. Drug interaction caught early.','Oncology visits prepped automatically. Insurance pre-auth tracked in real-time.','4 chemo cycles tracked. Symptoms mapped. 2 clinical trials matched.','Complete oncology record. $18K saved. Cancer survivorship tier unlocked.']
  };
  html += '<div class="journey-card" style="display:flex;flex-direction:column;justify-content:center;">';
  html += '<div style="font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:12px;">' + names[currentJPersona] + ' \u00B7 ' + timeLabels[currentJTime] + '</div>';
  html += '<p style="font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;font-family:Instrument Serif,serif;">' + contexts[currentJPersona][currentJTime] + '</p>';
  html += '<p style="font-size:13px;color:rgba(255,255,255,0.3);margin-top:16px;line-height:1.6;">InPursuit works <strong style="color:rgba(255,255,255,0.6);">passively in the background</strong> \u2014 saving money, surfacing brand offers, and earning cashback even when ' + names[currentJPersona] + ' isn\u2019t actively using the app.</p>';
  html += '</div></div>';
  container.innerHTML = html;
  var statsHtml = '';
  d.stats.forEach(function(s) {
    statsHtml += '<div class="journey-stat-card"><div class="journey-stat-num ' + s.c + '">' + s.v + '</div><div class="journey-stat-label">' + s.l + '</div></div>';
  });
  statsBar.innerHTML = statsHtml;
}
renderJourney();


function sendToInPursuit() {
  var btn = document.querySelector('.curate-send-btn');
  var confirm = document.getElementById('curateConfirm');
  btn.style.background = 'linear-gradient(135deg, #4ADE80, #22C55E)';
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Sent!';
  confirm.classList.add('show');
  setTimeout(function() {
    btn.style.background = 'linear-gradient(135deg, var(--gold), var(--gold-light))';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg> Send to InPursuit';
    confirm.classList.remove('show');
  }, 3000);
}

function toggleFaq(btn) {
  var item = btn.parentElement;
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(el) { el.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}

// Handle broken logo images
document.querySelectorAll('img').forEach(img => {
  img.onerror = function() { this.style.display = 'none'; };
});

// ===== WAITLIST =====
(function() {
  const SUPA_URL  = 'https://weaektyawlgxhqusjymw.supabase.co';
  const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYWVrdHlhd2xneGhxdXNqeW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMDQ4NzEsImV4cCI6MjA4ODY4MDg3MX0.W7Zu3CueXLGOHaeUmuKDkduquaJzUpZCrXQ4jp9IYi4';
  const supa = supabase.createClient(SUPA_URL, SUPA_ANON);

  const emailEl   = document.getElementById('earlyEmail');
  const btn       = document.getElementById('earlyBtn');
  const msgEl     = document.getElementById('earlyMsg');
  const formEl    = document.getElementById('earlyForm');
  const successEl = document.getElementById('earlySuccess');
  const noteEl    = document.getElementById('earlyNote');

  function showMsg(text, type) {
    msgEl.textContent = text;
    msgEl.className = 'early-msg show early-msg--' + type;
  }

  function clearMsg() {
    msgEl.className = 'early-msg';
    msgEl.textContent = '';
  }

  async function joinWaitlist() {
    const email = (emailEl.value || '').trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMsg('Please enter a valid email address.', 'error');
      emailEl.focus();
      return;
    }

    clearMsg();
    btn.disabled = true;
    btn.classList.add('loading');

    const { error } = await supa.from('waitlist').insert({
      email,
      source: 'for-you-page',
      user_agent: navigator.userAgent
    });

    btn.classList.remove('loading');
    btn.disabled = false;

    if (!error) {
      formEl.style.display = 'none';
      noteEl.style.display = 'none';
      successEl.classList.add('show');
    } else if (error.code === '23505') {
      showMsg("You're already on the list \u2014 we'll be in touch soon.", 'info');
    } else {
      showMsg('Something went wrong. Please try again.', 'error');
    }
  }

  btn.addEventListener('click', joinWaitlist);
  emailEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') joinWaitlist();
  });
})();
