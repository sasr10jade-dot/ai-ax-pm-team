import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowUpRight, ArrowRight, BookOpen, ChevronRight, ClipboardCheck, Compass, FileText, Layers, Lock, MessageSquare, Network, ShieldCheck, Sparkles, Users } from 'lucide-react';

/* ------------------------------------------------------------------
 * 기준 문서: AI_AX_PM_팀빌딩_전략개발1팀_261127.pptx
 * 보조 원문: AI_표준개발방법론_매뉴얼 (11단계 상세), 초콜릿 v1.0 개발방안 (MMA), PM팀빌딩_251013 (R&R)
 * ------------------------------------------------------------------ */

const nav = [
  { id: 'overview', label: '한눈에 보기' },
  { id: 'roles', label: '팀 구성·역할' },
  { id: 'ai', label: 'AI 활용' },
  { id: 'steps', label: '11단계' },
  { id: 'mma', label: '초콜릿·MMA' },
  { id: 'work', label: 'PM의 일' },
  { id: 'quality', label: '품질·보안' },
  { id: 'roadmap', label: '로드맵·약속' },
];

// 11단계 — 덱 10·11번 슬라이드 + 매뉴얼 단계별 상세
const steps = [
  { n: 1, group: '분석', title: '요구사항 분석', desc: '고객 문서에서 해야 할 일을 빠짐없이 뽑아 정리합니다.', ai: '사업 개요·기능·비기능으로 나눠 요구사항을 추출하고, 번호와 근거 쪽수를 붙입니다.', human: '원문과 대조해 누락·오해를 확인하고, 애매한 내용은 질의서로 조기 확인합니다.', out: '요구사항정의서 · 고객 질의서' },
  { n: 2, group: '분석', title: 'PRD 작성', desc: '무엇을, 왜 만드는지 팀이 같은 그림을 갖게 합니다.', ai: '목표·사용자·주요 기능·범위 초안을 쓰고 기술 조건을 반영합니다.', human: '비기능·기술 조건이 모두 반영됐는지 검증하고, 추출자가 아닌 다른 사람이 재검토합니다.', out: 'PRD · PRD 검증 결과' },
  { n: 3, group: '분석', title: 'SRS 작성', desc: '개발과 테스트의 기준이 되는 상세 명세를 만듭니다.', ai: '세 문서를 교차 비교해 불일치·누락을 찾고, 기능별 입력·처리·출력을 기술합니다.', human: '문서 간 일치를 최종 판단하고, 테스트 가능한 문장인지 확인하며 RTM 첫 버전을 만듭니다.', out: 'SRS · RTM 초안' },
  { n: 4, group: '분석', title: '고객 협의·반영', desc: '고객과 요구사항을 확정하고 변경을 문서에 반영합니다.', ai: '회의 자료를 준비하고, 회의록을 결정·변경·보류로 분류합니다.', human: '인터뷰를 진행하고 합의 내용에 고객 확인(서명·메일)을 받으며 일정·비용 영향을 판단합니다.', out: '고객협의결과서' },
  { n: 5, group: '설계', title: '아키텍처 구성', desc: '시스템이 어떤 부품으로 어떻게 연결될지 구조를 정합니다.', ai: '시스템 구성도·ERD·연계 방식 초안을 만들고 기술 선택안을 비교합니다.', human: '요구사항과 구조가 맞는지, 외부 시스템 연계 조건이 맞는지 확인합니다.', out: '아키텍처 설계서 · 데이터·인터페이스 정의서' },
  { n: 6, group: '설계', title: '디자인 방향', desc: '화면의 흐름과 디자인 방향을 정합니다. (5단계와 함께 진행)', ai: '메뉴 구조·화면 흐름 초안과 디자인 시안 방향을 제안합니다.', human: '고객과 화면 흐름을 확인하고 접근성·표준 준수를 점검하며 디자인 방향을 승인받습니다.', out: '디자인 방향 정의서 · 화면 흐름도' },
  { n: 7, group: '개발·검증', title: '개발', desc: '설계대로 개발하고 짧은 주기로 고객 요구와 비교합니다.', ai: '코드와 화면을 작성하고, 코드 리뷰와 문서 작성을 보조합니다.', human: '1~2주 단위로 결과를 고객 요구와 비교하고, 코드 리뷰와 정적 분석을 확인합니다.', out: '소스코드 · 주기별 검증 결과' },
  { n: 8, group: '개발·검증', title: '단위 테스트', desc: '기능 하나하나가 요구대로 동작하는지 먼저 확인합니다.', ai: '테스트 시나리오·데이터와 테스트 코드를 만들고 결과서 초안을 정리합니다.', human: '정상·예외를 모두 다루는지 확인하고, 실패 항목을 고쳐 재시험한 뒤 RTM에 기록합니다.', out: '단위 테스트 시나리오·결과서' },
  { n: 9, group: '개발·검증', title: '통합 테스트', desc: '기능을 연결해 처음부터 끝까지 서비스가 동작하는지 확인합니다.', ai: '업무 흐름별 시나리오와 성능·부하 시험 계획을 쓰고 결함을 정리합니다.', human: '관통 시나리오를 수행하고 성능·보안을 점검합니다(공공은 보안약점 진단 포함).', out: '통합 테스트 시나리오·결과서' },
  { n: 10, group: '납품', title: '최종 검증·준공', desc: '고객이 직접 써 보고 인수를 결정하고, 운영 초기를 안정화합니다.', ai: '인수 시험 시나리오·체크표를 준비하고 문의·결함과 안정화 이슈를 분류합니다.', human: '고객 인수 시험(UAT)을 진행하고 RTM으로 요구사항 100% 충족을 확인해 준공 확인서를 받습니다.', out: 'UAT 결과서 · 준공 확인서' },
  { n: 11, group: '납품', title: '산출물 제출', desc: '과업지시서가 요구한 모든 산출물을 형식에 맞춰 제출합니다.', ai: '산출물 목록과 보유 문서를 비교하고 양식을 정리하며 누락·불일치를 표시합니다.', human: '제출 목록의 누락과 문서·시스템 일치를 확인하고 제출·접수를 확인합니다.', out: '최종 산출물 세트 · 제출 확인서' },
];

const filters = [
  { key: '전체', label: '전체 · 11단계' },
  { key: '분석', label: '분석 · 1–4' },
  { key: '설계', label: '설계 · 5–6' },
  { key: '개발·검증', label: '개발·검증 · 7–9' },
  { key: '납품', label: '납품 · 10–11' },
];

