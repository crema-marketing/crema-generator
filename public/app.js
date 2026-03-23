
// ============================================================
// STATE
// ============================================================
let cat = null;
let formVals = {};
let genMode = 'outline';
let chatHistory = [];
let currentText = '';
let busy = false;
let currentView = 'cat'; // 'cat' | 'form' | 'gen'

// ============================================================
// SYSTEM PROMPT
// ============================================================
// ============================================================
// CATEGORY CONFIG
// ============================================================
const CAT_CFG = {
  A:{ label:'고객사 성공 사례', icon:'forum', sub:'브랜드 성장 스토리를 담을 정보를 입력해주세요' },
  B:{ label:'크리마 서비스', icon:'auto_awesome', sub:'소개할 기능의 정보를 입력해주세요' },
  C:{ label:'서비스 활용팁', icon:'tips_and_updates', sub:'크리마 서비스 기능 활용 팁을 위한 정보를 입력해주세요' },
  D:{ label:'크리마 연구소', icon:'analytics', sub:'데이터 기반 인사이트 아티클 정보를 입력해주세요' },
  E:{ label:'크리마 인터뷰', icon:'person', sub:'인터뷰이 정보를 입력해주세요' },
  F:{ label:'크리마 뉴스', icon:'newspaper', sub:'이달의 소식을 입력해주세요' },
  G:{ label:'릴리즈 노트', icon:'rocket_launch', sub:'업데이트 내용을 입력해주세요' },
  I:{ label:'이커머스 인사이트', icon:'trending_up', sub:'이커머스 트렌드/인사이트 아티클 정보를 입력해주세요' },
  FREE:{ label:'자유 양식', icon:'draw', sub:'형식에 구애받지 않고 자유롭게 콘텐츠 재료를 입력해주세요' },
};

// ============================================================
// FORM FIELDS (공통 필드: docLink는 모든 카테고리 하단에 자동 추가)
// ============================================================
const FIELDS = {
  A:[
    {id:'brand',label:'브랜드명',type:'text',ph:'예) 아로마티카',req:true},
    {id:'transcript',label:'인터뷰 녹취록 또는 Q&A 원문',type:'ta',ph:'인터뷰 내용을 붙여넣어 주세요.\n없으면 브랜드에 대해 알고 있는 내용을 입력해 주세요.',req:true,rows:9},
    {id:'fmt',label:'콘텐츠 형식',type:'sel',opts:['스토리텔링 (에디터 내러티브)','Q&A (질문-답변 형식)'],req:true},
    {id:'products',label:'도입한 크리마 솔루션',type:'chk',opts:['크리마 리뷰','크리마 핏','크리마 인사이트','크리마 상품추천']},
    {id:'kw',label:'SEO 핵심 키워드',type:'textseo',ph:'예) 자사몰 CRM 전략, 고객 커뮤니티'},
  ],
  B:[
    {id:'fname',label:'기능명',type:'text',ph:'예) AI 리뷰 요약',req:true},
    {id:'fdesc',label:'기능 설명 및 주요 내용',type:'ta',ph:'기능의 작동 방식, 노출 위치, 설정 경로 등을 설명해 주세요.',req:true,rows:6},
    {id:'benefit',label:'고객이 얻는 핵심 효과',type:'text',ph:'예) 리뷰 읽는 시간 절약, 구매 전환율 향상'},
    {id:'products',label:'해당 크리마 솔루션',type:'chk',opts:['크리마 리뷰','크리마 핏','크리마 인사이트','크리마 상품추천']},
    {id:'kw',label:'SEO 핵심 키워드',type:'textseo',ph:'예) AI 리뷰 요약, 쇼핑몰 리뷰 관리'},
  ],
  C:[
    {id:'topic',label:'아티클 주제',type:'text',ph:'예) 크리마 리뷰 AI 분석 기능 활용법',req:true},
    {id:'feature',label:'소개할 크리마 기능 또는 서비스',type:'text',ph:'예) 리뷰 AI 요약, 리뷰 노출 설정',req:true},
    {id:'products',label:'해당 크리마 솔루션',type:'chk',opts:['크리마 리뷰','크리마 핏','크리마 인사이트','크리마 상품추천']},
    {id:'kw',label:'SEO 핵심 키워드',type:'textseo',ph:'예) 크리마 리뷰 활용법, AI 리뷰 분석'},
    {id:'extra',label:'포함할 사례 또는 참고 자료',type:'ta',ph:'고객사 사례, 데이터 등을 입력해 주세요.',rows:4},
  ],
  D:[
    {id:'topic',label:'아티클 주제',type:'text',ph:'예) 이커머스 리뷰 데이터로 보는 소비 트렌드',req:true},
    {id:'angle',label:'주요 관점 또는 논지',type:'ta',ph:'이 글에서 가장 강조하고 싶은 인사이트나 방향을 설명해 주세요.',req:true,rows:4},
    {id:'products',label:'해당 크리마 솔루션',type:'chk',opts:['크리마 리뷰','크리마 핏','크리마 인사이트','크리마 상품추천']},
    {id:'kw',label:'SEO 핵심 키워드',type:'textseo',ph:'예) 이커머스 리뷰 트렌드, 소비자 구매 패턴'},
    {id:'data',label:'포함할 데이터 또는 수치',type:'ta',ph:'크리마 보유 통계, 연구 결과, 사례 수치 등을 입력해 주세요.',rows:4},
  ],
  E:[
    {id:'name',label:'인터뷰이 이름',type:'text',ph:'예) 김지수',req:true},
    {id:'role',label:'직무 및 팀',type:'text',ph:'예) 그로스 마케팅팀 마케터',req:true},
    {id:'transcript',label:'인터뷰 녹취록 또는 주요 내용',type:'ta',ph:'Q&A 형식의 인터뷰 내용을 붙여넣어 주세요.',req:true,rows:8},
    {id:'hl',label:'가장 부각시키고 싶은 포인트',type:'text',ph:'예) 비개발자 배경에서 그로스 마케터로의 성장'},
  ],
  F:[
    {id:'ym',label:'연/월',type:'text',ph:'예) 2025년 3월',req:true},
    {id:'clients',label:'신규 고객사 목록',type:'ta',ph:'브랜드명, 업종, 자사몰 URL을 한 줄씩\n예) 아로마티카, 뷰티, https://aromatica.co.kr',req:true,rows:6},
    {id:'events',label:'이달의 내부 소식',type:'ta',ph:'세미나, 행사 등 특별한 소식이 있으면 입력해 주세요.',rows:3},
  ],
  G:[
    {id:'ym',label:'연/월',type:'text',ph:'예) 2025년 3월',req:true},
    {id:'updates',label:'업데이트 기능 목록',type:'ta',ph:'예)\n[크리마 리뷰] AI 리뷰 요약 — 상품 상세 페이지 위젯 추가\n[크리마 핏] 사이즈 필터 개선 — 체형 기반 필터 추가',req:true,rows:8},
    {id:'products',label:'해당 크리마 솔루션',type:'chk',opts:['크리마 리뷰','크리마 핏','크리마 인사이트','크리마 상품추천']},
    {id:'setting',label:'설정 경로 안내',type:'ta',ph:'관리자 페이지 설정 방법을 알고 있다면 입력해 주세요.',rows:4},
  ],
  I:[
    {id:'topic',label:'아티클 주제',type:'text',ph:'예) 2025 이커머스 리뷰 트렌드 분석',req:true},
    {id:'angle',label:'주요 관점 또는 논지',type:'ta',ph:'이 글에서 다루고 싶은 인사이트나 방향을 설명해 주세요.',req:true,rows:4},
    {id:'kw',label:'SEO 핵심 키워드',type:'textseo',ph:'예) 이커머스 트렌드, 자사몰 성장 전략'},
    {id:'data',label:'포함할 데이터 또는 사례',type:'ta',ph:'업계 통계, 사례, 수치 등이 있으면 입력해 주세요.',rows:4},
  ],
  FREE:[
    {id:'topic',label:'콘텐츠 주제 또는 제목 (안)',type:'text',ph:'예) 크리마 × OO 파트너십 발표, 여름 시즌 프로모션 안내',req:true},
    {id:'purpose',label:'이 콘텐츠의 목적',type:'text',ph:'예) 신규 제휴 서비스 소개, 프로모션 참여 유도, 이벤트 안내'},
    {id:'target',label:'타깃 독자',type:'text',ph:'예) 자사몰 운영자, 크리마 기존 고객사, 이커머스 마케터'},
    {id:'content',label:'담고 싶은 주요 내용',type:'ta',ph:'핵심 메시지, 포함할 정보, 전달하고 싶은 포인트를 자유롭게 적어주세요.',req:true,rows:8},
    {id:'kw',label:'SEO 핵심 키워드',type:'textseo',ph:'예) 이커머스 프로모션, 자사몰 마케팅'},
  ],
};

