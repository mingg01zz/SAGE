// index.html 전용: 10개 단위 페이지네이션
function renderFacilityPagination(total, page, perPage) {
  const pagDiv = document.getElementById('facilityPagination');
  if (!pagDiv) return;
  const totalPages = Math.ceil(total / perPage);
  let html = '';
  const groupSize = 10;
  const maxPage = 30;
  const lastPage = Math.min(totalPages, maxPage);
  const groupStart = Math.floor((page - 1) / groupSize) * groupSize + 1;
  const groupEnd = Math.min(groupStart + groupSize - 1, lastPage);
  if (groupStart > 1) {
    html += `<a href="#" class="page-prev-group" data-page="${groupStart - 1}">&lt;</a>`;
  }
  for (let i = groupStart; i <= groupEnd; i++) {
    html += `<a href="#" class="${i === page ? 'active' : ''}" data-page="${i}">${i}</a>`;
  }
  if (groupEnd < lastPage) {
    html += `<a href="#" class="page-next-group" data-page="${groupEnd + 1}">&gt;</a>`;
  }
  pagDiv.innerHTML = html;
  // 이벤트 바인딩
  pagDiv.querySelectorAll('a[data-page]').forEach(a => {
    a.onclick = function(e) {
      e.preventDefault();
      this.blur(); // 클릭 후 포커스 해제해서 스크롤 튐 방지
      renderFacilitiesTablePaged(currentFacilityList, parseInt(this.dataset.page), perPage);
    };
  });
}

// index.html 전용: 페이징된 표 렌더링
let currentFacilityList = [];
function renderFacilitiesTablePaged(list, page=1, perPage=10) {
  currentFacilityList = list;
  const startIdx = (page-1)*perPage;
  const pageList = list.slice(startIdx, startIdx+perPage);
  renderFacilitiesTable(pageList);
  renderFacilityPagination(list.length, page, perPage);
}

// index.html에 실제로 적혀있는 3개 시설 정보만 사용
// const baseFacilities = [...]; // 이미 index.html에 직접 작성되어 있으므로 js에서는 사용하지 않음
// const facilities = Array.from({length: 300}, ...); // 이 부분 전체 제거
// renderFacilitiesTablePaged(facilities, 1, 10); // 이 부분도 제거

// 아래 함수들은 남겨두되, 자동 실행/랜덤 데이터 생성 부분만 제거

