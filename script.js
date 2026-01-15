// Supabase Configuration
// Replace these with your actual Supabase credentials
const SUPABASE_PROJECT_ID = 'YOUR_PROJECT_ID';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const ADMIN_PASSWORD = 'Favored247';

// Page elements
const mainPage = document.getElementById('main-page');
const adminLoginPage = document.getElementById('admin-login-page');
const adminDashboardPage = document.getElementById('admin-dashboard-page');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    setupEventListeners();
    setupHeartMonitor();
    updateCurrentDate();
    checkAdminAccess();
});

// Initialize page
function initializePage() {
    // Prevent logo from being a broken image if not found
    const logoImage = document.getElementById('logo-image');
    logoImage.onerror = function() {
        // Create a placeholder if logo is not found
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.style.width = '100%';
        placeholder.style.height = '100%';
        placeholder.style.background = 'linear-gradient(135deg, #14b8a6, #06b6d4)';
        placeholder.style.borderRadius = '50%';
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.fontSize = '3rem';
        placeholder.style.fontWeight = 'bold';
        placeholder.textContent = 'DS';
        this.parentElement.appendChild(placeholder);
    };
}

// Setup event listeners
function setupEventListeners() {
    // Signup form
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', handleSignupSubmit);

    // Admin login form
    const adminLoginForm = document.getElementById('admin-login-form');
    adminLoginForm.addEventListener('submit', handleAdminLogin);

    // Back buttons
    document.getElementById('back-from-login').addEventListener('click', () => {
        showPage('main');
    });

    document.getElementById('back-from-dashboard').addEventListener('click', () => {
        sessionStorage.removeItem('admin_authenticated');
        showPage('main');
    });

    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', fetchSignups);

    // Export button
    document.getElementById('export-btn').addEventListener('click', exportToCSV);
}

// Update current date
function updateCurrentDate() {
    const dateElement = document.getElementById('current-date');
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString();
}

// Check admin access from URL
function checkAdminAccess() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
        const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
        if (isAuthenticated) {
            showPage('dashboard');
            fetchSignups();
        } else {
            showPage('login');
        }
    }
}

// Show specific page
function showPage(page) {
    mainPage.style.display = 'none';
    adminLoginPage.style.display = 'none';
    adminDashboardPage.style.display = 'none';

    const params = new URLSearchParams(window.location.search);
    
    switch(page) {
        case 'main':
            mainPage.style.display = 'block';
            params.delete('admin');
            break;
        case 'login':
            adminLoginPage.style.display = 'block';
            params.set('admin', 'true');
            break;
        case 'dashboard':
            adminDashboardPage.style.display = 'block';
            params.set('admin', 'true');
            break;
    }

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
}

// Handle signup form submission
async function handleSignupSubmit(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('name-input');
    const emailInput = document.getElementById('email-input');
    const submitBtn = document.getElementById('submit-btn');
    const errorMessage = document.getElementById('error-message');
    const successOverlay = document.getElementById('success-overlay');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    
    // Disable form
    submitBtn.disabled = true;
    submitBtn.textContent = 'Loading...';
    errorMessage.classList.remove('show');
    
    try {
        // If Supabase is not configured, use local storage for demo
        if (SUPABASE_PROJECT_ID === 'YOUR_PROJECT_ID') {
            // Demo mode - save to localStorage
            const signups = JSON.parse(localStorage.getItem('drspill_signups') || '[]');
            signups.unshift({
                name,
                email,
                date: new Date().toISOString(),
                timestamp: Date.now()
            });
            localStorage.setItem('drspill_signups', JSON.stringify(signups));
            
            // Show success
            showSuccess();
        } else {
            // Real Supabase mode
            const response = await fetch(
                `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-ff533cce/signup`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({ name, email }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to sign up');
            }

            showSuccess();
        }
    } catch (error) {
        console.error('Signup error:', error);
        errorMessage.textContent = error.message || 'Failed to sign up. Please try again.';
        errorMessage.classList.add('show');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get Notified When We Launch';
    }
    
    function showSuccess() {
        successOverlay.classList.add('show');
        setTimeout(() => {
            successOverlay.classList.remove('show');
            nameInput.value = '';
            emailInput.value = '';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Get Notified When We Launch';
        }, 3000);
    }
}

// Handle admin login
function handleAdminLogin(e) {
    e.preventDefault();
    
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    const adminCard = document.querySelector('.admin-card');
    
    const password = passwordInput.value;
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_authenticated', 'true');
        showPage('dashboard');
        fetchSignups();
        passwordInput.value = '';
        loginError.classList.remove('show');
    } else {
        loginError.textContent = 'Incorrect password';
        loginError.classList.add('show');
        adminCard.classList.add('shake');
        setTimeout(() => {
            adminCard.classList.remove('shake');
        }, 400);
        passwordInput.value = '';
    }
}