// ============================================================
// VIEW MANAGEMENT
// ============================================================
function show(v) {
  ['cat','form','gen','var'].forEach(id => {
    document.getElementById('view-'+id).classList.toggle('hidden', id!==v);
  });
  currentView = v;
  const pb = document.getElementById('progress-bar');
  if(pb) pb.style.display = (v==='var') ? 'none' : '';
  updateSteps(v);
  window.scrollTo({top:0,behavior:'smooth'});
}

function updateSteps(v) {
  const active = v==='cat'?1 : v==='form'?2 : v==='gen'?(genMode==='outline'?3:4) : 4;
  const labels = ['카테고리 선택','콘텐츠 재료 입력','개요 생성','초안 생성'];
  for (let i=1; i<=4; i++) {
    const n = document.getElementById('s'+i+'n');
    const s = document.getElementById('s'+i);
    const l = document.getElementById('s'+i+'l');
    if (!n) continue;
    l.textContent = labels[i-1];
    if (i < active) {
      s.className = 'step-btn flex items-center gap-2.5 px-4 py-2 rounded-full';
      n.className = 'w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold';
      n.textContent = '✓';
      l.className = 'font-medium text-sm text-on-surface-variant';
    } else if (i===active) {
      s.className = 'step-btn flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/8 border border-primary/20';
      n.className = 'w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold';
      n.textContent = i;
      l.className = 'font-bold text-sm text-primary';
    } else {
      s.className = 'step-btn flex items-center gap-2.5 px-4 py-2 rounded-full opacity-35';
      n.className = 'w-5 h-5 rounded-full bg-slate-300 text-white flex items-center justify-center text-xs font-bold';
      n.textContent = i;
      l.className = 'font-medium text-sm text-on-surface';
    }
  }
}

// ============================================================
// PROGRESS BAR CLICK NAVIGATION
// ============================================================
function clickStep(n) {
  const active = currentView==='cat'?1 : currentView==='form'?2 : currentView==='gen'?(genMode==='outline'?3:4) : 4;
  if (n >= active) return;
  if (n===1) { tryGoBack('cat'); return; }
  if (n===2) { tryGoBack('form'); return; }
  if (n===3 || n===4) { show('gen'); return; }
}