// 팀 구성 — 덱 7·8번 슬라이드
const roles = [
  ['전략개발 1팀 Head', 'MPM Head · 최종 책임', '#EAF3FF', '#2F6FDB', 'Project 로드맵 한 판을 그리고 운영하는 책임자입니다. 문제 해결·커뮤니케이션·일정관리 역량으로 팀을 이끕니다.', '11단계 표준 방법론을 전 프로젝트에 적용하고 최종 책임(A)을 집니다.'],
  ['Development PM', '개발 · 기술 리딩', '#E7F6F0', '#1E8A68', '개발 전체의 문제를 예측하고 대응합니다. 개발 스펙 정의, 공통·DB 설계, 프레임워크 구성 등 기술 방향을 가이드합니다.', 'AI가 만든 설계·코드의 리뷰 기준을 세우고, MMA 구조로 개발 방법을 가이드합니다.'],
  ['Management PM', '인력 · 업체 연결', '#FFF1E8', '#C65D2B', '인력과 업체를 섭외하고 연결하는 전문가입니다. 인적 자원을 최적으로 활용하고 대·내외 고객 응대를 지원합니다.', '내·외부 인력에게 AI 사용 수칙과 문서 양식을 공유하고 역량 편차를 관리합니다.'],
  ['PMO', '이슈 · 문서 · 진척 관리', '#FFF7D6', '#8A6D00', '이슈 관리체제를 세우고 문서·템플릿을 관리합니다. 전사 Project 현황(WBS·이슈·진척)을 보고합니다.', '팀 표준 프롬프트·문서 양식을 관리하고 RTM과 변경 관리를 운영합니다.'],
  ['Information Security', '정보보안 책임자', '#F0EBFF', '#6B4FD8', '프로젝트의 정보보안을 책임지는 역할입니다.', 'AI 사용 전 보안 수칙(계약·보안 확인 → 자료 구분 → 허용 도구 → 기록)을 감독합니다.'],
  ['Planning · Design · Development PL', '프로젝트별 실행 조직', '#EAF3FF', '#2F6FDB', '프로젝트마다 기획·디자인·개발을 실행하며 유관부서·외주 개발사와 협업합니다.', 'RACI 기준으로 분석·준공 구간은 기획·분석 PL이, 설계·개발·테스트는 개발 쪽이 실행(R)합니다.'],
];

const tools = [
  ['N', 'NotebookLM', '자료 읽고 정리', '과업지시서 같은 긴 문서에서 요구사항을 뽑고 근거 위치를 확인합니다.', '#EAF3FF', '#2F6FDB'],
  ['C', 'Claude', '문서 작성·개발', 'PRD·SRS 초안, 설계, 코드, 테스트 시나리오를 만듭니다.', '#E7F6F0', '#1E8A68'],
  ['G', 'Gemini', '교차 검토', '같은 자료를 다른 AI로 다시 검토해 빠진 부분을 찾습니다.', '#F0EBFF', '#6B4FD8'],
];

const checks = [
  ['없는 내용 만들기', 'AI가 원문에 없는 요구사항을 지어내지 않았는지 — 근거 쪽수를 원문과 대조'],
  ['빠뜨림', '과업지시서 항목 수와 정리된 요구사항 수가 맞는지 — RTM으로 확인'],
  ['기술 조건', '프레임워크·언어·보안 등 비기능 조건이 문서에 들어갔는지'],
  ['문서 간 일치', 'PRD·SRS·설계서가 서로 모순되지 않는지 — 다른 AI로 교차 검토'],
  ['코드 품질', '코드 리뷰, 정적 분석, 보안약점, 라이선스를 점검했는지'],
];

const security = [
  ['계약·보안 조건 확인', '고객사 보안 규정과 계약서에서 외부 AI 사용이 허용되는지 먼저 확인합니다.'],
  ['올릴 자료 구분', '개인정보·내부망 정보·인증키·비밀번호는 올리지 않고 가립니다(마스킹).'],
  ['허용된 도구만 사용', '팀이 승인한 계정과 설정(학습에 사용하지 않음)을 씁니다.'],
  ['기록 남기기', '어떤 자료를 어느 도구에 사용했는지 간단히 기록합니다.'],
];

const projects = [
  ['지역 관광·모빌리티 호출', '관광택시 호출·순번배차·예약, 시티투어 예약, 주차장 정보, 결제 연동', '국내 클라우드'],
  ['초소형 전기차 공유', '예약/반납, 이동경로 수집·시각화, 디지털키', '글로벌 클라우드'],
  ['EV 충전 운영 (공공)', '충전 사업자 시스템 연계, EV 충전 앱 + 관리자 웹(CSMS)', '국내 클라우드'],
  ['통합 MaaS (공공)', '통합 MaaS 앱·기사앱·관리자, 버스DRT/택시 호출 SDK', '글로벌 클라우드'],
  ['자동차 사이버보안 대응', '사이버보안 시스템 클라이언트 연동, 사고신고 관리', '고객 전용 환경'],
  ['V2X 인증서 관리 (공공)', 'PKI 인증서 발급·갱신·폐기', 'On-Premises'],
];

const synth = [
  ['공통 모듈', 'Login · Common Module', '팀 공통 표준', '프롬프트 · 문서 양식 · RTM 템플릿 · 보안 수칙을 PMO가 관리한다'],
  ['서비스 모듈', 'Payment · EV CSMS · V2X 등', '프로젝트 산출물 세트', '공통 표준에서 꺼내 쓰고, 프로젝트 특성만 조합한다'],
  ['모듈 경계와 의존성', '의존성 관리가 복잡해질 수 있음', '번호로 잇는 추적', 'REQ 번호로 요구·설계·테스트를 연결하고, 변경은 절차대로 처리한다'],
  ['단계적 고도화', 'MMA에서 MSA 확장까지 고려', '프로젝트 병행 고도화', '표준을 프로젝트와 함께 키우고, 조직이 준비되면 독립 확장한다'],
];

const raci = [
  ['분석 (1~4)', 'A', 'R', 'C', 'C', 'C'],
  ['설계 (5~6)', 'A', 'C', 'R', 'C', 'C'],
  ['개발 (7)', 'A', 'C', 'R', 'I', 'I'],
  ['테스트 (8~9)', 'A', 'I', 'R', 'R', 'I'],
  ['준공·제출 (10~11)', 'A', 'R', 'C', 'R', 'C'],
];

function SectionHead({ no, kicker, title, sub, tone }: { no: string; kicker: string; title: string; sub: string; tone: string }) {
  return (
    <div className="max-w-[760px]">
      <div className="flex items-center gap-2">
        <span className="pill px-2.5 py-1 text-[12px] font-extrabold" style={{ background: tone }}>{no}</span>
        <span className="section-label text-[#64748B]">{kicker}</span>
      </div>
      <h2 className="mt-4 text-[clamp(26px,4vw,38px)] leading-[1.25] font-black tracking-[-0.02em]">{title}</h2>
      <p className="mt-3 text-[15px] sm:text-[17px] leading-7 text-[#475569]">{sub}</p>
    </div>
  );
}