// 전국 시/도, 구/군, 동 최대한 많이 포함
const regionData = {
  '서울': {
    '강남구': ['삼성동', '청담동', '역삼동', '신사동', '논현동', '도곡동', '압구정동', '개포동'],
    '서초구': ['서초동', '방배동', '양재동', '잠원동'],
    '송파구': ['잠실동', '문정동', '가락동', '방이동', '신천동'],
    '강동구': ['천호동', '길동', '둔촌동', '상일동', '명일동'],
    '마포구': ['공덕동', '합정동', '망원동', '상암동'],
    '용산구': ['이태원동', '한남동', '청파동', '원효로동'],
    '종로구': ['청운동', '부암동', '평창동', '삼청동'],
    '중구': ['명동', '을지로동', '신당동', '필동'],
    '노원구': ['상계동', '중계동', '하계동'],
    '은평구': ['불광동', '녹번동', '진관동'],
    '동작구': ['노량진동', '상도동', '사당동'],
    '관악구': ['봉천동', '신림동'],
    '구로구': ['구로동', '고척동', '개봉동'],
    '금천구': ['가산동', '독산동'],
    '영등포구': ['여의도동', '영등포동', '신길동'],
    '강서구': ['화곡동', '등촌동', '방화동'],
    '양천구': ['목동', '신정동', '신월동'],
    '서대문구': ['홍은동', '북가좌동', '남가좌동'],
    '성동구': ['성수동', '행당동', '금호동'],
    '성북구': ['돈암동', '정릉동', '길음동'],
    '동대문구': ['회기동', '휘경동', '이문동'],
    '중랑구': ['면목동', '상봉동', '중화동'],
    '강북구': ['미아동', '번동', '수유동'],
    '도봉구': ['창동', '방학동', '도봉동']
  },
  '경기도': {
    '수원시': ['영통구', '장안구', '팔달구', '권선구'],
    '성남시': ['분당구', '수정구', '중원구'],
    '고양시': ['일산동구', '일산서구', '덕양구'],
    '용인시': ['수지구', '기흥구', '처인구'],
    '부천시': ['중동', '상동', '소사동'],
    '안양시': ['만안구', '동안구'],
    '안산시': ['상록구', '단원구'],
    '평택시': ['비전동', '서정동', '동삭동'],
    '의정부시': ['의정부동', '신곡동', '호원동'],
    '파주시': ['금촌동', '문산읍', '운정동'],
    '김포시': ['사우동', '장기동', '구래동'],
    '광명시': ['광명동', '철산동', '하안동'],
    '하남시': ['신장동', '덕풍동', '미사동'],
    '오산시': ['오산동', '금암동'],
    '이천시': ['창전동', '증포동'],
    '안성시': ['봉산동', '공도읍'],
    '양주시': ['고읍동', '덕정동'],
    '구리시': ['수택동', '인창동'],
    '남양주시': ['다산동', '별내동', '화도읍'],
    '시흥시': ['정왕동', '신천동'],
    '군포시': ['산본동', '금정동'],
    '의왕시': ['내손동', '포일동'],
    '여주시': ['홍문동', '여흥동'],
    '양평군': ['양평읍', '옥천면'],
    '가평군': ['가평읍', '청평면'],
    '연천군': ['전곡읍', '연천읍']
  },
  '인천': {
    '남동구': ['구월동', '간석동', '논현동'],
    '부평구': ['부평동', '삼산동', '십정동'],
    '연수구': ['송도동', '연수동', '옥련동'],
    '서구': ['청라동', '가정동', '검암동'],
    '미추홀구': ['주안동', '관교동', '용현동'],
    '동구': ['송현동', '화수동'],
    '계양구': ['계산동', '작전동'],
    '강화군': ['강화읍', '길상면'],
    '옹진군': ['영흥면', '북도면']
  },
  '부산': {
    '해운대구': ['좌동', '중동', '우동'],
    '수영구': ['광안동', '남천동'],
    '부산진구': ['부전동', '범천동', '양정동'],
    '동래구': ['온천동', '사직동', '명륜동'],
    '남구': ['대연동', '문현동'],
    '북구': ['구포동', '화명동'],
    '사하구': ['하단동', '신평동'],
    '금정구': ['장전동', '구서동'],
    '연제구': ['연산동'],
    '중구': ['중앙동', '동광동'],
    '서구': ['동대신동', '서대신동'],
    '동구': ['초량동', '좌천동'],
    '영도구': ['청학동', '동삼동'],
    '강서구': ['명지동', '대저동'],
    '기장군': ['기장읍', '정관읍']
  },
  '대구': {
    '중구': ['동인동', '삼덕동', '남산동'],
    '동구': ['신암동', '신천동'],
    '서구': ['평리동', '내당동'],
    '남구': ['대명동', '봉덕동'],
    '북구': ['산격동', '복현동'],
    '수성구': ['범어동', '만촌동', '수성동'],
    '달서구': ['성당동', '이곡동'],
    '달성군': ['화원읍', '논공읍']
  },
  '광주': {
    '동구': ['계림동', '산수동'],
    '서구': ['치평동', '화정동'],
    '남구': ['봉선동', '주월동'],
    '북구': ['운암동', '문흥동'],
    '광산구': ['수완동', '신가동']
  },
  '대전': {
    '서구': ['둔산동', '탄방동', '월평동'],
    '유성구': ['봉명동', '장대동', '구암동'],
    '동구': ['가양동', '용전동'],
    '중구': ['은행동', '대흥동'],
    '대덕구': ['비래동', '송촌동']
  },
  '울산': {
    '남구': ['삼산동', '달동', '무거동'],
    '중구': ['학성동', '반구동'],
    '동구': ['전하동', '화정동'],
    '북구': ['화봉동', '송정동'],
    '울주군': ['범서읍', '온산읍']
  },
  '세종': {
    '세종시': ['고운동', '아름동', '종촌동', '도담동', '한솔동', '새롬동', '다정동', '보람동', '소담동', '반곡동']
  },
  '강원도': {
    '춘천시': ['효자동', '석사동', '퇴계동'],
    '원주시': ['무실동', '단구동', '명륜동'],
    '강릉시': ['교동', '포남동'],
    '동해시': ['천곡동', '송정동'],
    '속초시': ['교동', '노학동'],
    '삼척시': ['정상동', '도계읍'],
    '홍천군': ['홍천읍', '화촌면'],
    '횡성군': ['횡성읍', '우천면']
  },
  '충북': {
    '청주시': ['상당구', '서원구', '흥덕구', '청원구'],
    '충주시': ['성내동', '문화동'],
    '제천시': ['의림동', '장락동'],
    '보은군': ['보은읍', '속리산면'],
    '옥천군': ['옥천읍', '동이면'],
    '영동군': ['영동읍', '황간면']
  },
  '충남': {
    '천안시': ['동남구', '서북구'],
    '공주시': ['신관동', '중학동'],
    '보령시': ['대천동', '동대동'],
    '아산시': ['온양동', '배방읍'],
    '서산시': ['동문동', '석림동'],
    '논산시': ['취암동', '강경읍'],
    '계룡시': ['금암동', '두마면'],
    '당진시': ['읍내동', '송악읍'],
    '금산군': ['금산읍', '진산면'],
    '부여군': ['부여읍', '규암면'],
    '서천군': ['장항읍', '서천읍'],
    '청양군': ['청양읍', '정산면'],
    '홍성군': ['홍성읍', '광천읍'],
    '예산군': ['예산읍', '삽교읍'],
    '태안군': ['태안읍', '안면읍']
  },
  '전북': {
    '전주시': ['완산구', '덕진구'],
    '군산시': ['나운동', '수송동'],
    '익산시': ['영등동', '모현동'],
    '정읍시': ['수성동', '시기동'],
    '남원시': ['도통동', '금동'],
    '김제시': ['요촌동', '신풍동'],
    '완주군': ['삼례읍', '봉동읍'],
    '진안군': ['진안읍', '마령면'],
    '무주군': ['무주읍', '설천면'],
    '장수군': ['장수읍', '산서면'],
    '임실군': ['임실읍', '관촌면'],
    '순창군': ['순창읍', '인계면'],
    '고창군': ['고창읍', '흥덕면'],
    '부안군': ['부안읍', '행안면']
  },
  '전남': {
    '목포시': ['상동', '하당동'],
    '여수시': ['여서동', '문수동'],
    '순천시': ['조례동', '연향동'],
    '나주시': ['송월동', '빛가람동'],
    '광양시': ['중동', '광영동'],
    '담양군': ['담양읍', '봉산면'],
    '곡성군': ['곡성읍', '오곡면'],
    '구례군': ['구례읍', '마산면'],
    '고흥군': ['고흥읍', '도양읍'],
    '보성군': ['보성읍', '벌교읍'],
    '화순군': ['화순읍', '능주면'],
    '장흥군': ['장흥읍', '용산면'],
    '강진군': ['강진읍', '군동면'],
    '해남군': ['해남읍', '삼산면'],
    '영암군': ['영암읍', '삼호읍'],
    '무안군': ['무안읍', '삼향읍'],
    '함평군': ['함평읍', '손불면'],
    '영광군': ['영광읍', '홍농읍'],
    '장성군': ['장성읍', '삼계면'],
    '완도군': ['완도읍', '금일읍'],
    '진도군': ['진도읍', '군내면'],
    '신안군': ['압해읍', '암태면']
  },
  '경북': {
    '포항시': ['남구', '북구'],
    '경주시': ['황성동', '용강동'],
    '김천시': ['신음동', '율곡동'],
    '안동시': ['옥동', '용상동'],
    '구미시': ['송정동', '인동동'],
    '영주시': ['영주동', '휴천동'],
    '영천시': ['금호읍', '화남면'],
    '상주시': ['남원동', '계림동'],
    '문경시': ['모전동', '점촌동'],
    '경산시': ['중방동', '정평동'],
    '군위군': ['군위읍', '의흥면'],
    '의성군': ['의성읍', '봉양면'],
    '청송군': ['청송읍', '진보면'],
    '영양군': ['영양읍', '입암면'],
    '영덕군': ['영덕읍', '강구면'],
    '청도군': ['청도읍', '화양읍'],
    '고령군': ['대가야읍', '쌍림면'],
    '성주군': ['성주읍', '선남면'],
    '칠곡군': ['왜관읍', '북삼읍'],
    '예천군': ['예천읍', '용문면'],
    '봉화군': ['봉화읍', '물야면'],
    '울진군': ['울진읍', '평해읍'],
    '울릉군': ['울릉읍', '서면']
  },
  '경남': {
    '창원시': ['의창구', '성산구', '마산합포구', '마산회원구', '진해구'],
    '진주시': ['상봉동', '평거동'],
    '통영시': ['무전동', '정량동'],
    '사천시': ['벌리동', '사천읍'],
    '김해시': ['삼계동', '장유동'],
    '밀양시': ['삼문동', '내이동'],
    '거제시': ['고현동', '장평동'],
    '양산시': ['중부동', '삼호동'],
    '의령군': ['의령읍', '부림면'],
    '함안군': ['가야읍', '칠서면'],
    '창녕군': ['창녕읍', '남지읍'],
    '고성군': ['고성읍', '회화면'],
    '남해군': ['남해읍', '이동면'],
    '하동군': ['하동읍', '화개면'],
    '산청군': ['산청읍', '신안면'],
    '함양군': ['함양읍', '안의면'],
    '거창군': ['거창읍', '아림동'],
    '합천군': ['합천읍', '야로면']
  },
  '제주': {
    '제주시': ['이도동', '노형동', '삼도동', '아라동'],
    '서귀포시': ['중문동', '서귀동', '대정읍', '남원읍']
  }
};