// 헤더에서 채널 베리에이션으로 바로 진입
function goToVariationHome() {
  const ta = document.getElementById('var-input');
  const source = currentText || document.getElementById('content-display')?.innerText || '';
  if(ta && source.trim()) {
    ta.value = source.trim().replace(/\\n/g, '\n');
  }
  activeVarTab = 'home';
  varTexts = { home:'', naver:'', brunch:'', cafe24:'' };
  varBusy = { naver:false, brunch:false, cafe24:false };
  ['naver','brunch','cafe24'].forEach(ch => {
    document.getElementById('vtab-badge-'+ch)?.classList.add('hidden');
    document.getElementById('vtab-loading-'+ch)?.classList.add('hidden');
    const el = document.getElementById('vtab-'+ch+'-content');
    if(el) el.innerHTML = `<div class="flex flex-col items-center justify-center h-64 text-on-surface-variant gap-3">
      <span class="material-symbols-outlined text-4xl opacity-30">${ch==='naver'?'article':ch==='brunch'?'edit_note':'storefront'}</span>
      <p class="text-sm">탭이 활성화되면 자동으로 변환이 시작돼요</p></div>`;
  });
  _setActiveTab('home');
  show('var');
}

// Back with alert if form has data
function hasFormData() {
  return Object.values(formVals).some(v => {
    if (Array.isArray(v)) return v.length > 0;
    return v && v.toString().trim().length > 0;
  });
}

function tryGoBack(dest) {
  if (dest==='cat' && currentView==='form' && hasFormData()) {
    if (!confirm('입력한 내용이 초기화됩니다.\n카테고리 선택 화면으로 돌아가시겠습니까?')) return;
    formVals = {};
    cat = null;
  }
  if (dest==='cat') { show('cat'); return; }
  if (dest==='form') { show('form'); return; }
}

// ============================================================
// CATEGORY SELECT
// ============================================================
function selectCat(id) {
  if (id==='LAB') { document.getElementById('modal-lab').classList.remove('hidden'); return; }
  if (id==='SVC') { document.getElementById('modal-svc').classList.remove('hidden'); return; }
  cat = id;
  formVals = {};
  renderForm();
  show('form');
}
function closeLab() { document.getElementById('modal-lab').classList.add('hidden'); }
function pickLab(id) { closeLab(); selectCat(id); }
function closeSvc() { document.getElementById('modal-svc').classList.add('hidden'); }
function pickSvc(id) { closeSvc(); selectCat(id); }
function resetAll() {
  cat=null; formVals={}; chatHistory=[]; currentText=''; genMode='outline'; busy=false; show('cat');
}

// ============================================================
// FORM RENDERING
// ============================================================
function renderForm() {
  const cfg = CAT_CFG[cat]||CAT_CFG.D;
  const flds = [...(FIELDS[cat]||FIELDS.D)];
  // Append doc link field to all categories
  flds.push({id:'doclink',label:'참고 문서 링크',type:'url',ph:'https://... 제너레이터가 초안 작성 시 참고합니다.'});
  document.getElementById('form-icon').textContent = cfg.icon;
  document.getElementById('form-title').textContent = cfg.label;
  document.getElementById('form-subtitle').textContent = cfg.sub;
  const container = document.getElementById('form-fields');
  container.innerHTML = '';
  flds.forEach(f => {
    const wrap = document.createElement('div');
    const reqMark = f.req ? '<span class="text-primary ml-1">*</span>' : '';
    const lbl = `<label class="block text-sm font-semibold text-on-surface mb-2.5">${f.label}${reqMark}</label>`;
    let inp = '';
    if (f.type==='text'||f.type==='url') {
      inp = `<input type="${f.type==='url'?'url':'text'}" id="ff-${f.id}" placeholder="${escH(f.ph||'')}" class="form-input" value="${escH(formVals[f.id]||'')}">`;
    } else if (f.type==='ta') {
      inp = `<textarea id="ff-${f.id}" placeholder="${escH(f.ph||'')}" class="form-input" rows="${f.rows||5}">${escH(formVals[f.id]||'')}</textarea>`;
    } else if (f.type==='textseo') {
      // SEO field with AI recommend button
      inp = `<div class="flex gap-2 items-start">
        <input type="text" id="ff-${f.id}" placeholder="${escH(f.ph||'')}" class="form-input flex-1" value="${escH(formVals[f.id]||'')}">
        <button type="button" id="seo-btn-${f.id}" class="ai-btn mt-0 flex-shrink-0" onclick="recommendSEO('${f.id}')" style="height:49px">
          <span class="material-symbols-outlined text-xs" style="font-size:14px">auto_awesome</span>
          AI 추천
        </button>
      </div>`;
    } else if (f.type==='sel') {
      const opts = ['<option value="">선택해 주세요</option>',...f.opts.map(o=>`<option value="${escH(o)}"${formVals[f.id]===o?' selected':''}>${escH(o)}</option>`)].join('');
      inp = `<select id="ff-${f.id}" class="form-input">${opts}</select>`;
    } else if (f.type==='chk') {
      const sel = formVals[f.id]||[];
      inp = `<div class="flex flex-wrap gap-2.5" id="ff-${f.id}">${
        f.opts.map(o=>{
          const on=sel.includes(o);
          return `<label class="flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer border text-sm font-medium select-none transition-all ${on?'bg-primary/10 border-primary/30 text-primary':'bg-white border-outline-variant text-on-surface-variant hover:border-primary/30'}">
            <input type="checkbox" class="hidden" value="${escH(o)}" ${on?'checked':''} onchange="chkToggle('${f.id}','${escH(o)}',this)">${escH(o)}</label>`;
        }).join('')
      }</div>`;
    }
    wrap.innerHTML = lbl+inp;
    if (f.type!=='chk'&&f.type!=='textseo') {
      const el = wrap.querySelector('input,textarea,select');
      if (el) el.addEventListener('input',()=>{formVals[f.id]=el.value;});
    } else if (f.type==='textseo') {
      const el = wrap.querySelector(`#ff-${f.id}`);
      if (el) el.addEventListener('input',()=>{formVals[f.id]=el.value;});
    }
    container.appendChild(wrap);
  });
}