const Divider = () => <div className="mx-auto max-w-[1160px] px-4 sm:px-6"><hr className="border-[#E8EDF3]" /></div>;

export default function App() {
  const [filter, setFilter] = useState('전체');
  const [showTop, setShowTop] = useState(false);
  const visible = steps.filter((s) => filter === '전체' || s.group === filter);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 650);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-screen bg-white text-[#1E293B] overflow-x-clip">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-[#E8EDF3] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6">
          <div className="flex h-[64px] items-center justify-between gap-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex min-w-0 items-center gap-2.5 text-left">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#EAF3FF] text-[17px] font-black text-[#2F6FDB]">AX</span>
              <span className="leading-tight"><span className="block text-[13px] font-black">전략개발1팀</span><span className="block text-[11px] font-bold text-[#64748B]">AI AX PM · 팀빌딩</span></span>
            </button>
            <nav aria-label="섹션 이동" className="hidden lg:flex items-center gap-5 text-[13px] font-bold text-[#64748B]">
              {nav.map((n) => <button key={n.id} onClick={() => go(n.id)} className="nav-link hover:text-[#1E293B]">{n.label}</button>)}
            </nav>
            <a href={`${import.meta.env.BASE_URL}ai-guide/methodology.html`} className="inline-flex shrink-0 items-center gap-1.5 pill bg-[#2F6FDB] px-3.5 py-2 text-[12px] sm:text-[13px] font-extrabold text-white hover:bg-[#2459B8]"><BookOpen size={14} />Jade AI 개발방법론<ArrowUpRight size={14} /></a>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-3 lg:hidden" style={{ scrollbarWidth: 'none' }}>
            {nav.map((n) => <button key={n.id} onClick={() => go(n.id)} className="shrink-0 rounded-full border border-[#E8EDF3] bg-[#F7F8FA] px-3 py-1.5 text-[12px] font-bold">{n.label}</button>)}
            <a href={`${import.meta.env.BASE_URL}ai-guide/methodology.html`} className="shrink-0 rounded-full bg-[#2F6FDB] px-3 py-1.5 text-[12px] font-bold text-white lg:hidden">Jade AI 개발방법론 ↗</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1160px] px-4 sm:px-6 pt-10 sm:pt-16 pb-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="pill bg-[#EAF3FF] px-3 py-1.5 text-[12px] font-extrabold text-[#2F6FDB]">전략개발1팀 팀빌딩 · 2026.11.27</span>
          <span className="pill bg-[#F7F8FA] px-3 py-1.5 text-[12px] font-extrabold text-[#64748B]">전략개발1팀 · AI AX PM</span>
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <div>
            <p className="text-[15px] font-bold text-[#2F6FDB]">AI가 초안을 만들고, PM이 책임진다.</p>
            <h1 className="mt-3 text-[clamp(48px,9vw,92px)] leading-[0.95] font-black tracking-[-0.05em]">AI AX PM<span className="text-[#2F6FDB]">이 되자</span></h1>
            <p className="mt-5 text-[clamp(20px,3vw,30px)] leading-snug font-bold">숲을 보는 사람들의 일하는 방식<br />— AI로 빠르게 만들고, PM이 끝까지 책임집니다</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[['사람', 'PM 역할'], ['방법', '11단계'], ['구조', 'MMA']].map(([a, b]) => (
                <span key={a} className="pill border border-[#E8EDF3] bg-white px-3.5 py-2 text-[13px] font-bold shadow-sm"><b className="text-[#2F6FDB]">{a}</b> · {b}</span>
              ))}
            </div>
          </div>
          <div className="card !bg-[#F7F8FA] p-5 sm:p-6">
            <div className="flex items-center gap-2 text-[12px] font-extrabold tracking-widest text-[#64748B]"><Sparkles size={16} /> 핵심 메시지</div>
            <p className="mt-3 text-[18px] leading-8 font-bold">AI AX PM =<br /><span className="text-[#2F6FDB]">숲을 보는 PM</span> + <span className="text-[#2F6FDB]">AI 표준 방법론</span> + <span className="text-[#2F6FDB]">모듈형 구조</span></p>
            <p className="mt-3 text-[14px] leading-6 text-[#64748B]">PM의 본질은 그대로, 책임의 무게는 더 크게. AI는 초안을 만들고 확인과 결정은 사람이 합니다.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#EAF3FF] p-4"><b>01 사람</b><p className="mt-1 text-sm text-slate-600">PM의 본질은 그대로, 책임의 무게는 더 크게</p></div>
          <div className="rounded-2xl bg-[#E7F6F0] p-4"><b>02 방법</b><p className="mt-1 text-sm text-slate-600">AI는 초안, 사람은 검증·결정</p></div>
          <div className="rounded-2xl bg-[#F0EBFF] p-4"><b>03 구조</b><p className="mt-1 text-sm text-slate-600">공통은 모듈로, 서비스는 꺼내 쓰기</p></div>
        </div>
      </section>

      <Divider />

      {/* Overview */}
      <section id="overview" className="mx-auto max-w-[1160px] px-4 sm:px-6 py-12 sm:py-16">
        <SectionHead no="01" kicker="OVERVIEW" title="AI AX PM, 한눈에 보기" sub="누가, 어떻게, 어떤 구조로 일할까요? 세 가지 질문으로 시작합니다." tone="#EAF3FF" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="card p-6 !bg-[#EAF3FF]"><Users className="text-[#2F6FDB]" /><h3 className="mt-4 text-xl font-black">사람 — PM의 본질은 그대로</h3><p className="mt-2 text-[15px] leading-7 text-slate-600">문제해결·소통·일정관리는 유지하되, AI 시대에는 <b className="text-slate-800">정의·확인·결정이 PM의 몫</b>입니다. 책임의 무게는 더 커집니다.</p></article>
          <article className="card p-6 !bg-[#E7F6F0]"><Compass className="text-[#1E8A68]" /><h3 className="mt-4 text-xl font-black">방법 — 같은 11단계</h3><p className="mt-2 text-[15px] leading-7 text-slate-600">요구사항 분석부터 납품까지 <b className="text-slate-800">11단계를 같은 순서로 반복</b>하고, 모든 단계를 문서와 RTM으로 남깁니다.</p></article>
          <article className="card p-6 !bg-[#F0EBFF]"><Layers className="text-[#6B4FD8]" /><h3 className="mt-4 text-xl font-black">구조 — MMA처럼 모듈로</h3><p className="mt-2 text-[15px] leading-7 text-slate-600">초콜릿 1.0의 <b className="text-slate-800">Modular Monolithic Architecture</b>처럼 공통 표준을 쌓고, 프로젝트를 병행하며 단계적으로 고도화합니다.</p></article>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-[18px] border border-[#E8EDF3] bg-[#F7F8FA] p-6"><p className="text-xs font-extrabold tracking-widest text-slate-400">PM의 3대 역량 · 변하지 않는 것</p><p className="mt-3 text-lg font-bold leading-8">문제 해결<br />커뮤니케이션<br />일정관리</p></div>
          <div className="rounded-[18px] bg-[#2F6FDB] p-6 text-white"><p className="text-xs font-extrabold tracking-widest text-sky-200">AI AX PM · 달라지는 것</p><p className="mt-3 text-lg font-bold leading-8">AI가 초안을 만들고,<br />사람이 검증·결정하고,<br />PM이 끝까지 책임진다</p></div>
        </div>
        <div className="mt-4 rounded-[18px] bg-[#EAF3FF] px-5 py-4 text-[15px] leading-7 font-bold">한 줄 정의 · <span className="text-[#2F6FDB]">AI 초안 + 사람 검증 + 보안 수칙 + 요구사항 추적표(RTM)로 AI의 강점은 살리고 주의할 점은 줄이는 PM의 일하는 방식입니다.</span></div>
      </section>

      <Divider />

      {/* Roles */}
      <section id="roles" className="mx-auto max-w-[1160px] px-4 sm:px-6 py-12 sm:py-16">
        <SectionHead no="02" kicker="TEAM & ROLES" title="팀 구성과 역할별 AX 미션" sub="전략개발 1팀 Head 아래 정보보안·PMO·Development PM·Management PM이 있고, 프로젝트별 PL이 유관부서·외주와 협업합니다. (AX 미션은 팀에 드리는 제안입니다)" tone="#E7F6F0" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roles.map(([t, s, c, d, a, b]) => (
            <article key={t} className="card p-6">
              <span className="pill px-3 py-1 text-xs font-extrabold" style={{ background: c, color: d }}>{s}</span>
              <h3 className="mt-4 text-xl font-black">{t}</h3>
              <p className="mt-3 text-[15px] leading-7 text-slate-600"><b className="text-slate-800">무엇을 하나요</b><br />{a}</p>
              <p className="mt-4 border-t border-dashed border-slate-200 pt-4 text-[14px] leading-6 text-slate-600"><b className="text-slate-800">AI AX 미션 (제안)</b><br />{b}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card p-6"><p className="section-label text-[#64748B]">COLLABORATION</p><h3 className="mt-2 text-lg font-black">유관부서</h3><p className="mt-2 text-[15px] leading-7 text-slate-600">사업본부 · 서비스 운영 조직 · 서비스 기획 조직 · 연구소 · 고객사</p></div>
          <div className="card p-6"><p className="section-label text-[#64748B]">COLLABORATION</p><h3 className="mt-2 text-lg font-black">외주 개발사 · 프리랜서 그룹</h3><p className="mt-2 text-[15px] leading-7 text-slate-600">프로젝트에 따라 연계하여 빠르고 정확하게 구축합니다.</p></div>
        </div>
        <div className="mt-4 rounded-[18px] bg-[#1E293B] p-6 text-white"><h3 className="text-xl font-black">숲보다 더 큰 사람들</h3><p className="mt-2 text-sm leading-6 text-slate-300">리더십·개발 이해·커뮤니케이션을 UP, 그리고 AI로 한 번 더 UP — 팀의 비전은 &lsquo;PM의 일&rsquo; 섹션에서 이어집니다.</p></div>
      </section>

      {/* AI use */}
      <section id="ai" className="bg-[#F7F8FA] py-12 sm:py-16">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6">
          <SectionHead no="03" kicker="WORKING WITH AI" title="AI는 초안, PM은 책임" sub="AI에게 모든 것을 맡기는 것이 아닙니다. 역할을 나눠 일하고, 모든 단계에서 같은 순서를 반복합니다." tone="#FFF1E8" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['AI가 잘하는 것', '#EAF3FF', ['빠른 초안·정리', '반복 작업', '문서 간 비교']],
              ['사람이 해야 하는 것', '#E7F6F0', ['사실 확인과 판단', '고객과의 협의', '최종 책임']],
              ['주의할 점', '#FFF1E8', ['없는 내용을 지어낼 수 있음', '고객 자료 보안 확인', '결과 검증 후 사용']],
            ].map(([t, c, items]) => (
              <article key={t as string} className="card p-6" style={{ background: c as string }}>
                <h3 className="text-xl font-black">{t}</h3>
                <ul className="mt-3 space-y-2 text-[15px] leading-7 text-slate-700">{(items as string[]).map((i) => <li key={i} className="flex gap-2"><CheckDot />{i}</li>)}</ul>
              </article>
            ))}
          </div>

          <h3 className="mt-10 text-lg font-black">모든 단계의 반복 리듬</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            {[['AI가 초안 작성', '지시문과 자료로 문서·코드 초안을 만든다'], ['사람이 검토', '원문·근거와 대조해 오류를 고친다'], ['고객 확인', '핵심 결정은 고객에게 확인받는다'], ['문서 확정·기록', '버전을 붙여 저장하고 RTM에 반영한다']].map(([t, d], i) => (
              <div key={t} className="card relative p-5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2F6FDB] text-sm font-black text-white">{i + 1}</span>
                <b className="mt-3 block text-[16px]">{t}</b>
                <p className="mt-1 text-sm leading-6 text-slate-600">{d}</p>
                {i < 3 && <ChevronRight className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-[#2F6FDB] md:block" size={20} />}
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm font-bold text-slate-500">틀리거나 부족하면 다시 AI에게 지시합니다.</p>

          <h3 className="mt-10 text-lg font-black">도구별 역할: 읽고 · 만들고 · 교차 검토</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {tools.map(([k, n, r, d, c, ink]) => (
              <article key={n} className="card p-6">
                <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full text-lg font-black text-white" style={{ background: ink }}>{k}</span><div><b className="block text-lg leading-tight">{n}</b><span className="text-sm font-bold" style={{ color: ink }}>{r}</span></div></div>
                <p className="mt-3 text-[15px] leading-7 text-slate-600">{d}</p>
              </article>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="card overflow-hidden"><div className="bg-[#1E293B] px-5 py-3 text-sm font-bold text-white">1단계 · 프롬프트 예시</div><div className="p-5 mono text-[13px] leading-6 text-slate-700 bg-[#F8FAFC]">“첨부한 과업지시서에서 사업 개요·기능·비기능 요구사항을 표로 뽑아줘.<br />항목마다 번호, 원문 쪽수, 중요도를 적어줘.”</div><p className="px-5 pb-5 pt-3 text-sm leading-6 text-slate-500">같은 지시를 반복해 쓸 수 있도록 프롬프트와 문서 양식을 팀 표준으로 만듭니다.</p></div>
            <div className="card p-5 sm:p-6 bg-[#FFF1E8]"><p className="font-black">사람의 책임</p><div className="mt-4 space-y-3">{[['AI의 답은 ‘초안’', '근거(과업지시서 몇 쪽 등)를 함께 적게 하고, 담당자가 원문과 대조한다'], ['지시문을 팀 표준으로', '프롬프트와 문서 양식을 팀 표준으로 만든다'], ['검증 담당자 지정', '없는 요구사항을 지어내거나 빠뜨릴 수 있으므로 체크리스트로 확인한다']].map(([t, d]) => <div key={t} className="rounded-2xl bg-white p-3 shadow-sm"><b>{t}</b><p className="mt-1 text-sm leading-6 text-slate-600">{d}</p></div>)}</div></div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="steps" className="mx-auto max-w-[1160px] px-4 sm:px-6 py-12 sm:py-16">
        <SectionHead no="04" kicker="11 STEPS" title="AI 활용 표준 개발 방법론 11단계" sub="분석 · 설계 · 개발·검증 · 납품, 4개 구간으로 묶어 봅니다. 구간 버튼을 눌러 해당 단계만 골라 볼 수 있습니다." tone="#EAF3FF" />
        <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="단계 필터">
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} aria-pressed={filter === f.key} className={`rounded-full px-4 py-2 text-[13px] font-extrabold border transition ${filter === f.key ? 'bg-[#1E293B] text-white border-[#1E293B]' : 'bg-white border-[#E8EDF3] text-slate-600 hover:border-slate-300'}`}>{f.label}</button>
          ))}
        </div>
        <p className="mt-4 text-sm font-bold text-[#2F6FDB]">{visible.length}개 단계가 선택되었습니다 · {filter === '전체' ? '요구사항 분석부터 산출물 제출까지 전체 흐름' : '선택한 구간만 보는 중'}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((s) => (
            <article key={s.n} className="card flex flex-col p-5">
              <div className="flex items-center justify-between"><span className="text-[34px] font-black leading-none text-[#2F6FDB]">{String(s.n).padStart(2, '0')}</span><span className="pill bg-[#F7F8FA] px-2.5 py-1 text-[11px] font-extrabold text-slate-500">{s.group}</span></div>
              <h3 className="mt-3 text-[20px] font-black">{s.title}</h3><p className="mt-1 text-[15px] leading-6 text-slate-600">{s.desc}</p>
              <div className="mt-4 space-y-2 text-[13px] leading-5"><p className="rounded-xl bg-[#EAF3FF] px-3 py-2"><b>AI가 하는 일</b> · {s.ai}</p><p className="rounded-xl bg-[#E7F6F0] px-3 py-2"><b>사람이 확인할 일</b> · {s.human}</p></div>
              <div className="mt-auto flex items-start gap-2 border-t border-dashed border-slate-200 pt-4 text-[13px] font-bold"><FileText size={15} className="mt-0.5 shrink-0" /><span className="shrink-0">산출물</span><span className="text-[#2F6FDB]">{s.out}</span></div>
            </article>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl bg-[#F7F8FA] px-5 py-4 text-sm font-bold text-slate-600">
          <span className="text-[#2F6FDB]">전 과정 공통</span> 요구사항 추적표(RTM) · 변경 관리 · AI 산출물 검증 · 보안 수칙
        </div>

        {/* RACI */}
        <h3 className="mt-12 text-2xl font-black">11단계 역할 분담 (RACI)</h3>
        <p className="mt-2 text-sm text-slate-500">R 실행 · A 최종 책임 · C 협의 · I 통보 — 프로젝트에 맞게 조정하는 제안입니다.</p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-[#E8EDF3]">
          <table className="w-full min-w-[640px] text-center text-[14px]">
            <thead><tr className="border-b border-slate-300 text-slate-600">
              <th className="p-3 text-left">구간</th>
              {[['MPM Head', 'PM'], ['기획·분석', 'Planning/Design PL'], ['Development PM', '개발'], ['PMO', 'QA·검증'], ['고객', '']].map(([a, b]) => <th key={a} className="p-3"><b className="block text-slate-800">{a}</b><span className="text-xs font-normal text-slate-500">{b}</span></th>)}
            </tr></thead>
            <tbody>
              {raci.map((r) => (
                <tr key={r[0]} className="border-t border-[#E8EDF3]">
                  <td className="p-3 text-left font-bold">{r[0]}</td>
                  {r.slice(1).map((v, i) => <td key={i} className={`p-3 text-lg font-black ${v === 'A' ? 'bg-[#2F6FDB] text-white' : v === 'R' ? 'bg-[#EAF3FF] text-[#2F6FDB]' : 'text-slate-400'}`}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-500">소규모 팀은 한 사람이 여러 역할을 겸할 수 있습니다. 다만 문서를 만든 사람과 검증하는 사람은 가능하면 분리하고, Management PM은 전 구간에서 인력·업체 투입을 지원합니다.</p>
      </section>

      <Divider />

      {/* MMA */}
      <section id="mma" className="mx-auto max-w-[1160px] px-4 sm:px-6 py-12 sm:py-16">
        <SectionHead no="05" kicker="CHOCOLATE 1.0 · MMA" title="산출물을 블록으로: 초콜릿 1.0과 MMA" sub="MMA = Modular Monolithic Architecture. 모놀리식 구조를 유지하되 코드베이스를 모듈화해 독립성을 강화합니다. 공통은 모듈로 쌓고, 서비스는 꺼내 씁니다." tone="#F0EBFF" />

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map(([t, d, cloud], i) => (
              <div key={t} className="rounded-2xl border border-[#E8EDF3] bg-[#F7F8FA] p-4">
                <div className="flex items-center justify-between gap-2"><span className="font-black"><span className="mr-2 text-[#2F6FDB]">{String(i + 1).padStart(2, '0')}</span>{t}</span><span className="pill bg-white px-2 py-0.5 text-[11px] font-bold text-slate-500">{cloud}</span></div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{d}</p>
              </div>
            ))}
          </div>
          <div className="rounded-[18px] bg-[#2F6FDB] p-6 text-white flex flex-col">
            <p className="text-xs font-extrabold tracking-widest text-sky-200">PRODUCT</p>
            <h3 className="mt-2 text-3xl font-black">초콜릿 1.0</h3>
            <p className="mt-1 text-sm font-bold text-sky-100">구미에 맞게 꺼내 먹어요~</p>
            <p className="mt-4 text-[15px] leading-7">산출물 관리 방법을 체계화하고, 민간·공공 구축 결과물을 블록화해 제품 구성의 초석을 구축합니다.</p>
            <p className="mt-auto pt-6 text-5xl font-black">80%</p>
          </div>
        </div>

        {/* MMA diagram */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
          <div className="card p-5 sm:p-6">
            <p className="text-sm font-black text-slate-500">MMA 구성도</p>
            <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <div className="grid place-items-center rounded-xl border border-slate-300 px-4 py-6 text-sm font-bold">Client</div>
              <ArrowRight className="mx-auto shrink-0 rotate-90 text-slate-400 sm:rotate-0" size={18} />
              <div className="grid place-items-center rounded-xl border border-slate-300 px-4 py-5 text-center text-sm font-bold">Load<br />Balancer</div>
              <ArrowRight className="mx-auto shrink-0 rotate-90 text-slate-400 sm:rotate-0" size={18} />
              <div className="flex-1 rounded-2xl border-2 border-dashed border-[#2F6FDB] p-4">
                <p className="text-xs font-extrabold text-[#2F6FDB]">Modular Monolith (단일 배포)</p>
                <p className="mt-2 text-[11px] text-slate-500">Common Application</p>
                <div className="mt-1 grid grid-cols-2 gap-2">{['Login Module', 'Common Module'].map((m) => <div key={m} className="rounded-lg bg-[#2F6FDB] px-2 py-2 text-center text-[12px] font-bold text-white">{m}</div>)}</div>
                <p className="mt-3 text-[11px] text-slate-500">Service Modules</p>
                <div className="mt-1 grid grid-cols-2 gap-2">{['Payment', 'Course & Reservation', 'EV CSMS', 'SCMS (Car)'].map((m) => <div key={m} className="rounded-lg border border-[#6FA0F2] bg-[#EAF3FF] px-2 py-2 text-center text-[12px] font-bold">{m}</div>)}</div>
                <div className="mt-3 rounded-lg bg-slate-200 px-2 py-1.5 text-center text-[11px] font-bold text-slate-600">RDBMS · 모듈별 schema</div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm font-bold">
              <span className="text-[11px] font-extrabold tracking-widest text-slate-400">ARCHITECTURE DESIGN JOURNEY</span>
              <span className="pill border border-slate-300 px-3 py-1.5">Monolithic</span><ArrowRight size={14} className="text-[#2F6FDB]" />
              <span className="pill bg-[#2F6FDB] px-3 py-1.5 text-white">Modular Monolithic (MMA)</span><ArrowRight size={14} className="text-[#2F6FDB]" />
              <span className="pill border border-slate-300 px-3 py-1.5">Microservices</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Step by Step — 프로젝트를 병행하며 MMA를 고도화합니다.</p>
          </div>
          <div className="space-y-3">
            {[['장점', '모놀리식의 장점을 유지하면서 코드 구조의 재사용성과 유지보수성을 높입니다.', '#E7F6F0'], ['단점', 'MSA에 비해 독립 확장은 제한적이고, 의존성 관리가 복잡할 수 있습니다.', '#FFF1E8'], ['추천 사례', '초기에 MSA 도입이 과하다고 판단될 때, 조직이 독립 서비스 운영을 준비 중일 때.', '#EAF3FF']].map(([t, d, c]) => (
              <div key={t} className="rounded-2xl p-5" style={{ background: c }}><b>{t}</b><p className="mt-1 text-sm leading-6 text-slate-600">{d}</p></div>
            ))}
          </div>
        </div>

        {/* synthesis */}
        <h3 className="mt-12 text-2xl font-black">우리 팀의 일하는 방식도 MMA처럼</h3>
        <p className="mt-2 text-sm text-slate-500">초콜릿의 구조를 팀 운영에 그대로 옮깁니다.</p>
        <div className="mt-4 space-y-3">
          {synth.map(([a, b, c, d]) => (
            <div key={a} className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1.4fr]">
              <div className="card p-4"><b>{a}</b><p className="text-sm text-slate-500">{b}</p></div>
              <ArrowRight className="mx-auto self-center rotate-90 text-[#2F6FDB] md:rotate-0" size={20} />
              <div className="rounded-[18px] bg-[#EAF3FF] p-4"><b className="text-[#2F6FDB]">{c}</b><p className="text-sm leading-6">{d}</p></div>
            </div>
          ))}
        </div>

        {/* IA */}
        <h3 className="mt-12 text-2xl font-black">관리자 IA도 블록 조립</h3>
        <p className="mt-2 text-sm text-slate-500">공통(필수) 위에 서비스 영역을 선택해 얹습니다.</p>
        <div className="mt-4 space-y-3">
          <div className="grid items-center gap-3 md:grid-cols-[170px_1fr]"><div><b className="text-[#2F6FDB]">공통 (필수)</b><p className="text-xs text-slate-500">As-Is Admin Common</p></div><div className="flex flex-wrap gap-2">{['로그인', '관제·대시보드', '회원 공통', '관리자 권한 관리', '게시판', '메뉴·권한 관리'].map((x) => <span key={x} className="rounded-xl bg-[#2F6FDB] px-3.5 py-2 text-[13px] font-bold text-white">{x}</span>)}</div></div>
          <hr className="border-[#E8EDF3]" />
          <div className="grid items-center gap-3 md:grid-cols-[170px_1fr]"><div><b className="text-[#2F6FDB]">공통 고도화</b><p className="text-xs text-slate-500">To-Be · V2X 사업 개발 이후</p></div><div className="flex flex-wrap gap-2">{['공통 코드 관리', '메뉴 생성 (추가·수정·삭제)'].map((x) => <span key={x} className="rounded-xl border-2 border-dashed border-[#2F6FDB] bg-[#EAF3FF] px-3.5 py-2 text-[13px] font-bold">{x}</span>)}</div></div>
          <hr className="border-[#E8EDF3]" />
          <div className="grid gap-3 md:grid-cols-[170px_1fr]"><div><b className="text-[#2F6FDB]">서비스 영역 (선택)</b><p className="text-xs text-slate-500">Custom Service Area</p></div>
            <div className="grid gap-3 sm:grid-cols-3">{[['영역 1 · 차량·주차장 서비스', ['차량 관리', '주차장 관리']], ['영역 2 · EV 충전 서비스', ['충전기 관리·원격 제어', '충전소 관리·운영 내역', '프로모션 관리', '충전 현황 대시보드']], ['영역 3 · V2X 인증서 서비스', ['대시보드', '단말기 등록·현황 조회', '인증서 발급 현황 (등록·인가·연간)']]].map(([t, items]) => <div key={t as string} className="rounded-2xl bg-[#F7F8FA] p-4"><b className="text-[#2F6FDB]">{t as string}</b><ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-600">{(items as string[]).map((i) => <li key={i}>{i}</li>)}</ul></div>)}</div></div>
        </div>
      </section>

      <Divider />

      {/* PM work */}
      <section id="work" className="mx-auto max-w-[1160px] px-4 sm:px-6 py-12 sm:py-16">
        <SectionHead no="06" kicker="PM'S WORK" title="PM의 일: 3대 역량과 추적표" sub="문제해결·커뮤니케이션·일정관리는 그대로, 일하는 방식이 달라집니다. 그 중심에 요구사항 추적표(RTM)가 있습니다." tone="#FFF1E8" />
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#E8EDF3]">
          <div className="hidden grid-cols-[170px_1fr_1.2fr] bg-[#F7F8FA] px-5 py-3 text-xs font-extrabold text-slate-500 md:grid"><span>역량</span><span>지금까지의 PM</span><span className="text-[#2F6FDB]">AI AX PM</span></div>
          {[
            ['문제 해결', 'Project 문제를 정의하고, 데이터 분석으로 인사이트를 도출해 해결 방법을 제시한다', 'AI로 과업지시서에서 요구사항을 근거 쪽수와 함께 추출하고, PM이 원문과 대조해 문제를 확정한다'],
            ['커뮤니케이션', '기획·디자인·개발·마케터 등 이해관계자가 납득하는 소통과 합리적인 우선순위를 정립한다', 'AI가 질의서·회의록을 정리하고, 고객 확인과 우선순위 결정은 PM이 직접 수행한다'],
            ['일정관리', '스케줄을 짜고, 도중에 발생하는 문제를 유관부서와 소통하며 원만히 해결한다', '1단계에서 산출물 목록을 확정하고, 단계마다 완료 체크리스트로 일정과 품질을 함께 관리한다'],
          ].map(([a, b, c]) => (
            <div key={a} className="grid gap-2 border-t border-[#E8EDF3] px-5 py-4 md:grid-cols-[170px_1fr_1.2fr] md:gap-4"><b className="text-lg">{a}</b><p className="text-[14px] leading-6 text-slate-600">{b}</p><p className="rounded-xl bg-[#EAF3FF] px-3 py-2 text-[14px] leading-6 font-medium">{c}</p></div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[['리더십 UP', '일련의 과정을 직접 알고 팀원과 유관부서에 신속·정확하게 전달한다', '11단계 전 과정을 한 장 프로세스로 설명하고 이끈다'], ['개발 이해 UP', 'IT 제품·서비스의 개발 지식을 갖추고 Project를 더 깊이 이해한다', 'AI가 만든 설계·코드를 MMA·API·ERD 관점으로 읽고 리뷰한다'], ['커뮤니케이션 UP', '고객·외주·유관부서·개발팀의 시간을 절약하는 소통과 융합을 이끈다', '근거가 붙은 질의서와 고객협의결과서로 소통한다']].map(([t, v, a]) => (
            <article key={t} className="card p-6"><h3 className="text-xl font-black text-[#2F6FDB]">{t}</h3><p className="mt-3 text-[11px] font-extrabold text-slate-400">TEAM VISION</p><p className="text-[15px] leading-7 text-slate-600">{v}</p><p className="mt-3 border-t border-dashed border-slate-200 pt-3 text-[11px] font-extrabold text-[#2F6FDB]">AI AX로 실천</p><p className="text-[15px] leading-7">{a}</p></article>
          ))}
        </div>

        <article className="card mt-6 p-6">
          <h3 className="text-xl font-black">요구사항 추적표 (RTM)</h3>
          <p className="mt-1 text-sm text-slate-500">‘고객이 요청한 것이 하나도 빠지지 않았다’는 증거가 되는 표입니다. 3단계(SRS)에서 처음 만들고, 단계가 끝날 때마다 해당 열을 채웁니다.</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">{['요구사항', 'SRS', '설계', '개발', '테스트'].map((x, i) => <React.Fragment key={x}><span className="rounded-lg bg-[#2F6FDB] px-3 py-1.5 text-sm font-bold text-white">{x}</span>{i < 4 && <ChevronRight size={16} className="text-slate-400" />}</React.Fragment>)}</div>
          <div className="mt-4 overflow-x-auto rounded-xl bg-[#F7F8FA] p-3 text-[13px]">
            <table className="w-full min-w-[620px] text-left"><thead><tr className="text-slate-500"><th className="p-2">번호</th><th className="p-2">요구 내용</th><th className="p-2">출처</th><th className="p-2">SRS · 설계 · 테스트</th><th className="p-2">상태</th></tr></thead>
              <tbody>
                {[['REQ-001', '관리자 로그인', '과업지시서 P.12', 'SRS-3.1 · 화면 A-01 · TC-001', '완료'], ['REQ-002', '전자정부 프레임워크 4.0 적용', '과업지시서 P.30', 'SRS-5.2 · 아키텍처 3장 · TC-045', '진행'], ['REQ-003', '동시 접속 500명 처리', '과업지시서 P.31', 'SRS-5.4 · 아키텍처 4장 · TC-060', '예정']].map((r) => (
                  <tr key={r[0]} className="border-t border-white bg-white"><td className="p-2 font-bold text-[#2F6FDB]">{r[0]}</td><td className="p-2">{r[1]}</td><td className="p-2">{r[2]}</td><td className="p-2">{r[3]}</td><td className={`p-2 font-bold ${r[4] === '완료' ? 'text-[#1E8A68]' : 'text-slate-500'}`}>{r[4]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 grid gap-1 text-sm text-slate-600 sm:grid-cols-2"><li>• 누락된 요구를 바로 찾는다</li><li>• 변경 시 영향 범위를 안다</li><li>• 준공 때 ‘모두 구현·검증’의 근거</li><li>• PMO가 항상 최신으로 유지</li></ul>
          <p className="mt-6 text-sm font-black text-[#2F6FDB]">요구가 바뀌면</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold">{['변경 요청 접수', '영향 분석 (일정·비용·범위)', '고객 승인', '문서·소스 수정', 'RTM·테스트 갱신'].map((x, i) => <React.Fragment key={x}><span className="rounded-xl bg-[#EAF3FF] px-3 py-2">{x}</span>{i < 4 && <ChevronRight size={16} className="text-[#2F6FDB]" />}</React.Fragment>)}</div>
        </article>
      </section>

      <Divider />

      {/* Quality */}
      <section id="quality" className="mx-auto max-w-[1160px] px-4 sm:px-6 py-12 sm:py-16">
        <SectionHead no="07" kicker="QUALITY & SECURITY" title="믿되 검증한다" sub="AI의 결과는 그럴듯해 보여도 틀릴 수 있습니다. 검증 5가지와 AI 사용 전 보안 수칙 4가지를 지킵니다. 특히 공공 사업은 자료를 외부 AI에 올리는 것 자체가 제한될 수 있습니다." tone="#E7F6F0" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div><div className="mb-3 flex items-center gap-2 font-black"><ClipboardCheck className="text-[#1E8A68]" /> AI 결과물 검증 5가지</div><div className="space-y-3">{checks.map(([t, d], i) => <div key={t} className="card flex items-start gap-4 p-5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#E7F6F0] text-sm font-black text-[#1E8A68]">{i + 1}</span><div><b>{t}</b><p className="mt-1 text-sm leading-6 text-slate-600">{d}</p></div></div>)}</div></div>
          <div><div className="mb-3 flex items-center gap-2 font-black"><ShieldCheck className="text-[#2F6FDB]" /> AI 사용 전 보안 수칙 4가지</div><div className="space-y-3">{security.map(([t, d], i) => <div key={t} className="card flex items-start gap-4 p-5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#EAF3FF] text-sm font-black text-[#2F6FDB]">{i + 1}</span><div><b>{t}</b><p className="mt-1 text-sm leading-6 text-slate-600">{d}</p></div></div>)}</div></div>
        </div>
        <div className="mt-4 flex flex-col gap-3 rounded-[18px] bg-[#EAF3FF] p-5 sm:flex-row sm:items-center"><Lock className="shrink-0 text-[#2F6FDB]" /><p className="text-[15px] leading-7 font-bold">역할 · <span className="text-[#2F6FDB]">정보보안 책임자는 AI 사용 전 보안 수칙을 감독하고, PMO는 표준 프롬프트·양식·체크리스트와 RTM·변경 관리를 운영합니다. 만든 사람과 검증하는 사람은 가능하면 분리합니다.</span></p></div>
      </section>

      <Divider />

      {/* Roadmap */}
      <section id="roadmap" className="mx-auto max-w-[1160px] px-4 sm:px-6 py-12 sm:py-16">
        <SectionHead no="08" kicker="ROADMAP & PROMISES" title="함께 만드는 AX 로드맵" sub="진단 → 표준화 → 확산, 프로젝트를 병행하며 단계적으로 갑니다. 일정은 오늘 논의 후 확정합니다." tone="#F0EBFF" />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            ['STEP 1', '#EAF3FF', '진단', 'Start Mission', ['유관부서의 현재 과업 진행 방법을 진단한다', '11단계 기준으로 현재 수준과 차이를 확인한다', 'AI 사용 현황과 고객별 보안 조건을 점검한다']],
            ['STEP 2', '#E7F6F0', '표준화', '프로세스 개선', ['진단 결과에 따라 진행 프로세스를 개선한다', '공통 모듈 구축: 프롬프트·문서 양식·RTM 템플릿', '시범 프로젝트 1건에 11단계를 적용한다']],
            ['STEP 3', '#F0EBFF', '확산·고도화', 'Future Mission', ['기획·디자인·개발 유관부서와 협업 방향을 확정한다', '외주 개발사·프리랜서 그룹까지 표준을 연계한다', '프로젝트를 병행하며 표준과 MMA를 고도화한다']],
          ].map(([s, c, t, lead, items]) => (
            <article key={s as string} className="card p-6"><span className="pill px-3 py-1 text-xs font-extrabold" style={{ background: c as string }}>{s}</span><h3 className="mt-4 text-2xl font-black">{t}</h3><p className="mt-1 text-sm font-bold text-slate-500">{lead}</p><ul className="mt-3 space-y-2 text-[15px] leading-7 text-slate-600">{(items as string[]).map((i) => <li key={i} className="flex gap-2"><CheckDot />{i}</li>)}</ul></article>
          ))}
        </div>
        <div className="mt-4 rounded-[18px] bg-[#1E293B] p-6 text-white"><p className="text-xs font-extrabold tracking-widest text-sky-300">FUTURE MISSION</p><p className="mt-3 text-[18px] leading-8 font-bold">개발 산출물을 활용해 모빌리티 서비스에 장기적·지속적으로 가치를 제공합니다.</p></div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <div className="card p-6 sm:p-7"><p className="section-label text-[#64748B]">OUR PROMISES</p><h3 className="mt-3 text-[26px] font-black">AI AX PM, 우리의 5가지 약속</h3>
            <ol className="mt-5 space-y-4">{[['AI는 초안, 확인과 결정은 사람', '근거 쪽수를 받아 원문과 대조한다'], ['모든 요구는 번호와 근거를 갖는다', 'REQ 번호로 RTM까지 연결한다'], ['보안 수칙을 먼저 확인한다', '외부 AI에 올리기 전 계약·자료·도구·기록을 점검한다'], ['공통은 모듈로, 프로젝트는 꺼내 쓴다', '팀 표준 프롬프트·양식·템플릿을 함께 쓰고 키운다 (MMA)'], ['만든 사람과 검증하는 사람을 분리한다', '서로의 산출물을 교차 검토한다']].map(([t, d], i) => <li key={t} className="flex gap-3 border-b border-dashed border-slate-200 pb-4 last:border-0 last:pb-0"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#EAF3FF] text-sm font-black text-[#2F6FDB]">{i + 1}</span><span><b className="block leading-6">{t}</b><span className="text-sm text-slate-500">{d}</span></span></li>)}</ol></div>
          <div className="rounded-[18px] bg-[#EAF3FF] p-6 sm:p-7"><div className="flex items-center gap-2 font-black"><MessageSquare className="text-[#2F6FDB]" /> 오늘 함께 정할 것</div><div className="mt-5 space-y-4">{[['Q1', '시범 적용할 프로젝트는 무엇으로 할까요?'], ['Q2', '표준 프롬프트·양식을 관리할 담당(PMO)은 누구로 할까요?'], ['Q3', '로드맵 일정과 점검 주기는 어떻게 할까요?']].map(([q, t]) => <div key={q} className="rounded-2xl bg-white p-4 shadow-sm"><span className="text-xs font-black text-[#2F6FDB]">{q}</span><p className="mt-1 font-bold leading-6">{t}</p></div>)}</div></div>
        </div>
      </section>

      <footer className="border-t border-[#E8EDF3] bg-[#F7F8FA]">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-12 text-center">
          <p className="text-xs font-extrabold tracking-[0.18em] text-[#64748B]">THANK YOU</p>
          <h2 className="mt-3 text-[clamp(28px,5vw,44px)] font-black">감사합니다 — Q&amp;A</h2>
          <p className="mt-3 text-[17px] font-bold text-[#2F6FDB]">AI로 빠르게 만들고, PM이 끝까지 책임집니다.</p>
        </div>
      </footer>

      {showTop && <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="no-print fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#1E293B] px-4 py-3 text-sm font-bold text-white shadow-xl hover:bg-black" aria-label="맨 위로 이동"><ArrowUp size={16} /> 맨 위로</button>}
    </div>
  );
}

function CheckDot() {
  return <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2F6FDB]" />;
}