function renderFacilities(list) {
  const container = document.getElementById('facilityList');
  container.innerHTML = '';
  list.forEach(fac => {
    container.innerHTML += `
      <div class="facility-card">
        <img src="${fac.image}" alt="${fac.name}">
        <div class="facility-info">
          <h3>${fac.name}</h3>
          <div class="address">${fac.address}</div>
          <div class="phone">${fac.phone}</div>
          <button onclick="location.href='detail.html?id=${fac.id}'">상세보기</button>
          <button onclick="addToCompare(${fac.id})">비교담기</button>
        </div>
      </div>
    `;
  });
}

function searchFacility() {
  const keyword = document.getElementById('search').value;
  const filtered = facilities.filter(f => f.name.includes(keyword) || f.address.includes(keyword));
  renderFacilities(filtered);
}

function setSidoOptions() {
  const sidoSelect = document.getElementById('sidoSelect');
  sidoSelect.innerHTML = '<option>전체</option>';
  Object.keys(regionData).forEach(sido => {
    const opt = document.createElement('option');
    opt.value = sido;
    opt.textContent = sido;
    sidoSelect.appendChild(opt);
  });
}

function setGugunOptions() {
  const sido = document.getElementById('sidoSelect').value;
  const gugunSelect = document.getElementById('gugunSelect');
  gugunSelect.innerHTML = '<option>전체</option>';
  if(regionData[sido]) {
    Object.keys(regionData[sido]).forEach(gugun => {
      const opt = document.createElement('option');
      opt.value = gugun;
      opt.textContent = gugun;
      gugunSelect.appendChild(opt);
    });
  }
}