function chkToggle(fid,opt,cb) {
  formVals[fid]=formVals[fid]||[];
  if (cb.checked){if(!formVals[fid].includes(opt))formVals[fid].push(opt);}
  else{formVals[fid]=formVals[fid].filter(v=>v!==opt);}
  cb.closest('label').className=`flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer border text-sm font-medium select-none transition-all ${cb.checked?'bg-primary/10 border-primary/30 text-primary':'bg-white border-outline-variant text-on-surface-variant hover:border-primary/30'}`;
}

// ============================================================
// SEO AI RECOMMEND
// ============================================================
async function recommendSEO(fid) {
  collectForm();
  const btn = document.getElementById('seo-btn-'+fid);
  const input = document.getElementById('ff-'+fid);
  if (!btn||!input) return;
  btn.disabled = true;
  btn.innerHTML = '<span class="dot-bounce" style="width:5px;height:5px"></span><span class="dot-bounce" style="width:5px;height:5px;animation-delay:.2s"></span><span class="dot-bounce" style="width:5px;height:5px;animation-delay:.4s"></span>';
  const ctx = buildCtx();
  try {
    const res = await fetch('/api/seo',{
      method:'POST',
      body:JSON.stringify({ context: ctx }),
    });
    const data = await res.json();
    const text = data.keywords || '';
    input.value = text;
    formVals[fid] = text;
  } catch(e) { alert('SEO 키워드 추천 중 오류가 발생했어요. 다시 시도해 주세요.'); }
  btn.disabled = false;
  btn.innerHTML = '<span class="material-symbols-outlined text-xs" style="font-size:14px">auto_awesome</span> AI 추천';
}

// ============================================================
// FORM SUBMIT
// ============================================================
function collectForm() {
  const flds = [...(FIELDS[cat]||[]),{id:'doclink',type:'url'}];
  flds.forEach(f=>{
    if (f.type==='chk') return;
    const el = document.getElementById('ff-'+f.id);
    if (el) formVals[f.id]=el.value;
  });
}

function buildCtx() {
  const cfg = CAT_CFG[cat]||CAT_CFG.D;
  const flds = [...(FIELDS[cat]||FIELDS.D),{id:'doclink',label:'참고 문서 링크'}];
  let s=`카테고리: ${cfg.label} (${cat})\n\n`;
  flds.forEach(f=>{
    const v=formVals[f.id];
    if (!v) return;
    const disp=Array.isArray(v)?v.join(', '):v;
    if (disp.trim()) s+=`${f.label||f.id}: ${disp}\n\n`;
  });
  return s;
}

function submitFormDirect() {
  collectForm();
  const flds = FIELDS[cat]||[];
  const missing = flds.filter(f=>f.req&&!formVals[f.id]?.toString().trim());
  if (missing.length) { alert('필수 항목을 입력해 주세요:\n'+missing.map(f=>f.label).join('\n')); return; }
  genMode='full'; chatHistory=[]; currentText='';
  resetChatUI(true);
  show('gen');
  refreshGenUI();
  generate();
}

function submitForm() {
  collectForm();
  const flds = FIELDS[cat]||[];
  const missing = flds.filter(f=>f.req&&!formVals[f.id]?.toString().trim());
  if (missing.length) { alert('필수 항목을 입력해 주세요:\n'+missing.map(f=>f.label).join('\n')); return; }
  genMode='outline'; chatHistory=[]; currentText='';
  resetChatUI();
  show('gen');
  refreshGenUI();
  generate();
}

// ============================================================
// GENERATION
// ============================================================
function refreshGenUI() {
  const isOut = genMode==='outline';
  document.getElementById('gen-title').textContent = isOut?'콘텐츠 개요 검토하기':'완성된 초안 확인하기';
  const nb=document.getElementById('next-btn');
  nb.innerHTML=isOut?'본문 생성하기 <span class="material-symbols-outlined text-sm" style="vertical-align:middle">arrow_forward</span>':'✓ 초안 완성';
  nb.disabled=true;
  // 베리에이션 버튼: full 모드 시작 즉시 노출, outline 모드엔 숨김
  const vb = document.getElementById('var-goto-btn');
  if(vb) { if(isOut) vb.classList.add('hidden'); else vb.classList.remove('hidden'); }
  updateSteps('gen');
}

