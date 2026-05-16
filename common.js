채// 전역 토스트 팝업 함수
var toastTimeout;
window.showToast = function(message) {
    var toast = document.getElementById('toastPopup');
    if (toast) {
        if (message) toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function() { toast.classList.remove('show'); }, 3000);
    }
};

// 전역 장바구니 배지 동기화 함수
window.updateCartBadge = function() {
    var savedCount = localStorage.getItem('cartCount');
    var badges = document.querySelectorAll('.cart-badge');
    if (savedCount && parseInt(savedCount, 10) > 0) { 
        badges.forEach(function(badge) { 
            badge.textContent = savedCount; 
            badge.classList.add('active'); 
        });
    } else {
        badges.forEach(function(badge) { 
            badge.textContent = '0'; 
            badge.classList.remove('active'); 
        });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // 1. 공통 헤더 HTML 불러오기
    fetch('header.html')
        .then(function(response) { return response.text(); })
        .then(function(data) {
            var headerContainer = document.getElementById('header-container');
            if (headerContainer) {
                headerContainer.innerHTML = data;
                initCommonUI(); // HTML 삽입 후 이벤트 바인딩
            }
        })
        .catch(function(error) { console.error('헤더를 불러오는 데 실패했습니다:', error); });

    // 2. 공통 UI 초기화 (헤더 로드 완료 후 실행)
    function initCommonUI() {
        var toggleBtn = document.querySelector('.mobile-menu-toggle');
        var closeBtn = document.getElementById('drawerClose');
        var drawer = document.getElementById('mobileDrawer');
        var overlay = document.getElementById('mobileOverlay');

        function openDrawer() { if(drawer && overlay) { drawer.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; } }
        function closeDrawer() { if(drawer && overlay) { drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; } }

        if(toggleBtn) toggleBtn.addEventListener('click', openDrawer);
        if(closeBtn) closeBtn.addEventListener('click', closeDrawer);
        if(overlay) overlay.addEventListener('click', closeDrawer);

        window.updateCartBadge();
    }

    // 3. 스크롤 등장 애니메이션 (Intersection Observer)
    window.revealObserver = new IntersectionObserver(function(entries) { entries.forEach(function(entry) { if (entry.isIntersecting) { entry.target.classList.add('active'); window.revealObserver.unobserve(entry.target); } }); }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(function(el) { window.revealObserver.observe(el); });
});