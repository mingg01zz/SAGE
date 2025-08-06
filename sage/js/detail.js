// 예시 데이터 (실제론 서버에서 fetch)
const facilityDetail = {
  id: 1,
  name: "청운노인요양원",
  address: "서울특별시 종로구 평창동 7길 76",
  phone: "02-3217-0057",
  grade: "1등급",
  desc: "이곳은 쾌적한 환경과 전문 요양 서비스를 제공합니다.",
  image: "img/cheongun.jpg"
};

window.onload = function() {
  document.getElementById('detailImg').src = facilityDetail.image;
  document.getElementById('detailName').textContent = facilityDetail.name;
  document.getElementById('detailAddress').textContent = facilityDetail.address;
  document.getElementById('detailPhone').textContent = facilityDetail.phone;
  document.getElementById('detailGrade').textContent = facilityDetail.grade;
  document.getElementById('detailDesc').textContent = facilityDetail.desc;
} 