async function generate() {
  if (busy) return;
  busy=true;
  const disp=document.getElementById('content-display');
  const loader=document.getElementById('content-loader');
  disp.innerHTML='';
  loader.classList.remove('hidden');
  document.getElementById('loader-msg').textContent = genMode==='outline'?'개요를 작성하고 있어요...':'초안을 작성하고 있어요. 잠시만 기다려 주세요...';
  document.getElementById('next-btn').disabled=true;

  const ctx=buildCtx();
  const docLink=formVals['doclink'];
  const docNote=docLink?`\n\n참고 문서: ${docLink} (작성 시 이 링크의 내용을 참고해주세요)`:'';
  let userMsg;

  if (genMode==='outline') {
    userMsg=`다음 정보로 크리마 블로그 아티클 개요를 간결하게 작성해줘.

${ctx}${docNote}

형식:
제목(안):
핵심 키워드:
소구 포인트:
---
[인트로] 방향: (1문장)
[섹션1] 소제목: / 내용: (1~2문장)
[섹션2] 소제목: / 내용: (1~2문장)
[섹션3] 소제목: / 내용: (1~2문장)
[아웃트로] 방향: (1문장)
[메타 디스크립션]: (80자 이내)`;
  } else {
    const prev = currentText || (chatHistory.filter(m=>m.role==='assistant').pop()?.content) || '';
    userMsg=`다음 재료와 개요를 바탕으로 크리마 블로그 초안을 작성해줘.

## 원본 재료
${ctx}${docNote}

## 개요
${prev}

규칙:
- 카테고리 ${cat} 프레임워크 적용
- 해요체 80%+, 금칙어 없이, 문단 3~4문장
- 이미지 자리({{img:설명}}), 팁박스, 설정경로는 꼭 필요한 곳에만 간결하게
- 마지막 줄에 [메타 디스크립션] 한 줄 (80자 이내)
- 군더더기 없이 핵심만. 총 2500자 내외로 작성해줘.`;
  }

  // Always use a fresh single-message array — no accumulated history bloat
  const msgs = [{role:'user', content:userMsg}];
  if (genMode==='outline') chatHistory = [{role:'user', content:userMsg}];

  try {
    const res=await fetch('/api/generate',{
      method:'POST',
      body:JSON.stringify({
        max_tokens: genMode==='outline' ? 1200 : 3500,
        messages: msgs,
        stream:true,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API 오류 ${res.status}: ${errText}`);
    }
    loader.classList.add('hidden');

    const reader=res.body.getReader();
    const dec=new TextDecoder();
    let full='';
    let buf='';
    let renderPending=false;
    let firstChunk=true;

    // Throttled render: update DOM at most every 120ms
    const scheduleRender=()=>{
      if(renderPending) return;
      renderPending=true;
      setTimeout(()=>{
        renderPending=false;
        disp.innerHTML=mdRender(full);
        const box=document.getElementById('content-box');
        box.scrollTop=box.scrollHeight;
      },120);
    };

    while(true){
      const{done,value}=await reader.read();
      if(done) break;
      buf += dec.decode(value,{stream:true});
      const lines=buf.split('\n');
      buf=lines.pop();
      for(const line of lines){
        if(!line.startsWith('data: ')) continue;
        const raw=line.slice(6).trim();
        if(raw==='[DONE]') continue;
        try{
          const d=JSON.parse(raw);
          if(d.type==='content_block_delta'&&d.delta?.text){
            full+=d.delta.text;
            // On first chunk: hide loader, enable next-btn for outline so user can proceed anytime
            if(firstChunk){
              firstChunk=false;
              loader.classList.add('hidden');
              if(genMode==='outline'){
                const nb=document.getElementById('next-btn');
                nb.disabled=false;
                nb.innerHTML='본문 생성하기 <span class="material-symbols-outlined text-sm" style="vertical-align:middle">arrow_forward</span>';
              }
            }
            scheduleRender();
          }
          if(d.type==='message_delta'&&d.delta?.stop_reason==='max_tokens'){
            full+='\n\n*(개요가 중간에 잘렸어요. 채팅으로 "이어서 써줘"라고 요청하거나 지금 바로 본문 생성하기를 눌러도 돼요.)*';
          }
        }catch{}
      }
    }
    // Final render (flush remaining)
    disp.innerHTML=mdRender(full);
    currentText=full;
    if(genMode==='outline') chatHistory.push({role:'assistant',content:full});

  }catch(e){
    loader.classList.add('hidden');
    // Still show whatever was generated + error note
    if(currentText) disp.innerHTML=mdRender(currentText);
    const errDiv=document.createElement('div');
    errDiv.className='mt-4 p-4 bg-amber-50 rounded-xl text-amber-700 text-sm';
    errDiv.innerHTML=`⚠️ 생성이 중단됐어요 (${escH(e.message)})<br>지금까지 작성된 내용으로 본문 생성하기를 눌러도 되고, 채팅으로 "이어서 써줘"라고 요청해도 돼요.`;
    disp.appendChild(errDiv);
    // Enable next-btn anyway so user can proceed with partial outline
    if(genMode==='outline'){
      const nb=document.getElementById('next-btn');
      nb.disabled=false;
      nb.innerHTML='본문 생성하기 <span class="material-symbols-outlined text-sm" style="vertical-align:middle">arrow_forward</span>';
    }
    if(genMode==='outline') chatHistory.pop();
  } finally {
    loader.classList.add('hidden');
    busy=false;
  }
}

function handleNext() {
  if (genMode==='outline'){
    // Capture whatever outline text exists so far (even if still streaming)
    const snap = document.getElementById('content-display').innerText;
    if(snap.trim()) currentText = snap;
    // Stop any ongoing generation cleanly
    busy=false;
    genMode='full';
    chatHistory=[];
    refreshGenUI();
    resetChatUI(true);
    generate();
  }
}

// ============================================================
// CHAT
// ============================================================
let chatOpen = false;
function toggleChat() {
  chatOpen = !chatOpen;
  const panel = document.getElementById('chat-panel');
  const btn = document.getElementById('chat-toggle-btn');
  const label = document.getElementById('chat-toggle-label');
  if (chatOpen) {
    panel.classList.remove('hidden');
    panel.classList.add('flex');
    btn.classList.add('bg-primary/10','border-primary/30','text-primary');
    btn.classList.remove('text-on-surface-variant');
    label.textContent = '에디터 닫기';
  } else {
    panel.classList.add('hidden');
    panel.classList.remove('flex');
    btn.classList.remove('bg-primary/10','border-primary/30','text-primary');
    btn.classList.add('text-on-surface-variant');
    label.textContent = 'AI 에디터';
  }
}

function resetChatUI(isFull) {
  document.getElementById('chat-msgs').innerHTML=`
    <div class="flex gap-2 fade-up">
      <div class="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold">C</div>
      <div class="chat-ai px-4 py-3 text-sm max-w-[87%]">
        <p>${isFull?'초안이 완성되면 특정 섹션 수정이나 문체 조정을 요청해 주세요 😊':'개요가 완성되면 수정하고 싶은 부분을 자유롭게 말씀해 주세요 😊'}</p>
        <p class="mt-2 text-xs text-on-surface-variant">예) "${isFull?'아웃트로 톤을 더 가볍게 해주세요':'섹션 2를 CRM 중심으로 바꿔주세요'}"</p>
      </div>
    </div>`;
}

async function sendChat() {
  const input=document.getElementById('chat-input');
  const msg=input.value.trim();
  if(!msg||busy) return;
  input.value=''; input.style.height='44px';
  addChatMsg('user', msg);
  busy=true;
  document.getElementById('chat-send').disabled=true;

  // Step 1: Generate revised full content → stream directly to left panel
  const revisionPrompt = `다음은 현재 작성된 콘텐츠야:\n\n${currentText}\n\n수정 요청: ${msg}\n\n위 콘텐츠를 수정 요청에 맞게 고쳐서 전체 내용을 다시 출력해줘. 형식과 구조는 그대로 유지하고, 수정된 부분만 반영해. 마크다운 형식 그대로.`;

  const tid='t'+Date.now();
  addTyping(tid);

  try {
    const res = await fetch('/api/generate', {
      method:'POST',
      body: JSON.stringify({
        max_tokens: 3500,
        messages: [{role:'user', content: revisionPrompt}],
        stream: true,
      }),
    });
    if(!res.ok) throw new Error('API 오류 '+res.status);

    document.getElementById(tid)?.remove();

    // Show "수정 중" indicator on left panel
    const disp = document.getElementById('content-display');
    const box = document.getElementById('content-box');
    disp.style.opacity = '0.4';

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let revised = '';
    let buf = '';
    let renderPending = false;

    const scheduleRender = () => {
      if(renderPending) return;
      renderPending = true;
      setTimeout(() => {
        renderPending = false;
        disp.innerHTML = mdRender(revised);
        box.scrollTop = 0;
      }, 120);
    };

    while(true){
      const {done, value} = await reader.read();
      if(done) break;
      buf += dec.decode(value, {stream:true});
      const lines = buf.split('\n');
      buf = lines.pop();
      for(const line of lines){
        if(!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if(raw==='[DONE]') continue;
        try{
          const d = JSON.parse(raw);
          if(d.type==='content_block_delta' && d.delta?.text){
            revised += d.delta.text;
            if(disp.style.opacity !== '1') disp.style.opacity = '1';
            scheduleRender();
          }
        }catch{}
      }
    }
    // Final render
    disp.style.opacity = '1';
    disp.innerHTML = mdRender(revised);
    currentText = revised;
    chatHistory.push({role:'user', content: msg});
    chatHistory.push({role:'assistant', content: revised});
    refreshGenUI();
    document.getElementById('next-btn').disabled=false;

    // Step 2: Short summary message in chat
    addChatMsg('ai', '요청하신 내용으로 수정했어요.');

  } catch(e) {
    document.getElementById(tid)?.remove();
    document.getElementById('content-display').style.opacity = '1';
    addChatMsg('ai', '죄송해요, 오류가 발생했어요. 다시 시도해 주세요.');
  } finally {
    busy = false;
    document.getElementById('chat-send').disabled = false;
  }
}

function addChatMsg(role,content,id) {
  const box=document.getElementById('chat-msgs');
  const eid=id||'cm'+Date.now();
  if(role==='user'){
    box.innerHTML+=`<div class="flex justify-end fade-up"><div class="chat-user px-4 py-3 text-sm max-w-[87%]">${escH(content)}</div></div>`;
  }else{
    box.innerHTML+=`<div class="flex gap-2 fade-up" id="${eid}">
      <div class="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold">C</div>
      <div class="chat-ai px-4 py-3 text-sm max-w-[87%] flex-1"><div id="${eid}-c" class="md-content" style="font-size:.85rem">${content?mdRender(content):''}</div></div>
    </div>`;
  }
  box.scrollTop=box.scrollHeight;
}

function addTyping(id) {
  const box=document.getElementById('chat-msgs');
  box.innerHTML+=`<div id="${id}" class="flex gap-2">
    <div class="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold">C</div>
    <div class="chat-ai px-4 py-3"><div class="flex gap-1.5"><span class="dot-bounce"></span><span class="dot-bounce"></span><span class="dot-bounce"></span></div></div>
  </div>`;
  box.scrollTop=box.scrollHeight;
}

function chatKeydown(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}}
function autoH(el){el.style.height='44px';el.style.height=Math.min(el.scrollHeight,110)+'px';}

// ============================================================
// COPY
// ============================================================
function copyContent() {
  navigator.clipboard.writeText(currentText).then(()=>{
    const b=document.getElementById('copy-btn');
    b.innerHTML='<span class="material-symbols-outlined text-sm">check</span> 복사됨';
    b.classList.add('text-green-600','border-green-300');
    b.classList.remove('text-on-surface-variant');
    setTimeout(()=>{
      b.innerHTML='<span class="material-symbols-outlined text-sm">content_copy</span> 복사';
      b.classList.remove('text-green-600','border-green-300');
      b.classList.add('text-on-surface-variant');
    },2000);
  });
}

// ============================================================
// MARKDOWN RENDERER
// ============================================================
function mdRender(text) {
  if(!text) return '';
  const lines=text.split('\n');
  const out=[];
  let listItems=[],listType=null;
  function fmt(s){
    let r=s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    r=r.replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>');
    r=r.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
    r=r.replace(/\*(.+?)\*/g,'<em>$1</em>');
    r=r.replace(/`(.+?)`/g,'<code>$1</code>');
    return r;
  }
  function flush(){
    if(!listItems.length) return;
    const tag=listType==='ol'?'ol':'ul';
    out.push(`<${tag}>${listItems.join('')}</${tag}>`);
    listItems=[];listType=null;
  }
  for(const line of lines){
    const t=line.trim();
    if(!t){flush();out.push('<div style="height:5px"></div>');continue;}
    if(t.startsWith('# ')){flush();out.push(`<h1>${fmt(t.slice(2))}</h1>`);continue;}
    if(t.startsWith('## ')){flush();out.push(`<h2>${fmt(t.slice(3))}</h2>`);continue;}
    if(t.startsWith('### ')){flush();out.push(`<h3>${fmt(t.slice(4))}</h3>`);continue;}
    if(t.startsWith('#### ')){flush();out.push(`<h4>${fmt(t.slice(5))}</h4>`);continue;}
    if(t.startsWith('> ')){flush();out.push(`<blockquote>${fmt(t.slice(2))}</blockquote>`);continue;}
    if(t==='---'||t==='***'){flush();out.push('<hr>');continue;}
    if(t.startsWith('- ')){if(listType!=='ul'){flush();listType='ul';}listItems.push(`<li>${fmt(t.slice(2))}</li>`);continue;}
    if(/^\d+\. /.test(t)){if(listType!=='ol'){flush();listType='ol';}listItems.push(`<li>${fmt(t.replace(/^\d+\. /,''))}</li>`);continue;}
    if(t.startsWith('→ ')){flush();out.push(`<p style="padding-left:1rem;color:#4e5968"><span style="color:#3182f6;font-weight:600">→</span> ${fmt(t.slice(2))}</p>`);continue;}
    flush();out.push(`<p>${fmt(t)}</p>`);
  }
  flush();
  return out.join('');
}

function escH(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

// ============================================================
// VARIATION — 탭 기반
// ============================================================
let activeVarTab = 'home';
let varTexts = { home: '', naver: '', brunch: '', cafe24: '' };
let varBusy = { naver: false, brunch: false, cafe24: false };

const VAR_PROMPTS = {
  naver: `이 최종안을 네이버 블로그 로직에 맞게 바꿔줘. 제목(H1~H2)은 크고 명확하게 유지하고, 핵심 키워드 반복 빈도를 조금 더 높이고, 문단을 더 잘게 쪼개서 모바일 가독성을 극대화해 줘. 이모지는 섹션 타이틀에만 1개씩, 전체 3~4개 이내로만 사용해줘.`,
  brunch: `이 글의 화자, 인칭, 내용, 구조는 절대 바꾸지 말고 어투만 브런치 감성에 맞게 살짝 다듬어줘. 딱딱한 기능 설명 문장을 조금 더 담담하고 자연스러운 어조(~다, ~했다)로 바꾸되, 다음 요소는 반드시 원본 그대로 유지할 것: # ## ### H태그 제목, **볼드**, --- 구분선, - 리스트, 이모지. 어투 변환 외에 다른 변경은 하지 말 것.`,
  cafe24: `이 원고를 카페24 앱마켓 소개 페이지에 맞게 변환해줘.

[어조]
- 기본은 친근한 해요체(~해요, ~있어요)를 유지하되, 핵심 혜택과 CTA 문장에서만 신뢰감을 주는 합니다체(~합니다, ~됩니다)를 섞어줘
- 전체의 70%는 해요체, 30%는 합니다체 비율로

[구조 및 내용]
- 서론은 카페24 쇼핑몰 운영자들이 겪는 매출/운영/CS의 구체적인 페인포인트로 시작할 것
- 긴 줄글을 분해해서 혜택 중심의 불릿 포인트(- 또는 ✔️) 리스트로 변환할 것
- 원본에 성과 데이터나 수치가 있다면 소제목이나 리스트 앞단으로 끌어와 강조할 것
- "카페24 쇼핑몰에 바로 연동해서~", "카페24 운영자라면 복잡한 개발 없이~" 같은 플랫폼 시너지 키워드를 1~2회 자연스럽게 삽입할 것
- 아웃트로는 "지금 바로 크리마를 연동하고 매출 변화를 경험해보세요"와 같은 행동 유도로 마무리할 것`,
};

const VAR_DESCS = {
  home: '홈페이지 블로그 최종안을 붙여 넣어주세요. 네이버 블로그 / 브런치 / 카페24 탭을 클릭하면 즉시 변환이 시작돼요.',
  naver: '키워드 반복 빈도↑ · 제목 크게 · 문단 세분화 · 모바일 가독성',
  brunch: '에세이 톤(~다, ~했다) · 고민과 통찰 중심 · 담담한 전문가 어조',
  cafe24: '해요체 기반 + 합니다체 혼합 · 불릿 포인트 구조화 · 카페24 시너지 강조 · 행동 유도 CTA',
};

function goToVariation() {
  const ta = document.getElementById('var-input');
  const source = currentText || document.getElementById('content-display')?.innerText || '';
  if(ta && source.trim() && !ta.value.trim()) {
    // Replace literal \n strings with actual newlines
    ta.value = source.trim().replace(/\\n/g, '\n');
  }
  // Reset tab state
  activeVarTab = 'home';
  varTexts = { home: '', naver: '', brunch: '', cafe24: '' };
  varBusy = { naver: false, brunch: false, cafe24: false };
  // Reset tab UI
  ['naver','brunch','cafe24'].forEach(ch => {
    document.getElementById('vtab-badge-'+ch)?.classList.add('hidden');
    document.getElementById('vtab-loading-'+ch)?.classList.add('hidden');
    const el = document.getElementById('vtab-'+ch+'-content');
    if(el) el.innerHTML = `<div class="flex flex-col items-center justify-center h-64 text-on-surface-variant gap-3">
      <span class="material-symbols-outlined text-4xl opacity-30">${ch==='naver'?'article':ch==='brunch'?'edit_note':'storefront'}</span>
      <p class="text-sm">탭이 활성화되면 자동으로 변환이 시작돼요</p></div>`;
  });
  _setActiveTab('home');
  show('var');
}

function switchVarTab(ch) {
  if(activeVarTab === ch) return;
  _setActiveTab(ch);
  // If naver/brunch and not yet generated → start generation
  if(ch !== 'home' && !varTexts[ch] && !varBusy[ch]) {
    const src = document.getElementById('var-input')?.value.trim();
    if(!src) { alert('홈페이지 블로그 탭에서 최종안을 먼저 입력해 주세요.'); _setActiveTab('home'); return; }
    _runVariation(ch, src);
  }
}

function _setActiveTab(ch) {
  activeVarTab = ch;
  // Panel visibility
  ['home','naver','brunch','cafe24'].forEach(t => {
    document.getElementById('vtab-'+t)?.classList.toggle('hidden', t !== ch);
  });
  // Tab button styles
  ['home','naver','brunch','cafe24'].forEach(t => {
    const btn = document.getElementById('vtab-btn-'+t);
    if(!btn) return;
    if(t === ch) {
      btn.className = btn.className
        .replace('border-transparent text-on-surface-variant hover:text-primary hover:bg-primary/3', '')
        .replace('border-transparent','')
        + ' border-b-2 border-primary text-primary bg-primary/4';
      btn.className = btn.className.replace(/\s+/g,' ').trim();
      // Normalize
      btn.style.borderBottomWidth = '2px';
      btn.style.borderBottomColor = '#3182f6';
      btn.style.color = '#3182f6';
      btn.style.background = 'rgba(49,130,246,.04)';
    } else {
      btn.style.borderBottomWidth = '2px';
      btn.style.borderBottomColor = 'transparent';
      btn.style.color = '';
      btn.style.background = '';
    }
  });
  // Desc & action buttons
  document.getElementById('vtab-desc').textContent = VAR_DESCS[ch];
  const regenBtn = document.getElementById('vtab-regen-btn');
  if(regenBtn) regenBtn.classList.toggle('hidden', ch === 'home');
}

async function _runVariation(ch, inputText) {
  varBusy[ch] = true;
  // unescape literal \n strings
  const cleanInput = inputText.replace(/\\n/g, '\n').trim();
  const contentEl = document.getElementById('vtab-'+ch+'-content');
  const loadingEl = document.getElementById('vtab-loading-'+ch);
  const badgeEl = document.getElementById('vtab-badge-'+ch);

  loadingEl?.classList.remove('hidden');
  badgeEl?.classList.add('hidden');
  contentEl.innerHTML = '<div class="flex items-center gap-3 text-on-surface-variant py-8"><div><span class="dot-bounce"></span><span class="dot-bounce"></span><span class="dot-bounce"></span></div><span class="text-sm">변환하고 있어요...</span></div>';

  try {
    const res = await fetch('/api/variation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        max_tokens: 3500,
        messages: [{ role: 'user', content: `다음 원고를 아래 지침에 따라 변환해줘.\n\n지침: ${VAR_PROMPTS[ch]}\n\n원고:\n${cleanInput}` }],
        stream: true,
      }),
    });
    if(!res.ok) throw new Error('API 오류 '+res.status);

    contentEl.innerHTML = '';
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let full = '', buf = '', renderPending = false;

    const scheduleRender = () => {
      if(renderPending) return;
      renderPending = true;
      setTimeout(() => {
        renderPending = false;
        contentEl.innerHTML = mdRender(full.replace(/\\n/g,'\n').trim());
      }, 120);
    };

    while(true) {
      const { done, value } = await reader.read();
      if(done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n'); buf = lines.pop();
      for(const line of lines) {
        if(!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if(raw==='[DONE]') continue;
        try {
          const d = JSON.parse(raw);
          if(d.type==='content_block_delta' && d.delta?.text) { full += d.delta.text; scheduleRender(); }
        } catch{}
      }
    }
    contentEl.innerHTML = mdRender(full.replace(/\\n/g,'\n').trim());
    varTexts[ch] = full.replace(/\\n/g,'\n').trim();
    badgeEl?.classList.remove('hidden');
  } catch(e) {
    contentEl.innerHTML = `<div class="p-4 bg-red-50 rounded-xl text-red-600 text-sm">오류: ${escH(e.message)}<br>다시 변환 버튼을 눌러주세요.</div>`;
  } finally {
    varBusy[ch] = false;
    loadingEl?.classList.add('hidden');
  }
}

function regenCurrentTab() {
  if(activeVarTab === 'home') return;
  const src = document.getElementById('var-input')?.value.trim();
  if(!src) { alert('홈페이지 블로그 탭에서 최종안을 먼저 입력해 주세요.'); return; }
  varTexts[activeVarTab] = '';
  _runVariation(activeVarTab, src);
}

function copyCurrentTab() {
  let text = '';
  if(activeVarTab === 'home') {
    text = document.getElementById('var-input')?.value || '';
  } else {
    text = varTexts[activeVarTab] || document.getElementById('vtab-'+activeVarTab+'-content')?.innerText || '';
  }
  if(!text.trim()) return;
  navigator.clipboard.writeText(text).then(() => {
    const b = document.getElementById('vtab-copy-btn');
    b.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> 복사됨';
    b.classList.add('text-green-600','border-green-300');
    setTimeout(() => {
      b.innerHTML = '<span class="material-symbols-outlined text-sm">content_copy</span> 복사';
      b.classList.remove('text-green-600','border-green-300');
    }, 2000);
  });
}

// Init
show('cat');