function setDongOptions() {
  const sido = document.getElementById('sidoSelect').value;
  const gugun = document.getElementById('gugunSelect').value;
  const dongSelect = document.getElementById('dongSelect');
  dongSelect.innerHTML = '<option>전체</option>';
  if(regionData[sido] && regionData[sido][gugun]) {
    regionData[sido][gugun].forEach(dong => {
      const opt = document.createElement('option');
      opt.value = dong;
      opt.textContent = dong;
      dongSelect.appendChild(opt);
    });
  }
}

// main-card-row 모바일 슬라이더 기능
function updateMainCardSlider(idx) {
  const cards = document.querySelectorAll('#mainCardRow .main-card');
  cards.forEach((card, i) => {
    card.classList.remove('active', 'prev', 'next');
    if (i === idx) card.classList.add('active');
    else if (i === idx - 1) card.classList.add('prev');
    else if (i === idx + 1) card.classList.add('next');
  });
  // 화살표 비활성화 처리
  if (window.innerWidth <= 768) {
    mainCardPrevBtn.disabled = (idx === 0);
    mainCardNextBtn.disabled = (idx === cards.length - 1);
  } else {
    mainCardPrevBtn.disabled = false;
    mainCardNextBtn.disabled = false;
  }
}

let mainCardCurrentIdx = 0;
function mainCardSliderGo(dir) {
  const cards = document.querySelectorAll('#mainCardRow .main-card');
  if (!cards.length) return;
  mainCardCurrentIdx += dir;
  if (mainCardCurrentIdx < 0) mainCardCurrentIdx = 0;
  if (mainCardCurrentIdx > cards.length - 1) mainCardCurrentIdx = cards.length - 1;
  updateMainCardSlider(mainCardCurrentIdx);
}