// Fetch signups from Supabase or localStorage
async function fetchSignups() {
    const refreshIcon = document.getElementById('refresh-icon');
    const refreshBtn = document.getElementById('refresh-btn');
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    const tableContainer = document.getElementById('signups-table-container');
    const dashboardError = document.getElementById('dashboard-error');
    const exportSection = document.getElementById('export-section');
    
    // Show loading
    loadingState.style.display = 'block';
    emptyState.style.display = 'none';
    tableContainer.style.display = 'none';
    dashboardError.classList.remove('show');
    refreshIcon.classList.add('spinning');
    refreshBtn.disabled = true;
    
    try {
        let signups = [];
        
        // If Supabase is not configured, use localStorage
        if (SUPABASE_PROJECT_ID === 'YOUR_PROJECT_ID') {
            signups = JSON.parse(localStorage.getItem('drspill_signups') || '[]');
        } else {
            // Real Supabase mode
            const response = await fetch(
                `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-ff533cce/signups`,
                {
                    headers: {
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch signups');
            }

            signups = data.signups || [];
        }
        
        // Update stats
        document.getElementById('total-signups').textContent = signups.length;
        document.getElementById('latest-signup').textContent = 
            signups.length > 0 ? signups[0].email : 'No signups yet';
        
        // Show appropriate state
        if (signups.length === 0) {
            emptyState.style.display = 'block';
            exportSection.style.display = 'none';
        } else {
            renderSignupsTable(signups);
            tableContainer.style.display = 'block';
            exportSection.style.display = 'block';
        }
        
        // Store signups for export
        window.currentSignups = signups;
        
    } catch (error) {
        console.error('Fetch error:', error);
        dashboardError.textContent = error.message || 'Failed to load signups';
        dashboardError.classList.add('show');
    } finally {
        loadingState.style.display = 'none';
        refreshIcon.classList.remove('spinning');
        refreshBtn.disabled = false;
    }
}

// Render signups table
function renderSignupsTable(signups) {
    const tbody = document.getElementById('signups-tbody');
    tbody.innerHTML = '';
    
    signups.forEach((signup, index) => {
        const row = document.createElement('tr');
        row.style.opacity = '0';
        row.style.animation = `fade-in 0.3s ${index * 0.05}s forwards`;
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${escapeHtml(signup.name)}</td>
            <td>${escapeHtml(signup.email)}</td>
            <td>${formatDate(signup.date)}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export to CSV
function exportToCSV() {
    const signups = window.currentSignups || [];
    
    if (signups.length === 0) {
        alert('No signups to export');
        return;
    }
    
    const headers = ['Name', 'Email', 'Date'];
    const rows = signups.map(s => [
        s.name,
        s.email,
        s.date
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dr-spill-signups-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Setup Heart Monitor ECG Animation
function setupHeartMonitor() {
    const svg = document.getElementById('ecg-svg');
    
    // Create heartbeat pattern
    function createHeartbeatPath(offsetX = 0) {
        const points = [
            { x: 0, y: 50 },
            { x: 10, y: 50 },
            { x: 15, y: 50 },
            { x: 18, y: 45 },
            { x: 21, y: 50 },
            { x: 28, y: 50 },
            { x: 30, y: 52 },
            { x: 32, y: 20 },
            { x: 34, y: 55 },
            { x: 36, y: 50 },
            { x: 42, y: 50 },
            { x: 45, y: 48 },
            { x: 50, y: 45 },
            { x: 55, y: 48 },
            { x: 60, y: 50 },
            { x: 100, y: 50 },
        ];
        
        return points.map(p => `${p.x + offsetX},${p.y}`).join(' ');
    }
    
    // Create multiple heartbeat patterns
    const patterns = Array.from({ length: 20 }, (_, i) => i * 100);
    
    // Create 3 rows of ECG lines
    for (let row = 0; row < 3; row++) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(0, ${row * 200 + 100})`);
        
        patterns.forEach((offset) => {
            const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            polyline.setAttribute('points', createHeartbeatPath(offset));
            polyline.setAttribute('fill', 'none');
            polyline.setAttribute('stroke', 'rgba(20, 184, 166, 0.8)');
            polyline.setAttribute('stroke-width', '2');
            polyline.setAttribute('stroke-linecap', 'round');
            polyline.setAttribute('stroke-linejoin', 'round');
            polyline.classList.add('ecg-line');
            g.appendChild(polyline);
        });
        
        svg.appendChild(g);
    }
}
