// ===== ZENO STORE NAVBAR JS =====
// Tambahkan <script src="/navbar.js"></script> di setiap halaman

function initNavbar(activePage) {
    const user = JSON.parse(localStorage.getItem('zenoUser') || 'null');

    // Inject hamburger button ke nav
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.id = 'hamburger';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(hamburger);

    // Mobile menu
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.id = 'mobileMenu';

    if (user) {
        // Menu untuk user yang sudah login
        mobileMenu.innerHTML = `
            <div class="mobile-user-info">
                <div class="mobile-avatar">${user.username.charAt(0).toUpperCase()}</div>
                <div>
                    <div class="mobile-user-name">${user.username}</div>
                    <div class="mobile-user-email">${user.email || 'Pengguna Zeno Store'}</div>
                </div>
            </div>
            <a href="/" class="mobile-nav-item ${activePage==='home'?'active':''}">
                <div class="mobile-nav-icon">H</div>
                Beranda
            </a>
            <a href="/dashboard" class="mobile-nav-item ${activePage==='dashboard'?'active':''}">
                <div class="mobile-nav-icon">D</div>
                Dashboard
            </a>
            <a href="/products" class="mobile-nav-item ${activePage==='products'?'active':''}">
                <div class="mobile-nav-icon">P</div>
                Produk
            </a>
            <a href="/orders" class="mobile-nav-item ${activePage==='orders'?'active':''}">
                <div class="mobile-nav-icon">O</div>
                Pesanan Saya
            </a>
            <div class="mobile-divider"></div>
            <a href="https://wa.me/62xxxxxxxxxx" target="_blank" class="mobile-nav-item">
                <div class="mobile-nav-icon">S</div>
                Hubungi Support
            </a>
            <div class="mobile-divider"></div>
            <button class="mobile-nav-item logout-item" onclick="logoutUser()">
                <div class="mobile-nav-icon">X</div>
                Logout
            </button>
        `;
    } else {
        // Menu untuk guest
        mobileMenu.innerHTML = `
            <a href="/" class="mobile-nav-item ${activePage==='home'?'active':''}">
                <div class="mobile-nav-icon">H</div>
                Beranda
            </a>
            <a href="/products" class="mobile-nav-item ${activePage==='products'?'active':''}">
                <div class="mobile-nav-icon">P</div>
                Produk
            </a>
            <div class="mobile-divider"></div>
            <div class="mobile-auth-buttons">
                <a href="/login" class="btn btn-secondary btn-full" style="text-align:center;">Masuk</a>
                <a href="/register" class="btn btn-primary btn-full" style="text-align:center;">Daftar Gratis</a>
            </div>
        `;
    }

    document.body.appendChild(mobileMenu);

    // Toggle hamburger
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });

    // Tutup menu kalau klik di luar
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
        }
    });

    // Update nav buttons desktop
    const navButtons = document.getElementById('navButtons');
    if (navButtons) {
        if (user) {
            navButtons.innerHTML = `
                <span class="nav-user">${user.username}</span>
                <a href="/dashboard" class="btn-sm btn-solid-sm">Dashboard</a>
                <button class="btn-sm btn-outline-sm" onclick="logoutUser()">Logout</button>
            `;
        } else {
            navButtons.innerHTML = `
                <a href="/login" class="btn-sm btn-outline-sm">Login</a>
                <a href="/register" class="btn-sm btn-solid-sm">Daftar</a>
            `;
        }
    }
}

function logoutUser() {
    localStorage.removeItem('zenoUser');
    window.location.href = '/';
}