const mainCardPrevBtn = document.getElementById('mainCardPrevBtn');
const mainCardNextBtn = document.getElementById('mainCardNextBtn');
if (mainCardPrevBtn && mainCardNextBtn) {
  mainCardPrevBtn.onclick = function() { mainCardSliderGo(-1); };
  mainCardNextBtn.onclick = function() { mainCardSliderGo(1); };
}

// 초기화 및 리사이즈 대응
function mainCardSliderInit() {
  if (window.innerWidth <= 768) {
    updateMainCardSlider(mainCardCurrentIdx);
  } else {
    // PC에서는 모든 카드 보이게
    const cards = document.querySelectorAll('#mainCardRow .main-card');
    cards.forEach(card => card.classList.remove('active', 'prev', 'next'));
    mainCardPrevBtn.disabled = false;
    mainCardNextBtn.disabled = false;
    mainCardCurrentIdx = 0;
  }
}
window.addEventListener('resize', mainCardSliderInit);
document.addEventListener('DOMContentLoaded', mainCardSliderInit);

// pick-card-v3 슬라이드 (화살표 클릭 시 scrollLeft 이동)
document.addEventListener('DOMContentLoaded', function() {
  const pickList = document.getElementById('mainPickListV3');
  const prevBtn = document.getElementById('mainPickPrevBtn');
  const nextBtn = document.getElementById('mainPickNextBtn');
  if (pickList && prevBtn && nextBtn) {
    prevBtn.onclick = function() {
      pickList.scrollBy({ left: -320, behavior: 'smooth' });
    };
    nextBtn.onclick = function() {
      pickList.scrollBy({ left: 320, behavior: 'smooth' });
    };
  }
});

// 표 형태로 요양원 목록 렌더링 (index.html용)
function renderFacilitiesTable(list) {
  const container = document.getElementById('facilityList');
  if (!container) return;
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = '<tr><td colspan="5">해당 지역의 요양원이 없습니다.</td></tr>';
    return;
  }
  list.forEach(fac => {
    container.innerHTML += `
      <tr class="facility-row">
        <td><a href="detail.html">${fac.name}</a></td>
        <td>${fac.address}</td>
        <td>${fac.type || '노인요양'}</td>
        <td>${fac.capacity || '-'}</td>
        <td>${fac.phone}</td>
      </tr>
    `;
  });
}

