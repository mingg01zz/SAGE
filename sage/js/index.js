// index.html 전용 JS (main.js와 충돌 방지)

// 즐겨찾기 관리 함수들
function getFavorites() {
  const favorites = localStorage.getItem('facilityFavorites');
  return favorites ? JSON.parse(favorites) : [];
}

function addToFavorites(facility) {
  const favorites = getFavorites();
  if (!favorites.find(f => f.id === facility.id)) {
    favorites.push(facility);
    localStorage.setItem('facilityFavorites', JSON.stringify(favorites));
  }
}

function removeFromFavorites(facilityId) {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(f => f.id !== facilityId);
  localStorage.setItem('facilityFavorites', JSON.stringify(updatedFavorites));
}

function isFavorite(facilityId) {
  const favorites = getFavorites();
  return favorites.some(f => f.id == facilityId);
}

// 10개 단위 페이지네이션 (1~30까지)
function indexRenderFacilityPagination(total, page, perPage) {
  const pagDiv = document.getElementById('facilityPagination');
  if (!pagDiv) return;
  const maxPage = 30;
  const groupSize = 10;
  const totalPages = maxPage;
  let html = '';
  // 그룹 계산
  const groupIdx = Math.floor((page - 1) / groupSize);
  const groupStart = groupIdx * groupSize + 1;
  const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);
  if (groupStart > 1) {
    html += `<a href="#" class="page-prev-group" data-page="${groupStart - 1}">&lt;</a>`;
  }
  for (let i = groupStart; i <= groupEnd; i++) {
    html += `<a href="#" class="${i === page ? 'active' : ''}" data-page="${i}">${i}</a>`;
  }
  if (groupEnd < totalPages) {
    html += `<a href="#" class="page-next-group" data-page="${groupEnd + 1}">&gt;</a>`;
  }
  pagDiv.className = 'facility-pagination';
  pagDiv.innerHTML = html;
  // 이벤트 바인딩
  pagDiv.querySelectorAll('a[data-page]').forEach(a => {
    a.onclick = function(e) {
      e.preventDefault();
      this.blur();
      indexRenderFacilitiesTablePaged(window.indexCurrentFacilityList, parseInt(this.dataset.page), perPage);
    };
  });
}

// 페이징된 ul/li 리스트 렌더링 (이미지 스타일)
window.indexCurrentFacilityList = [];
function indexRenderFacilitiesTablePaged(list, page=1, perPage=10) {
  window.indexCurrentFacilityList = list;
  const startIdx = (page-1)*perPage;
  const pageList = list.slice(startIdx, startIdx+perPage);
  indexRenderFacilitiesList(pageList);
  indexRenderFacilityPagination(list.length, page, perPage);
}

// ul/li 구조로 시설 리스트 렌더링
function indexRenderFacilitiesList(list) {
  const container = document.getElementById('facilityList');
  if (!container) return;
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = '<li style="padding:32px 0;text-align:center;color:#888;">해당 지역의 요양원이 없습니다.</li>';
    return;
  }
  list.forEach((fac, idx) => {
    const id = fac.id || idx+1;
    const isFav = isFavorite(id);
    container.innerHTML += `
      <li class="facility-item" style="cursor: pointer;" onclick="window.location.href='index-detail.html?id=${id}'">
        <img src="${fac.image || 'img/1.jpg'}" alt="시설사진" class="facility-thumb">
        <div class="facility-info">
          <div class="facility-name">${fac.name}</div>
          <div class="facility-addr">${fac.address}</div>
          <div class="facility-tel">전화번호 <span>${fac.phone}</span></div>
        </div>
        <input type="checkbox" id="scrap${id}" class="facility-fav-chk" ${isFav ? 'checked' : ''} data-facility-id="${id}">
        <label for="scrap${id}" class="facility-fav-label"></label>
      </li>
    `;
  });
  
  // 즐겨찾기 체크박스 이벤트 추가
  container.querySelectorAll('.facility-fav-chk').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const facilityId = parseInt(this.dataset.facilityId); // Ensure ID is number
      const facility = list.find(f => (f.id || list.indexOf(f) + 1) === facilityId); // Find original facility object
      
      if (this.checked) {
        // 즐겨찾기 추가
        addToFavorites({
          id: facilityId,
          name: facility.name,
          address: facility.address,
          phone: facility.phone,
          image: facility.image || 'img/1.jpg'
        });
      } else {
        // 즐겨찾기 제거
        removeFromFavorites(facilityId);
      }
    });
    
    // 즐겨찾기 체크박스 클릭 시 이벤트 전파 방지
    checkbox.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
}

