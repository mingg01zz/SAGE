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

  function colorRegions() {
    if (!svgObj || !svgObj.contentDocument) return;
    // 모든 지역 색상 원복
    Object.values(regionToSvgId).flat().forEach(id => {
      const path = svgObj.contentDocument.getElementById(id);
      if (path) path.setAttribute('fill', 'none');
    });
    // 선택된 지역만 색칠 (빨간색)
    regionCheckboxes.forEach(cb => {
      if (cb.checked) {
        let ids = regionToSvgId[cb.value];
        if (!ids) return;
        if (!Array.isArray(ids)) ids = [ids];
        ids.forEach(id => {
          const path = svgObj.contentDocument.getElementById(id);
          if (path) path.setAttribute('fill', '#ff3b3b');
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

  // 페이지 진입 시 SVG가 이미 로드된 경우 체크된 지역 반영
  if (svgObj.contentDocument) {
    colorRegions();
  } else {
    svgObj.addEventListener('load', colorRegions, { once: true });
  }

  // 스크랩(별) 클릭 이벤트
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('facility-fav')) {
      e.target.classList.toggle('facility-fav-active');
    }
  });
}); 