// 기존 renderFacilitiesTable을 index.html에서만 사용하도록 분리
// SVG 지도 인터랙션 및 지역별 요양원 필터링 (index.html에서만 동작)
document.addEventListener('DOMContentLoaded', function() {
  const obj = document.getElementById('svgMapObj');
  const facilityList = document.getElementById('facilityList');
  if (obj && facilityList) {
    obj.addEventListener('load', function() {
      const svgDoc = obj.contentDocument;
      if (!svgDoc) return;
      const paths = svgDoc.querySelectorAll('path');
      let activePath = null;
      paths.forEach(function(path) {
        path.style.transition = 'fill 0.18s';
        path.addEventListener('mouseenter', function() {
          path.classList.add('svg-region-hover');
        });
        path.addEventListener('mouseleave', function() {
          path.classList.remove('svg-region-hover');
        });
        path.addEventListener('click', function() {
          if (activePath) activePath.classList.remove('svg-region-active');
          path.classList.add('svg-region-active');
          activePath = path;
          // 지역명 추출 (SVG path의 name 속성)
          const regionName = path.getAttribute('name');
          filterFacilitiesByRegionTable(regionName);
        });
      });
    });
    // 페이지 진입 시 전체 요양원 표로 렌더링 (10개 단위)
    renderFacilitiesTablePaged(facilities, 1, 10);
  }
});

// 표 필터링용 함수 (index.html)
function filterFacilitiesByRegionTable(regionName) {
  const regionMap = {
    '서울': '서울',
    '경기도': '경기',
    '강원도': '강원',
    '경상도': ['경기', '강원', '대구', '울산', '부산'],
    '전라도': ['전남', '광주', '전북', '충남', '충북'],
    '충청도': ['충북', '충남', '대전', '세종', '충남'],
    '인천': '인천',
    '대전': '대전',
    '대구': '대구',
    '울산': '울산',
    '부산': '부산',
    '제주도': '제주'
  };
  const korRegion = regionMap[regionName] || regionName;
  const filtered = facilities.filter(fac => fac.address.includes(korRegion));
  renderFacilitiesTablePaged(filtered.length ? filtered : facilities, 1, 10);
}

window.onload = () => renderFacilities(facilities); 

document.addEventListener('DOMContentLoaded', function() {
  // 정렬 버튼
  const sortBtns = document.querySelectorAll('.facility-sort-btn');
  sortBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      sortBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // 지역 선택 (체크박스)
  const regionCheckboxes = document.querySelectorAll('.region-item input[type="checkbox"]');
  const regionToSvgId = {
    '서울': 'KR11',
    '경기도': 'KR41',
    '강원도': 'KR42',
    '경상도': ['KR47', 'KR48', 'KR31', 'KR26'],
    '전라도': ['KR45', 'KR46', 'KR29'],
    '충청도': ['KR43', 'KR44', 'KR50', 'KR30'],
    '인천': 'KR28',
    '대전': 'KR30',
    '대구': 'KR27',
    '울산': 'KR31',
    '부산': 'KR26',
    '제주도': 'KR49'
  };
  const svgObj = document.getElementById('krMapObj');

  // 지도 SVG와 체크박스 연동 함수 통합 및 SVG path 클릭 이벤트 추가
  function highlightAndFilterRegion(regionKor) {
    // 체크박스 싱크
    const regionCheckboxes = document.querySelectorAll('.region-item input[type="checkbox"]');
    regionCheckboxes.forEach(cb => {
      cb.checked = (cb.value === regionKor);
    });
    // 색상 변경
    colorRegions();
    // 리스트 필터링
    const filtered = facilities.filter(fac => fac.address.includes(regionKor));
    renderFacilitiesTablePaged(filtered.length ? filtered : facilities, 1, 10);
  }

  function colorRegions() {
    const regionToSvgId = {
      '\uc11c\uc6b8': 'KR11',
      '\uacbd\uae30\ub3c4': 'KR41',
      '\uac15\uc6d0\ub3c4': 'KR42',
      '\uacbd\uc0c1\ub3c4': ['KR47', 'KR48', 'KR31', 'KR26'],
      '\uc804\ub77c\ub3c4': ['KR45', 'KR46', 'KR29'],
      '\ucda9\uccad\ub3c4': ['KR43', 'KR44', 'KR50', 'KR30'],
      '\uc778\cc9c': 'KR28',
      '\ub300\uc804': 'KR30',
      '\ub300\uad6c': 'KR27',
      '\uc6b8\uc0b0': 'KR31',
      '\ubd80\uc0b0': 'KR26',
      '\uc81c\uc8fc\ub3c4': 'KR49'
    };
    const svgObj = document.getElementById('krMapObj');
    if (!svgObj || !svgObj.contentDocument) return;
    // 모든 지역 색상 원복
    Object.values(regionToSvgId).flat().forEach(id => {
      const path = svgObj.contentDocument.getElementById(id);
      if (path) path.setAttribute('fill', 'none');
    });
    // 선택된 지역만 색칠
    regionCheckboxes.forEach(cb => {
      if (cb.checked) {
        let ids = regionToSvgId[cb.value];
        if (!ids) return;
        if (!Array.isArray(ids)) ids = [ids];
        ids.forEach(id => {
          const path = svgObj.contentDocument.getElementById(id);
          if (path) path.setAttribute('fill', '#e6f0fa');
        });
      }
    });
  }

  regionCheckboxes.forEach(cb => {
    cb.addEventListener('change', function() {
      if (svgObj.contentDocument) {
        colorRegions();
      } else {
        svgObj.addEventListener('load', colorRegions, { once: true });
      }
    });
  });
}); 