// 정렬 버튼, 지역 필터, SVG 지도, 체크박스 등 index.html 전용 이벤트만 네임스페이스화
window.addEventListener('DOMContentLoaded', function() {
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

  function highlightAndFilterRegion(regionKor) {
    regionCheckboxes.forEach(cb => {
      cb.checked = (cb.value === regionKor);
    });
    colorRegions();
    const filtered = facilities.filter(fac => fac.address.includes(regionKor));
    indexRenderFacilitiesTablePaged(filtered.length ? filtered : facilities, 1, 10);
  }
  function colorRegions() {
    Object.values(regionToSvgId).flat().forEach(id => {
      const path = svgObj?.contentDocument?.getElementById(id);
      if (path) path.setAttribute('fill', 'none');
    });
    regionCheckboxes.forEach(cb => {
      if (cb.checked) {
        let ids = regionToSvgId[cb.value];
        if (!ids) return;
        if (!Array.isArray(ids)) ids = [ids];
        ids.forEach(id => {
          const path = svgObj?.contentDocument?.getElementById(id);
          if (path) path.setAttribute('fill', '#e6f0fa');
        });
      }
    });
  }
  regionCheckboxes.forEach(cb => {
    cb.addEventListener('change', function() {
      if (svgObj?.contentDocument) {
        colorRegions();
      } else {
        svgObj.addEventListener('load', colorRegions, { once: true });
      }
    });
  });

  // SVG 지도 path 클릭 이벤트
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
              regionCheckboxes.forEach(cb => {
                cb.checked = (cb.value === regionKor);
              });
              Object.keys(regionToSvgId).forEach(region => {
                let ids2 = regionToSvgId[region];
                if (!Array.isArray(ids2)) ids2 = [ids2];
                ids2.forEach(id2 => {
                  const path2 = svgDoc.getElementById(id2);
                  if (path2) path2.setAttribute('fill', 'none');
                });
              });
              let ids3 = regionToSvgId[regionKor];
              if (!Array.isArray(ids3)) ids3 = [ids3];
              ids3.forEach(id3 => {
                const path3 = svgDoc.getElementById(id3);
                if (path3) path3.setAttribute('fill', '#e6f0fa');
              });
            });
            regionPath.addEventListener('mouseenter', function() {
              regionPath.setAttribute('fill', '#b3d1fa');
            });
            regionPath.addEventListener('mouseleave', function() {
              const checked = Array.from(regionCheckboxes).find(cb => cb.checked && regionToSvgId[cb.value]?.includes(id));
              if (!checked) regionPath.setAttribute('fill', 'none');
            });
          }
        });
      });
    });
  }
});

// index.html 진입 시 30페이지 분량의 더미 데이터 자동 렌더링
window.addEventListener('DOMContentLoaded', function() {
  if (!window.facilities) {
    // 300개 더미 데이터 생성 (10개씩 30페이지)
    window.facilities = Array.from({length: 300}, (_, i) => {
      const n = i+1;
      return {
        id: n,
        name: n%3===1 ? `청운노인요양원 ${n}` : n%3===2 ? `다나음요양병원 ${n}` : `로하스참사랑요양병원 ${n}`,
        address: n%3===1 ? '서울특별시 동작구 매봉길 76(구기동)' : n%3===2 ? '서울특별시 송파구 가락로 27길, 지하 1층~지상 6층 (만이동)' : '서울특별시 영등포구 영신로77가길 7, (문래동2가)',
        phone: n%3===1 ? '02-3217-0057' : n%3===2 ? '02-412-7272' : '02-2634-7500',
        image: n%3===1 ? 'img/1.jpg' : n%3===2 ? 'img/2.jpg' : 'img/3.jpg'
      };
    });
  }
  indexRenderFacilitiesTablePaged(window.facilities, 1, 10);

  // 검색 기능
  const searchInput = document.getElementById('facilitySearchInput');
  const searchBtn = document.getElementById('facilitySearchBtn');
  const searchForm = document.getElementById('facilitySearchForm');
  function doFacilitySearch() {
    const keyword = searchInput.value.trim();
    if (!keyword) {
      indexRenderFacilitiesTablePaged(window.facilities, 1, 10);
      return;
    }
    const filtered = window.facilities.filter(f => f.name.includes(keyword) || f.address.includes(keyword));
    indexRenderFacilitiesTablePaged(filtered, 1, 10);
  }
  searchBtn.addEventListener('click', doFacilitySearch);
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      doFacilitySearch();
    }
  });
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    doFacilitySearch();
  });
});