// ── Time of day ──────────────────────────────────────────
function getTimeClass() {
  const h = new Date().getHours();
  if (h >= 4 && h < 7)  return 'time-dawn';
  if (h >= 7 && h < 17) return 'time-day';
  if (h >= 17 && h < 19) return 'time-dusk';
  return 'time-night';
}

function applyTimeBackground() {
  const cls = getTimeClass();
  document.body.classList.remove('time-dawn', 'time-day', 'time-dusk', 'time-night');
  document.body.classList.add(cls);
}

// ── Stars ────────────────────────────────────────────────
function buildStars() {
  const container = document.getElementById('stars');
  container.innerHTML = '';
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 1;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random()*100}%;
      left:${Math.random()*100}%;
      --dur:${(Math.random()*2+1.5).toFixed(1)}s;
      animation-delay:${(Math.random()*3).toFixed(1)}s;
    `;
    container.appendChild(s);
  }
}

// ── Screen helpers ────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ── Greeting ──────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12)  return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  return 'Good evening';
}

function updateGreeting() {
  const name = localStorage.getItem('user') || '';
  const el = document.getElementById('greeting-text');
  el.textContent = `${getGreeting()}${name ? ', ' + name : ''}`;
}

// ── Entry screen ──────────────────────────────────────────
const PASSPHRASE = '27062026';

function initEntryScreen() {
  const form  = document.getElementById('passphrase-form');
  const input = document.getElementById('passphrase-input');
  const err   = document.getElementById('error-msg');

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (input.value === PASSPHRASE) {
      localStorage.setItem('unlocked', 'true');
      input.classList.remove('error');
      err.textContent = '';
      if (!localStorage.getItem('user')) {
        showScreen('identity-screen');
      } else {
        updateGreeting();
        showScreen('home-screen');
      }
    } else {
      input.classList.add('error');
      err.textContent = 'Incorrect passphrase. Try again.';
      input.value = '';
      setTimeout(() => input.classList.remove('error'), 600);
    }
  });
}

// ── Identity screen ───────────────────────────────────────
function initIdentityScreen() {
  document.querySelectorAll('.identity-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      localStorage.setItem('user', name);
      updateGreeting();
      showScreen('home-screen');
    });
  });
}

// ── Bottom nav ────────────────────────────────────────────
function initNav() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Switch visible tab panel
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById('tab-' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
      if (tab.dataset.tab === 'athkar') renderAthkar();
      if (tab.dataset.tab === 'wird')   renderWird();
      if (tab.dataset.tab === 'shared')   renderGratitude();
      if (tab.dataset.tab === 'settings') renderSettings();
    });
  });
}

// ── Athkar data ───────────────────────────────────────────
const ATHKAR = {
  morning: [
    {
      arabic: 'آيَةُ الْكُرْسِيِّ',
      verse:  'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
      english: 'Ayat al-Kursi — Al-Baqarah 2:255',
      type: 'single',
    },
    {
      arabic: 'سُورَةُ الْإِخْلَاصِ',
      verse:  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
      english: 'Surah Al-Ikhlas — Chapter 112',
      type: 'single',
    },
    {
      arabic: 'سُورَةُ الْفَلَقِ',
      verse:  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
      english: 'Surah Al-Falaq — Chapter 113',
      type: 'single',
    },
    {
      arabic: 'سُورَةُ النَّاسِ',
      verse:  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ',
      english: 'Surah An-Nas — Chapter 114',
      type: 'single',
    },
    {
      arabic: 'خَوَاتِيمُ سُورَةِ الْبَقَرَةِ',
      verse:  'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ۝ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
      english: 'Last 2 verses of Al-Baqarah — 2:285-286',
      type: 'single',
    },
    {
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
      verse:  'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
      english: 'We have entered the morning and dominion belongs to Allah',
      type: 'single',
    },
    {
      arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا',
      verse:  'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
      english: 'O Allah, by You we enter the morning, by You we enter the evening, by You we live and die, and to You is the resurrection',
      type: 'single',
    },
    {
      arabic: 'سَيِّدُ الِاسْتِغْفَارِ',
      verse:  'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
      english: 'Sayyid al-Istighfar — the master supplication for forgiveness',
      type: 'single',
    },
    {
      arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ',
      verse:  'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      english: 'In the name of Allah, with whose name nothing is harmed on earth nor in the heavens, and He is the All-Hearing, the All-Knowing',
      type: 'counter', target: 3,
    },
    { arabic: 'سُبْحَانَ اللَّهِ',          verse: null, english: 'Glory be to Allah',        type: 'counter', target: 33 },
    { arabic: 'اَلْحَمْدُ لِلَّهِ',         verse: null, english: 'All praise be to Allah',    type: 'counter', target: 33 },
    { arabic: 'اَللَّهُ أَكْبَرُ',          verse: null, english: 'Allah is the Greatest',     type: 'counter', target: 34 },
    {
      arabic: 'اَللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
      verse:  'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
      english: 'Salawat on the Prophet ﷺ',
      type: 'counter', target: 10,
    },
    {
      arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
      verse:  'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      english: 'None has the right to be worshipped except Allah, alone — to Him belongs dominion and all praise, and He is over all things capable',
      type: 'single',
    },
  ],
  evening: [
    {
      arabic: 'آيَةُ الْكُرْسِيِّ',
      verse:  'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
      english: 'Ayat al-Kursi — Al-Baqarah 2:255',
      type: 'single',
    },
    {
      arabic: 'سُورَةُ الْإِخْلَاصِ',
      verse:  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
      english: 'Surah Al-Ikhlas — Chapter 112',
      type: 'single',
    },
    {
      arabic: 'سُورَةُ الْفَلَقِ',
      verse:  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
      english: 'Surah Al-Falaq — Chapter 113',
      type: 'single',
    },
    {
      arabic: 'سُورَةُ النَّاسِ',
      verse:  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ',
      english: 'Surah An-Nas — Chapter 114',
      type: 'single',
    },
    {
      arabic: 'خَوَاتِيمُ سُورَةِ الْبَقَرَةِ',
      verse:  'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ۝ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
      english: 'Last 2 verses of Al-Baqarah — 2:285-286',
      type: 'single',
    },
    {
      arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
      verse:  'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
      english: 'We have entered the evening and dominion belongs to Allah',
      type: 'single',
    },
    {
      arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا',
      verse:  'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
      english: 'O Allah, by You we enter the evening, by You we enter the morning, by You we live and die, and to You is the return',
      type: 'single',
    },
    {
      arabic: 'سَيِّدُ الِاسْتِغْفَارِ',
      verse:  'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
      english: 'Sayyid al-Istighfar — the master supplication for forgiveness',
      type: 'single',
    },
    {
      arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ',
      verse:  'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      english: 'In the name of Allah, with whose name nothing is harmed on earth nor in the heavens, and He is the All-Hearing, the All-Knowing',
      type: 'counter', target: 3,
    },
    { arabic: 'سُبْحَانَ اللَّهِ',          verse: null, english: 'Glory be to Allah',        type: 'counter', target: 33 },
    { arabic: 'اَلْحَمْدُ لِلَّهِ',         verse: null, english: 'All praise be to Allah',    type: 'counter', target: 33 },
    { arabic: 'اَللَّهُ أَكْبَرُ',          verse: null, english: 'Allah is the Greatest',     type: 'counter', target: 34 },
    {
      arabic: 'اَللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
      verse:  'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
      english: 'Salawat on the Prophet ﷺ',
      type: 'counter', target: 10,
    },
    {
      arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
      verse:  null,
      english: 'I seek refuge in the perfect words of Allah from the evil of what He has created',
      type: 'counter', target: 3,
    },
  ],
};

// ── Athkar localStorage ───────────────────────────────────
function athkarKey() {
  const user = localStorage.getItem('user') || 'unknown';
  return 'athkar_' + user + '_' + new Date().toISOString().slice(0, 10);
}

function loadAthkarState() {
  const raw = localStorage.getItem(athkarKey());
  if (raw) return JSON.parse(raw);
  const state = { morning: [], evening: [] };
  ['morning', 'evening'].forEach(s => {
    state[s] = ATHKAR[s].map(item => item.type === 'single' ? false : 0);
  });
  return state;
}

function saveAthkarState(state) {
  localStorage.setItem(athkarKey(), JSON.stringify(state));
}

function isItemDone(item, val) {
  return item.type === 'single' ? val === true : val >= item.target;
}

function isSessionComplete(session, state) {
  return ATHKAR[session].every((item, i) => isItemDone(item, state[session][i]));
}

// ── Athkar render ─────────────────────────────────────────
let currentAthkarSession = 'morning';

function renderAthkar() {
  const state   = loadAthkarState();
  const session = currentAthkarSession;
  const items   = ATHKAR[session];
  const list    = document.getElementById('athkar-list');
  if (!list) return;
  list.innerHTML = '';

  // Progress bar
  const doneCount = items.filter((item, i) => isItemDone(item, state[session][i])).length;
  document.getElementById('athkar-progress-text').textContent = `${doneCount} / ${items.length} complete`;
  document.getElementById('athkar-progress-fill').style.width = `${(doneCount / items.length) * 100}%`;

  // Toggle buttons
  document.querySelectorAll('.athkar-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.session === session);
  });

  // Sync barakah meter
  updateBarakahMeter();

  // Cards
  items.forEach((item, i) => {
    const val  = state[session][i];
    const done = isItemDone(item, val);
    const card = document.createElement('div');
    card.className = 'thikr-card' + (done ? ' done' : '');

    const arabic = document.createElement('p');
    arabic.className = 'arabic';
    arabic.textContent = item.arabic;

    const english = document.createElement('p');
    english.className = 'english';
    english.textContent = item.english;

    card.appendChild(arabic);

    if (item.verse) {
      const verse = document.createElement('p');
      verse.className = 'verse';
      verse.textContent = item.verse;
      card.appendChild(verse);
    }

    card.appendChild(english);

    if (item.type === 'single') {
      if (done) {
        const check = document.createElement('div');
        check.className = 'done-check';
        check.textContent = '✓ Done';
        card.appendChild(check);
      } else {
        card.addEventListener('click', () => {
          state[session][i] = true;
          saveAthkarState(state);
          renderAthkar();
          checkSleepyIndicator(state);
        });
      }
    } else {
      card.style.cursor = 'default';
      const row = document.createElement('div');
      row.className = 'thikr-counter-row';

      const display = document.createElement('span');
      display.className = 'counter-display';
      display.textContent = `${val} / ${item.target}`;

      const btn = document.createElement('button');
      btn.className = 'counter-btn';
      btn.textContent = done ? '✓' : '+1';
      if (!done) {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          state[session][i] = Math.min(val + 1, item.target);
          saveAthkarState(state);
          renderAthkar();
          checkSleepyIndicator(state);
        });
      }

      row.appendChild(display);
      row.appendChild(btn);
      card.appendChild(row);
    }

    list.appendChild(card);
  });
}

function checkSleepyIndicator(state) {
  const indicator = document.getElementById('sleepy-indicator');
  if (!indicator) return;
  const h = new Date().getHours();
  const s = state || loadAthkarState();
  indicator.style.display = (h >= 21 && !isSessionComplete('evening', s)) ? 'block' : 'none';
}

function initAthkar() {
  const h = new Date().getHours();
  currentAthkarSession = h >= 15 ? 'evening' : 'morning';

  document.querySelectorAll('.athkar-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentAthkarSession = btn.dataset.session;
      renderAthkar();
    });
  });

  renderAthkar();
  checkSleepyIndicator();
}

// ── Boot ──────────────────────────────────────────────────
function boot() {
  applyTimeBackground();
  buildStars();
  initEntryScreen();
  initIdentityScreen();
  initNav();
  initCharacters();
  initAthkar();
  initWird();
  initShared();
  initSettings();
  updateBarakahMeter();
  checkMilestoneEmoji();

  if (localStorage.getItem('unlocked') === 'true') {
    if (!localStorage.getItem('user')) {
      showScreen('identity-screen');
    } else {
      updateGreeting();
      showScreen('home-screen');
    }
  } else {
    showScreen('entry-screen');
  }
}

// ── Characters ───────────────────────────────────────────
const PHRASES = {
  othman: ['شكو ماكو؟', 'هاي!', 'شلونك؟', 'Pop offff', 'lock in', 'yes gangg'],
  jana:   ['إزيك؟', 'يا سلام!', 'تمام يعني', 'eeeeee', 'ayyyyyy', 'vibesss'],
};

let bubbleTimers = {};

function showBubble(who) {
  const bubble = document.getElementById(`bubble-${who}`);
  const phrases = PHRASES[who];
  bubble.textContent = phrases[Math.floor(Math.random() * phrases.length)];

  clearTimeout(bubbleTimers[who]);
  bubble.classList.remove('visible');
  // Force reflow so re-clicking replays the animation
  void bubble.offsetWidth;
  bubble.classList.add('visible');
  bubbleTimers[who] = setTimeout(() => bubble.classList.remove('visible'), 3000);
}

function flyCresCent(fromEl, toEl) {
  const fromRect = fromEl.getBoundingClientRect();
  const toRect   = toEl.getBoundingClientRect();

  const em = document.createElement('span');
  em.className = 'crescent-fly';
  em.textContent = '🌙';
  em.style.left = `${fromRect.left + fromRect.width / 2}px`;
  em.style.top  = `${fromRect.top  + fromRect.height / 2}px`;
  document.body.appendChild(em);

  const dx = (toRect.left + toRect.width / 2)  - (fromRect.left + fromRect.width / 2);
  const dy = (toRect.top  + toRect.height / 2) - (fromRect.top  + fromRect.height / 2);

  em.animate([
    { transform: 'translate(0,0) scale(1)',   opacity: 1 },
    { transform: `translate(${dx}px,${dy}px) scale(0.6)`, opacity: 0 },
  ], { duration: 900, easing: 'ease-in-out', fill: 'forwards' })
    .finished.then(() => em.remove());

  // Glow the target
  toEl.classList.add('glow-gold');
  setTimeout(() => toEl.classList.remove('glow-gold'), 2000);
}

function initCharacters() {
  const imgOthman = document.getElementById('img-othman');
  const imgJana   = document.getElementById('img-jana');

  imgOthman.addEventListener('click', () => showBubble('othman'));
  imgJana.addEventListener('click',   () => showBubble('jana'));

  document.querySelectorAll('.dua-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fromImg = document.getElementById(`img-${btn.dataset.from}`);
      const toImg   = document.getElementById(`img-${btn.dataset.to}`);
      flyCresCent(fromImg, toImg);
    });
  });
}

// ── Wird state ────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function wirdKey(user) {
  return 'wird_' + (user || 'unknown');
}

function loadWirdState(user) {
  const raw = localStorage.getItem(wirdKey(user));
  if (raw) return JSON.parse(raw);
  return { streak: 0, lastDone: null, note: '' };
}

function saveWirdState(user, state) {
  localStorage.setItem(wirdKey(user), JSON.stringify(state));
}

function isWirdDoneToday(user) {
  return loadWirdState(user).lastDone === todayStr();
}

// ── Confetti ──────────────────────────────────────────────
function launchConfetti() {
  const colors = ['#D4A853', '#F4A7B9', '#B2C9AD', '#C9B8E8', '#FFCBA4', '#e8c87a'];
  for (let i = 0; i < 50; i++) {
    const dot = document.createElement('div');
    dot.className = 'confetti-dot';
    const size = Math.random() * 9 + 4;
    dot.style.cssText = `
      left:${Math.random() * 100}vw;
      top:${Math.random() * 50 + 25}vh;
      width:${size}px; height:${size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay:${(Math.random() * 0.6).toFixed(2)}s;
      animation-duration:${(Math.random() * 0.6 + 1.2).toFixed(2)}s;
    `;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 2200);
  }
}

// ── Milestone emoji ───────────────────────────────────────
function checkMilestoneEmoji() {
  const user = localStorage.getItem('user');
  if (!user) return;
  const who   = user.toLowerCase();
  const state = loadWirdState(user);
  const streak = state.streak;

  // Remove old badge if any
  const old = document.getElementById('milestone-badge-' + who);
  if (old) old.remove();

  let emoji = null;
  if (streak >= 30)     emoji = '👑';
  else if (streak >= 7) emoji = '😇';
  if (!emoji) return;

  const imgEl = document.getElementById('img-' + who);
  if (!imgEl) return;
  const badge = document.createElement('span');
  badge.id = 'milestone-badge-' + who;
  badge.className = 'milestone-badge';
  badge.textContent = emoji;
  imgEl.parentElement.insertBefore(badge, imgEl);
}

// ── Barakah meter ─────────────────────────────────────────
// The bar is split in two halves: left = current user (fills 0→50%),
// right = other person (always empty until Firebase sync is added).
function updateBarakahMeter() {
  const fill       = document.getElementById('barakah-fill');
  const userLbl    = document.getElementById('barakah-user-label');
  const otherLbl   = document.getElementById('barakah-other-label');
  if (!fill) return;

  const user  = localStorage.getItem('user') || '';
  const other = user === 'Othman' ? 'Jana' : user === 'Jana' ? 'Othman' : '';

  // Current user's goal completion
  const athkarState = loadAthkarState();
  const morningDone = ATHKAR.morning.filter((item, i) => isItemDone(item, athkarState.morning[i])).length;
  const eveningDone = ATHKAR.evening.filter((item, i) => isItemDone(item, athkarState.evening[i])).length;
  const wirdDone    = user && isWirdDoneToday(user) ? 1 : 0;

  const total      = ATHKAR.morning.length + ATHKAR.evening.length + 1;
  const done       = morningDone + eveningDone + wirdDone;
  // Map 0→total onto 0→50% of the bar (user's half only)
  const halfPct    = Math.round((done / total) * 50);

  fill.style.width = halfPct + '%';
  fill.classList.remove('glow', 'pulse');
  if (halfPct >= 50) fill.classList.add('glow'); // user's half is full

  // Labels
  if (userLbl)  userLbl.textContent  = user  ? `${user} ✦`         : '';
  if (otherLbl) otherLbl.textContent = other ? `waiting for ${other}` : '';
}

// ── Wird render ───────────────────────────────────────────
function renderWird() {
  const user = localStorage.getItem('user');
  if (!user) return;

  const state  = loadWirdState(user);
  const done   = state.lastDone === todayStr();
  const card   = document.getElementById('wird-card');
  const btn    = document.getElementById('wird-done-btn');
  const noteEl = document.getElementById('wird-note-input');
  const streakEl    = document.getElementById('streak-display');
  const milestoneEl = document.getElementById('streak-milestone');
  if (!card) return;

  // Card state
  card.classList.toggle('done', done);
  btn.textContent  = done ? '✓ Done' : '✓ Mark as Done';
  noteEl.value     = done ? (state.note || '') : (state.note || '');
  noteEl.readOnly  = done;

  // Streak display
  streakEl.textContent = state.streak;
  if (state.streak >= 30)     milestoneEl.textContent = '👑 30-day milestone!';
  else if (state.streak >= 7) milestoneEl.textContent = '😇 7-day milestone!';
  else                        milestoneEl.textContent = '';
}

function markWirdDone() {
  const user = localStorage.getItem('user');
  if (!user) return;

  const state      = loadWirdState(user);
  const today      = todayStr();
  if (state.lastDone === today) return; // already done

  const yesterday  = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const prevStreak = state.streak;

  if (state.lastDone === yesterday) {
    state.streak += 1;
  } else {
    state.streak = 1;
  }

  const noteEl = document.getElementById('wird-note-input');
  state.note    = noteEl ? noteEl.value.trim() : '';
  state.lastDone = today;
  saveWirdState(user, state);

  // Fire confetti on milestone crossing
  const milestones = [7, 30];
  for (const m of milestones) {
    if (prevStreak < m && state.streak >= m) {
      launchConfetti();
      break;
    }
  }

  renderWird();
  checkMilestoneEmoji();
  updateBarakahMeter();
}

function initWird() {
  const btn = document.getElementById('wird-done-btn');
  if (btn) btn.addEventListener('click', markWirdDone);

  // Save note as user types (only when not done)
  const noteEl = document.getElementById('wird-note-input');
  if (noteEl) {
    noteEl.addEventListener('input', () => {
      const user = localStorage.getItem('user');
      if (!user) return;
      const state = loadWirdState(user);
      if (state.lastDone !== todayStr()) {
        state.note = noteEl.value;
        saveWirdState(user, state);
      }
    });
  }
}

// ── Utility ───────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Gratitude Wall ────────────────────────────────────────
const NOTE_COLORS = ['#fff9c4','#fce4ec','#e8f5e9','#e8eaf6','#fff3e0','#f3e5f5','#e0f7fa'];

function loadGratitude() { return JSON.parse(localStorage.getItem('gratitude_entries') || '[]'); }
function saveGratitude(d) { localStorage.setItem('gratitude_entries', JSON.stringify(d)); }

function renderGratitude() {
  const board = document.getElementById('gratitude-board');
  if (!board) return;
  // Prefer live Firestore cache; fall back to localStorage when Firebase hasn't loaded yet
  const entries = window._fbGratitude || loadGratitude();
  board.innerHTML = '';
  if (!entries.length) {
    board.innerHTML = '<p style="color:rgba(255,255,255,0.6);font-size:0.8rem;font-style:italic;padding:0.5rem">Nothing yet — add the first note ✦</p>';
    return;
  }
  entries.slice().reverse().forEach(e => {
    const note = document.createElement('div');
    note.className = 'sticky-note';
    note.style.setProperty('--note-bg', e.color);
    note.style.setProperty('--rot', e.rot + 'deg');
    note.innerHTML = `<p class="note-text">${escapeHtml(e.text)}</p><p class="note-author">— ${escapeHtml(e.user)}</p>`;
    board.appendChild(note);
  });
}

function addGratitude() {
  const input = document.getElementById('gratitude-input');
  const text  = input.value.trim();
  if (!text) return;
  const user  = localStorage.getItem('user') || '?';
  const entry = {
    text, user,
    color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
    rot:   (Math.random() * 7 - 3.5).toFixed(1),
    date:  todayStr(),
  };
  input.value = '';

  if (window.fb) {
    // Write to Firestore — onSnapshot listener will re-render
    window.fb.addDoc('gratitude', { ...entry, createdAt: window.fb.serverTimestamp() });
  } else {
    // Offline fallback: localStorage only
    const entries = loadGratitude();
    entries.push({ id: Date.now(), ...entry });
    saveGratitude(entries);
    renderGratitude();
  }
}

// ── Dua Board ─────────────────────────────────────────────
function loadDuas() { return JSON.parse(localStorage.getItem('dua_entries') || '[]'); }
function saveDuas(d) { localStorage.setItem('dua_entries', JSON.stringify(d)); }

function buildDuaCard(dua) {
  const card = document.createElement('div');
  card.className = 'dua-card' + (dua.answered ? ' answered' : '');
  card.innerHTML = `
    <div class="dua-card-header">
      <p class="dua-title-text">${escapeHtml(dua.title)}</p>
      <span class="dua-date">${dua.date}</span>
    </div>
    <p class="dua-body-text">${escapeHtml(dua.body)}</p>
    ${dua.answered
      ? '<p class="dua-answered-label">✨ Answered by Allah</p>'
      : `<button class="dua-answer-btn" data-id="${dua.id}">✨ Mark as Answered</button>`}
  `;
  if (!dua.answered) {
    card.querySelector('.dua-answer-btn').addEventListener('click', () => {
      if (window.fb && dua._id) {
        // Firestore path — onSnapshot re-renders
        window.fb.updateDoc('duas', dua._id, { answered: true });
      } else {
        // localStorage fallback
        const duas = loadDuas();
        const item = duas.find(d => d.id === dua.id);
        if (item) { item.answered = true; saveDuas(duas); renderDuas(); }
      }
    });
  }
  return card;
}

function renderDuas() {
  const activeList    = document.getElementById('dua-active-list');
  const answeredList  = document.getElementById('dua-answered-list');
  const answeredSec   = document.getElementById('dua-answered-section');
  if (!activeList) return;
  const duas     = window._fbDuas || loadDuas();
  const active   = duas.filter(d => !d.answered);
  const answered = duas.filter(d => d.answered);
  activeList.innerHTML   = '';
  answeredList.innerHTML = '';
  if (!active.length && !answered.length) {
    activeList.innerHTML = '<p style="color:rgba(90,62,43,0.5);font-size:0.8rem;font-style:italic">No duas yet — add your first one 🤲</p>';
  }
  active.forEach(d  => activeList.appendChild(buildDuaCard(d)));
  answered.forEach(d => answeredList.appendChild(buildDuaCard(d)));
  answeredSec.style.display = answered.length ? 'block' : 'none';
}

function addDua() {
  const titleEl = document.getElementById('dua-title-input');
  const bodyEl  = document.getElementById('dua-body-input');
  const title   = titleEl.value.trim();
  const body    = bodyEl.value.trim();
  if (!title && !body) return;
  const entry = { title: title || 'Untitled', body, answered: false, date: todayStr() };
  titleEl.value = '';
  bodyEl.value  = '';

  if (window.fb) {
    window.fb.addDoc('duas', { ...entry, createdAt: window.fb.serverTimestamp() });
  } else {
    const duas = loadDuas();
    duas.push({ id: Date.now(), ...entry });
    saveDuas(duas);
    renderDuas();
  }
}

// ── Memory Jar ────────────────────────────────────────────
function loadMemories() { return JSON.parse(localStorage.getItem('memory_entries') || '[]'); }
function saveMemories(d) { localStorage.setItem('memory_entries', JSON.stringify(d)); }

function renderMemoryJar() {
  const list    = document.getElementById('memory-list');
  const fillEl  = document.getElementById('jar-fill');
  const countEl = document.getElementById('jar-count');
  if (!list) return;
  const memories = window._fbMemories || loadMemories();
  const pct = Math.min((memories.length / 20) * 100, 100);
  fillEl.style.height  = pct + '%';
  countEl.textContent  = memories.length + (memories.length === 1 ? ' memory' : ' memories');
  list.innerHTML = '';
  if (!memories.length) {
    list.innerHTML = '<p style="color:rgba(90,62,43,0.45);font-size:0.8rem;font-style:italic;text-align:center">Your jar is empty — start adding memories 🫙</p>';
    return;
  }
  memories.slice().reverse().forEach(m => {
    const item = document.createElement('div');
    item.className = 'memory-item';
    item.innerHTML = `<p class="memory-text">${escapeHtml(m.text)}</p><p class="memory-meta">${escapeHtml(m.user)} · ${m.date}</p>`;
    list.appendChild(item);
  });
}

function addMemory() {
  const input = document.getElementById('memory-input');
  const text  = input.value.trim();
  if (!text) return;
  const user  = localStorage.getItem('user') || '?';
  const entry = { text, user, date: todayStr() };
  input.value = '';

  if (window.fb) {
    window.fb.addDoc('memories', { ...entry, createdAt: window.fb.serverTimestamp() });
  } else {
    const memories = loadMemories();
    memories.push({ id: Date.now(), ...entry });
    saveMemories(memories);
    renderMemoryJar();
  }
}

function checkMemoryReveal() {
  const now = new Date();
  if (now.getMonth() === 5 && now.getDate() === 27) triggerMemoryReveal();
}

function triggerMemoryReveal() {
  if (document.querySelector('.memory-reveal-overlay')) return; // already showing
  const memories = window._fbMemories || loadMemories();
  if (!memories.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'memory-reveal-overlay';
  overlay.innerHTML = `
    <div class="memory-reveal-box">
      <p class="reveal-title">🎊 Happy Anniversary 🎊</p>
      <p class="reveal-sub">A year of beautiful moments between you two ✦</p>
      <div class="reveal-cards" id="reveal-cards"></div>
      <button class="reveal-close-btn" id="reveal-close-btn">Close ✕</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const container = overlay.querySelector('#reveal-cards');
  memories.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = 'reveal-card';
    card.style.animationDelay = `${i * 0.12}s`;
    card.innerHTML = `<p>${escapeHtml(m.text)}</p><small>${escapeHtml(m.user)} · ${m.date}</small>`;
    container.appendChild(card);
  });

  overlay.querySelector('#reveal-close-btn').addEventListener('click', () => overlay.remove());
  launchConfetti();
}