document.addEventListener('DOMContentLoaded', function() {
  const svgObj = document.getElementById('krMapObj');
  // 체크박스와 SVG path id 매핑
  const regionToSvgId = {
    '서울': 'KR11',
    '경기도': 'KR41',
    '강원도': 'KR42',
    '경상도': ['KR47', 'KR48', 'KR31', 'KR26'],
    '전라도': ['KR45', 'KR46', 'KR29'],
    '충청도': ['KR43', 'KR44', 'KR50', 'KR30'],
    '인천': 'KR28',
    '대전': 'KR30',
    '대구': 'KR27',
    '울산': 'KR31',
    '부산': 'KR26',
    '제주도': 'KR49'
  };

  function highlightSvgRegion(regionKor, highlight) {
    if (!svgObj || !svgObj.contentDocument) return;
    let ids = regionToSvgId[regionKor];
    if (!ids) return;
    if (!Array.isArray(ids)) ids = [ids];
    ids.forEach(id => {
      const path = svgObj.contentDocument.getElementById(id);
      if (path) {
        path.setAttribute('fill', highlight ? '#b3d1fa' : 'none');
      }
    });
  }

  // 체크박스와 SVG 연동
  const regionCheckboxes = document.querySelectorAll('.region-item input[type="checkbox"]');
  regionCheckboxes.forEach(cb => {
    cb.addEventListener('change', function() {
      // 모든 지역 색상 원복
      Object.keys(regionToSvgId).forEach(region => highlightSvgRegion(region, false));
      // 체크된 지역만 색상 적용
      regionCheckboxes.forEach(box => {
        if (box.checked) highlightSvgRegion(box.value, true);
      });
    });
  });

  // SVG 클릭 시 체크박스도 연동
  if (svgObj) {
    svgObj.addEventListener('load', function() {
      const svgDoc = svgObj.contentDocument;
      if (!svgDoc) return;
      Object.entries(regionToSvgId).forEach(([regionKor, ids]) => {
        if (!Array.isArray(ids)) ids = [ids];
        ids.forEach(id => {
          const regionPath = svgDoc.getElementById(id);
          if (regionPath) {
            regionPath.style.cursor = 'pointer';
            regionPath.addEventListener('click', function() {
              // 체크박스 상태 토글 (단일 선택)
              regionCheckboxes.forEach(cb => {
                cb.checked = (cb.value === regionKor);
              });
              // 모든 지역 색상 원복 후 해당 지역만 하이라이트
              Object.keys(regionToSvgId).forEach(region => highlightSvgRegion(region, false));
              highlightSvgRegion(regionKor, true);
            });
            regionPath.addEventListener('mouseenter', function() {
              regionPath.setAttribute('fill', '#b3d1fa');
            });
            regionPath.addEventListener('mouseleave', function() {
              // 체크된 지역은 유지, 나머지는 원복
              const checked = Array.from(regionCheckboxes).find(cb => cb.checked && regionToSvgId[cb.value]?.includes(id));
              if (!checked) regionPath.setAttribute('fill', 'none');
            });
          }
        });
      });
    });
  }
}); 