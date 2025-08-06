// 예시 데이터 (실제론 서버에서 fetch)
const compareFacilities = [
  {
    name: "청운노인요양원",
    address: "서울특별시 종로구 평창동 7길 76",
    phone: "02-3217-0057",
    grade: "1등급"
  },
  {
    name: "다나음요양병원",
    address: "서울특별시 송파구 가락로 278",
    phone: "02-412-7272",
    grade: "2등급"
  },
  {
    name: "로하스참사랑요양병원",
    address: "서울특별시 영등포구 영신로17가길 7",
    phone: "02-2634-7500",
    grade: "3등급"
  }
];

window.onload = function() {
  for (let i = 0; i < 3; i++) {
    if (compareFacilities[i]) {
      document.getElementById('name'+(i+1)).textContent = compareFacilities[i].name;
      document.getElementById('address'+(i+1)).textContent = compareFacilities[i].address;
      document.getElementById('phone'+(i+1)).textContent = compareFacilities[i].phone;
      document.getElementById('grade'+(i+1)).textContent = compareFacilities[i].grade;
    }
  }
} 