// ── Shared init ───────────────────────────────────────────
function initShared() {
  // Sub-tab switching
  document.querySelectorAll('.sub-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('sub-' + tab.dataset.sub);
      if (panel) panel.classList.add('active');
      if (tab.dataset.sub === 'gratitude') renderGratitude();
      if (tab.dataset.sub === 'dua')       renderDuas();
      if (tab.dataset.sub === 'memory')    { renderMemoryJar(); checkMemoryReveal(); }
    });
  });

  // Gratitude
  const gBtn   = document.getElementById('gratitude-add-btn');
  const gInput = document.getElementById('gratitude-input');
  if (gBtn)   gBtn.addEventListener('click', addGratitude);
  if (gInput) gInput.addEventListener('keydown', e => { if (e.key === 'Enter') addGratitude(); });

  // Dua
  const dBtn = document.getElementById('dua-add-btn');
  if (dBtn) dBtn.addEventListener('click', addDua);

  // Memory
  const mBtn   = document.getElementById('memory-add-btn');
  const mInput = document.getElementById('memory-input');
  if (mBtn)   mBtn.addEventListener('click', addMemory);
  if (mInput) mInput.addEventListener('keydown', e => { if (e.key === 'Enter') addMemory(); });
}

// ── Settings ──────────────────────────────────────────────
function renderSettings() {
  const user = localStorage.getItem('user') || '';
  const el   = document.getElementById('settings-current-user');
  if (el) el.textContent = user ? `Signed in as ${user}` : '';

  document.querySelectorAll('.settings-id-btn').forEach(btn => {
    btn.classList.toggle('active-identity', btn.dataset.name === user);
  });
}

function initSettings() {
  // Identity switching
  document.querySelectorAll('.settings-id-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('user', btn.dataset.name);
      updateGreeting();
      renderSettings();
      checkMilestoneEmoji();
      renderWird();
      updateBarakahMeter();
    });
  });

  // Reset flow
  const resetBtn     = document.getElementById('reset-btn');
  const modal        = document.getElementById('reset-modal');
  const cancelBtn    = document.getElementById('reset-cancel');
  const confirmBtn   = document.getElementById('reset-confirm');

  if (resetBtn)   resetBtn.addEventListener('click',   () => { modal.style.display = 'flex'; });
  if (cancelBtn)  cancelBtn.addEventListener('click',  () => { modal.style.display = 'none'; });
  if (confirmBtn) confirmBtn.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
  });
  if (modal) modal.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });
}

document.addEventListener('DOMContentLoaded', boot);
