document.querySelector('.login-box form').addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('loginId').value;
  const pw = document.getElementById('loginPw').value;
  alert(`로그인 시도: ID=${id}, PW=${pw}`);
}); 