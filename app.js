// Application State
let appState = {
    isLoggedIn: false,
    currentAdmin: null,
    tickets: [],
    scanner: null,
    codeReader: null,
    recentActivity: []
};

const adminCredentials = {
    "email": "raasrangadmin@account.com",
    "password": "raasrang@2025"
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing App');
    try {
        initializeApp();
        setupEventListeners();
        loadSampleData();
        console.log('App initialization complete');
    } catch (error) {
        console.error('Error during app initialization:', error);
    }
});

function initializeApp() {
    console.log('Initializing app state...');
    // Initialize with sample data
    appState.tickets = [...sampleTickets];
    generateQRCodesForSampleData();
    updateDashboard();
    console.log('App state initialized with', appState.tickets.length, 'tickets');
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Login form - Multiple ways to ensure it works
    const loginForm = document.getElementById('login-form');
    const loginButton = document.querySelector('#login-form button[type="submit"]');
    
    if (loginForm) {
        // Form submit event
        loginForm.addEventListener('submit', function(e) {
            console.log('Login form submit event triggered');
            handleLogin(e);
        });
        
        // Button click event as backup
        if (loginButton) {
            loginButton.addEventListener('click', function(e) {
                console.log('Login button click event triggered');
                if (e.target.form) {
                    handleLogin(e);
                }
            });
        }
        
        console.log('Login form listeners added successfully');
    } else {
        console.error('Login form not found!');
    }
    
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
        console.log('Logout button listener added');
    }
    
    // Tab navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    console.log('Found', tabBtns.length, 'tab buttons');
    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Tab clicked:', btn.dataset.tab);
            switchTab(btn.dataset.tab);
        });
    });
    
    // CSV Upload
    const csvFile = document.getElementById('csv-file');
    const uploadBtn = document.getElementById('upload-btn');
    if (csvFile) {
        csvFile.addEventListener('change', handleFileSelect);
        console.log('CSV file input listener added');
    }
    if (uploadBtn) {
        uploadBtn.addEventListener('click', handleCSVUpload);
        console.log('Upload button listener added');
    }
    
    // Scanner
    const startScannerBtn = document.getElementById('start-scanner');
    const stopScannerBtn = document.getElementById('stop-scanner');
    if (startScannerBtn) {
        startScannerBtn.addEventListener('click', startScanner);
        console.log('Start scanner button listener added');
    }
    if (stopScannerBtn) {
        stopScannerBtn.addEventListener('click', stopScanner);
        console.log('Stop scanner button listener added');
    }
    
    // Email
    const sendAllEmailsBtn = document.getElementById('send-all-emails');
    const testEmailBtn = document.getElementById('test-email');
    if (sendAllEmailsBtn) {
        sendAllEmailsBtn.addEventListener('click', sendAllEmails);
        console.log('Send all emails button listener added');
    }
    if (testEmailBtn) {
        testEmailBtn.addEventListener('click', sendTestEmail);
        console.log('Test email button listener added');
    }
    
    // Ticket management
    const ticketSearch = document.getElementById('ticket-search');
    const ticketFilter = document.getElementById('ticket-filter');
    if (ticketSearch) {
        ticketSearch.addEventListener('input', filterTickets);
        console.log('Ticket search listener added');
    }
    if (ticketFilter) {
        ticketFilter.addEventListener('change', filterTickets);
        console.log('Ticket filter listener added');
    }
    
    // Modal
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
        console.log('Close modal button listener added');
    }
    
    // Click outside modal to close
    const modal = document.getElementById('qr-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        console.log('Modal click outside listener added');
    }
    
    console.log('All event listeners setup complete');
}

function loadSampleData() {
    console.log('Loading sample data...');
    appState.recentActivity = [
        {
            time: new Date().toISOString(),
            text: "Sample data loaded successfully",
            type: "info"
        }
    ];
    console.log('Sample data loaded');
}

// Authentication Functions
function handleLogin(e) {
    console.log('handleLogin called');
    e.preventDefault();
    e.stopPropagation();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    
    if (!emailInput || !passwordInput) {
        console.error('Email or password input not found');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    console.log('Login attempt with email:', email);
    console.log('Expected email:', adminCredentials.email);
    console.log('Password provided:', password ? 'Yes' : 'No');
    
    // Clear any previous errors
    if (loginError) {
        loginError.classList.add('hidden');
    }
    
    if (email === adminCredentials.email && password === adminCredentials.password) {
        console.log('Credentials match - logging in...');
        
        // Update app state
        appState.isLoggedIn = true;
        appState.currentAdmin = email;
        
        // Update UI elements
        const adminName = document.getElementById('admin-name');
        const loginScreen = document.getElementById('login-screen');
        const mainApp = document.getElementById('main-app');
        
        console.log('Updating UI elements...');
        console.log('Admin name element:', adminName ? 'Found' : 'Not found');
        console.log('Login screen element:', loginScreen ? 'Found' : 'Not found');
        console.log('Main app element:', mainApp ? 'Found' : 'Not found');
        
        if (adminName) {
            adminName.textContent = email;
            console.log('Admin name updated');
        }
        
        // CRITICAL FIX: Properly switch between screens using the 'active' class
        if (loginScreen) {
            loginScreen.classList.remove('active');
            console.log('Login screen hidden');
        }
        
        if (mainApp) {
            mainApp.classList.remove('hidden');
            mainApp.classList.add('active'); // This was missing!
            console.log('Main app shown with active class');
        }
        
        // Add activity and update dashboard
        addActivity("Admin logged in successfully");
        updateDashboard();
        
        console.log('Login successful - UI updated');
        
    } else {
        console.log('Invalid credentials provided');
        if (loginError) {
            showError(loginError, "Invalid email or password");
        } else {
            alert('Invalid email or password');
        }
    }
}

function handleLogout() {
    console.log('Logout initiated');
    
    // Update app state
    appState.isLoggedIn = false;
    appState.currentAdmin = null;
    
    // Stop scanner if running
    stopScanner();
    
    // Update UI elements - FIXED: Proper class management
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');
    const loginError = document.getElementById('login-error');
    
    if (loginScreen) {
        loginScreen.classList.add('active');
    }
    if (mainApp) {
        mainApp.classList.add('hidden');
        mainApp.classList.remove('active');
    }
    if (loginError) {
        loginError.classList.add('hidden');
    }
    
    // Reset form values
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    if (emailInput) emailInput.value = 'raasrangadmin@account.com';
    if (passwordInput) passwordInput.value = 'raasrang@2025';
    
    console.log('Logout complete');
}

// Tab Navigation
function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Update tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
    
    // Update specific tab content
    if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'tickets') {
        renderTicketsTable();
    }
    
    console.log('Tab switch complete');
}

// CSV Upload Functions
function handleFileSelect(e) {
    console.log('File selected');
    const file = e.target.files[0];
    const uploadBtn = document.getElementById('upload-btn');
    
    if (file && file.type === 'text/csv') {
        if (uploadBtn) uploadBtn.disabled = false;
        readAndPreviewCSV(file);
    } else {
        if (uploadBtn) uploadBtn.disabled = true;
        const csvPreview = document.getElementById('csv-preview');
        if (csvPreview) csvPreview.classList.add('hidden');
    }
}

function readAndPreviewCSV(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            
            // Validate headers
            const requiredHeaders = ['ticket_id', 'name', 'gender', 'roll_number', 'mobile', 'email'];
            const hasAllHeaders = requiredHeaders.every(header => headers.includes(header));
            
            if (!hasAllHeaders) {
                alert('CSV must contain columns: ticket_id, name, gender, roll_number, mobile, email');
                return;
            }
            
            // Preview data
            const previewData = lines.slice(0, 6).map(line => line.split(',').map(cell => cell.trim()));
            renderCSVPreview(previewData);
            const csvPreview = document.getElementById('csv-preview');
            if (csvPreview) csvPreview.classList.remove('hidden');
        } catch (error) {
            console.error('Error reading CSV:', error);
            alert('Error reading CSV file');
        }
    };
    reader.readAsText(file);
}

function renderCSVPreview(data) {
    const previewTable = document.getElementById('preview-table');
    if (!previewTable) return;
    
    const tableHTML = `
        <div class="preview-table">
            <table>
                <thead>
                    <tr>
                        ${data[0].map(header => `<th>${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.slice(1).map(row => 
                        `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
                    ).join('')}
                </tbody>
            </table>
        </div>
    `;
    previewTable.innerHTML = tableHTML;
}

function handleCSVUpload() {
    console.log('CSV upload initiated');
    const fileInput = document.getElementById('csv-file');
    const file = fileInput.files[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const tickets = parseCSVToTickets(csv);
            appState.tickets = tickets;
            generateQRCodes();
            addActivity(`Uploaded ${tickets.length} tickets from CSV`);
            updateDashboard();
            console.log('CSV upload complete');
        } catch (error) {
            console.error('Error processing CSV:', error);
            alert('Error processing CSV file');
        }
    };
    reader.readAsText(file);
}

function parseCSVToTickets(csv) {
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const ticket = {};
        
        headers.forEach((header, index) => {
            ticket[header] = values[index] || '';
        });
        
        ticket.status = 'unused';
        ticket.qr_code = '';
        ticket.scanned_at = null;
        ticket.scanned_by = null;
        
        return ticket;
    });
}

// QR Code Generation
function generateQRCodesForSampleData() {
    console.log('Generating QR codes for sample data...');
    appState.tickets.forEach(ticket => {
        if (!ticket.qr_code) {
            generateQRForTicket(ticket);
        }
    });
}

function generateQRCodes() {
    console.log('Generating QR codes...');
    appState.tickets.forEach(ticket => {
        generateQRForTicket(ticket);
    });
    renderQRCodesGrid();
}

function generateQRForTicket(ticket) {
    try {
        const qrData = {
            ticket_id: ticket.ticket_id,
            name: ticket.name,
            roll_number: ticket.roll_number,
            hash: generateHash(ticket)
        };
        
        const canvas = document.createElement('canvas');
        QRCode.toCanvas(canvas, JSON.stringify(qrData), { width: 200 }, function(error) {
            if (!error) {
                ticket.qr_code = canvas.toDataURL();
            } else {
                console.error('QR Code generation error:', error);
            }
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
    }
}

function renderQRCodesGrid() {
    const grid = document.getElementById('qr-codes-grid');
    if (!grid) return;
    
    const qrHTML = appState.tickets.map(ticket => `
        <div class="qr-item">
            <h5>${ticket.name}</h5>
            <img src="${ticket.qr_code}" alt="QR Code for ${ticket.name}">
            <p><strong>ID:</strong> ${ticket.ticket_id}</p>
            <p><strong>Roll:</strong> ${ticket.roll_number}</p>
            <button class="btn btn--sm btn--secondary" onclick="showQRModal('${ticket.ticket_id}')">View Details</button>
        </div>
    `).join('');
    
    grid.innerHTML = qrHTML;
    const qrGeneration = document.getElementById('qr-generation');
    if (qrGeneration) qrGeneration.classList.remove('hidden');
}

function generateHash(ticket) {
    // Simple hash generation for demo purposes
    try {
        return btoa(ticket.ticket_id + ticket.name + ticket.roll_number).substr(0, 16);
    } catch (error) {
        console.error('Error generating hash:', error);
        return 'default_hash';
    }
}

// QR Scanner Functions
async function startScanner() {
    console.log('Starting scanner...');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        const video = document.getElementById('scanner-video');
        video.srcObject = stream;
        
        const scannerContainer = document.getElementById('scanner-container');
        const startBtn = document.getElementById('start-scanner');
        const stopBtn = document.getElementById('stop-scanner');
        
        if (scannerContainer) scannerContainer.classList.remove('hidden');
        if (startBtn) startBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;
        
        // Initialize QR code reader
        if (typeof ZXing !== 'undefined') {
            appState.codeReader = new ZXing.BrowserQRCodeReader();
            appState.codeReader.decodeFromVideoDevice(null, 'scanner-video', (result, err) => {
                if (result) {
                    handleQRScan(result.text);
                }
            });
        }
        
        addActivity("QR Scanner started");
        console.log('Scanner started successfully');
    } catch (error) {
        alert('Camera access denied or not available');
        console.error('Scanner error:', error);
    }
}

function stopScanner() {
    console.log('Stopping scanner...');
    if (appState.codeReader) {
        appState.codeReader.reset();
        appState.codeReader = null;
    }
    
    const video = document.getElementById('scanner-video');
    if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }
    
    const scannerContainer = document.getElementById('scanner-container');
    const startBtn = document.getElementById('start-scanner');
    const stopBtn = document.getElementById('stop-scanner');
    const scanResult = document.getElementById('scan-result');
    
    if (scannerContainer) scannerContainer.classList.add('hidden');
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    if (scanResult) scanResult.classList.add('hidden');
    
    addActivity("QR Scanner stopped");
    console.log('Scanner stopped');
}

function handleQRScan(qrText) {
    console.log('QR Code scanned:', qrText);
    try {
        const qrData = JSON.parse(qrText);
        const ticket = appState.tickets.find(t => t.ticket_id === qrData.ticket_id);
        
        const resultDiv = document.getElementById('scan-result');
        const dataDiv = document.getElementById('scan-data');
        const statusDiv = document.getElementById('scan-status');
        
        if (!ticket) {
            // Invalid ticket
            resultDiv.className = 'scan-result error';
            dataDiv.innerHTML = `<strong>Invalid Ticket:</strong> ${qrData.ticket_id}`;
            statusDiv.innerHTML = '<div class="status status--error">⚠️ Ticket not found in system</div>';
            addActivity(`Invalid QR scan attempt: ${qrData.ticket_id}`);
        } else if (ticket.status === 'used') {
            // Already used ticket
            resultDiv.className = 'scan-result warning';
            dataDiv.innerHTML = `
                <strong>Name:</strong> ${ticket.name}<br>
                <strong>Ticket ID:</strong> ${ticket.ticket_id}<br>
                <strong>Roll Number:</strong> ${ticket.roll_number}
            `;
            statusDiv.innerHTML = `
                <div class="status status--warning">⚠️ Ticket already used</div>
                <p>Used on: ${new Date(ticket.scanned_at).toLocaleString()}</p>
                <p>Scanned by: ${ticket.scanned_by}</p>
            `;
            addActivity(`Duplicate scan attempt: ${ticket.name} (${ticket.ticket_id})`);
        } else {
            // Valid unused ticket
            ticket.status = 'used';
            ticket.scanned_at = new Date().toISOString();
            ticket.scanned_by = appState.currentAdmin;
            
            resultDiv.className = 'scan-result success';
            dataDiv.innerHTML = `
                <strong>Name:</strong> ${ticket.name}<br>
                <strong>Ticket ID:</strong> ${ticket.ticket_id}<br>
                <strong>Roll Number:</strong> ${ticket.roll_number}<br>
                <strong>Gender:</strong> ${ticket.gender}<br>
                <strong>Mobile:</strong> ${ticket.mobile}<br>
                <strong>Email:</strong> ${ticket.email}
            `;
            statusDiv.innerHTML = '<div class="status status--success">✅ Entry verified and recorded</div>';
            addActivity(`Successful entry: ${ticket.name} (${ticket.ticket_id})`);
            updateDashboard();
        }
        
        resultDiv.classList.remove('hidden');
        
        // Auto-hide result after 5 seconds
        setTimeout(() => {
            resultDiv.classList.add('hidden');
        }, 5000);
        
    } catch (error) {
        console.error('Error processing QR scan:', error);
        const resultDiv = document.getElementById('scan-result');
        if (resultDiv) {
            resultDiv.className = 'scan-result error';
            const dataDiv = document.getElementById('scan-data');
            const statusDiv = document.getElementById('scan-status');
            if (dataDiv) dataDiv.innerHTML = '<strong>Invalid QR Code Format</strong>';
            if (statusDiv) statusDiv.innerHTML = '<div class="status status--error">⚠️ Could not read QR code</div>';
            resultDiv.classList.remove('hidden');
        }
        addActivity("Invalid QR code scanned");
    }
}

// Email Functions
function sendAllEmails() {
    console.log('Sending emails to all unused tickets...');
    const unusedTickets = appState.tickets.filter(t => t.status === 'unused');
    const subject = document.getElementById('email-subject').value;
    const message = document.getElementById('email-message').value;
    
    if (unusedTickets.length === 0) {
        alert('No unused tickets to send emails to');
        return;
    }
    
    const emailStatus = document.getElementById('email-status');
    const progressDiv = document.getElementById('email-progress');
    
    if (emailStatus) emailStatus.classList.remove('hidden');
    if (progressDiv) progressDiv.innerHTML = `Starting email distribution to ${unusedTickets.length} recipients...\n`;
    
    unusedTickets.forEach((ticket, index) => {
        setTimeout(() => {
            const personalizedMessage = message
                .replace(/\{\{name\}\}/g, ticket.name)
                .replace(/\{\{ticket_id\}\}/g, ticket.ticket_id)
                .replace(/\{\{roll_number\}\}/g, ticket.roll_number);
            
            // Simulate email sending
            if (progressDiv) {
                progressDiv.innerHTML += `✅ Email sent to ${ticket.name} (${ticket.email})\n`;
                progressDiv.scrollTop = progressDiv.scrollHeight;
                
                if (index === unusedTickets.length - 1) {
                    progressDiv.innerHTML += `\n📧 All emails sent successfully!`;
                    addActivity(`Sent ${unusedTickets.length} emails to unused ticket holders`);
                }
            }
        }, index * 500);
    });
}

function sendTestEmail() {
    console.log('Sending test email...');
    const subject = document.getElementById('email-subject').value;
    const message = document.getElementById('email-message').value;
    
    const emailStatus = document.getElementById('email-status');
    const progressDiv = document.getElementById('email-progress');
    
    if (emailStatus) emailStatus.classList.remove('hidden');
    if (progressDiv) progressDiv.innerHTML = `Sending test email to ${appState.currentAdmin}...\n`;
    
    setTimeout(() => {
        if (progressDiv) progressDiv.innerHTML += `✅ Test email sent successfully!\n`;
        addActivity("Test email sent");
    }, 1000);
}

// Dashboard Functions
function updateDashboard() {
    console.log('Updating dashboard...');
    const totalTickets = appState.tickets.length;
    const usedTickets = appState.tickets.filter(t => t.status === 'used').length;
    const unusedTickets = totalTickets - usedTickets;
    const attendanceRate = totalTickets > 0 ? Math.round((usedTickets / totalTickets) * 100) : 0;
    
    const totalElem = document.getElementById('total-tickets');
    const usedElem = document.getElementById('used-tickets');
    const unusedElem = document.getElementById('unused-tickets');
    const rateElem = document.getElementById('attendance-rate');
    
    if (totalElem) {
        totalElem.textContent = totalTickets;
        console.log('Total tickets updated:', totalTickets);
    }
    if (usedElem) {
        usedElem.textContent = usedTickets;
        console.log('Used tickets updated:', usedTickets);
    }
    if (unusedElem) {
        unusedElem.textContent = unusedTickets;
        console.log('Unused tickets updated:', unusedTickets);
    }
    if (rateElem) {
        rateElem.textContent = `${attendanceRate}%`;
        console.log('Attendance rate updated:', attendanceRate + '%');
    }
    
    console.log('Dashboard updated:', { totalTickets, usedTickets, unusedTickets, attendanceRate });
    
    renderRecentActivity();
}

function renderRecentActivity() {
    const activityDiv = document.getElementById('recent-activity');
    if (!activityDiv) {
        console.log('Recent activity div not found');
        return;
    }
    
    if (appState.recentActivity.length === 0) {
        activityDiv.innerHTML = 'No recent activity';
        return;
    }
    
    const activityHTML = appState.recentActivity
        .slice(-5) // Show last 5 activities
        .reverse()
        .map(activity => `
            <div class="activity-item">
                <div class="activity-time">${new Date(activity.time).toLocaleString()}</div>
                <div class="activity-text">${activity.text}</div>
            </div>
        `).join('');
    
    activityDiv.innerHTML = activityHTML;
    console.log('Recent activity rendered:', appState.recentActivity.length, 'items');
}

// Ticket Management Functions
function renderTicketsTable() {
    console.log('Rendering tickets table...');
    const tableContainer = document.getElementById('tickets-table');
    if (!tableContainer) {
        console.log('Tickets table container not found');
        return;
    }
    
    const tableHTML = `
        <table class="tickets-table">
            <thead>
                <tr>
                    <th>Ticket ID</th>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Gender</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Scanned At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${appState.tickets.map(ticket => `
                    <tr>
                        <td>${ticket.ticket_id}</td>
                        <td>${ticket.name}</td>
                        <td>${ticket.roll_number}</td>
                        <td>${ticket.gender}</td>
                        <td>${ticket.mobile}</td>
                        <td>${ticket.email}</td>
                        <td class="status-${ticket.status}">${ticket.status.toUpperCase()}</td>
                        <td>${ticket.scanned_at ? new Date(ticket.scanned_at).toLocaleString() : '-'}</td>
                        <td class="actions">
                            <button class="btn btn--xs btn--secondary" onclick="showQRModal('${ticket.ticket_id}')">View QR</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    tableContainer.innerHTML = tableHTML;
    console.log('Tickets table rendered with', appState.tickets.length, 'tickets');
}

function filterTickets() {
    console.log('Filtering tickets...');
    const searchInput = document.getElementById('ticket-search');
    const filterSelect = document.getElementById('ticket-filter');
    
    if (!searchInput || !filterSelect) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const filter = filterSelect.value;
    
    let filteredTickets = appState.tickets;
    
    // Apply status filter
    if (filter !== 'all') {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === filter);
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredTickets = filteredTickets.filter(ticket => 
            ticket.name.toLowerCase().includes(searchTerm) ||
            ticket.ticket_id.toLowerCase().includes(searchTerm) ||
            ticket.roll_number.toLowerCase().includes(searchTerm) ||
            ticket.email.toLowerCase().includes(searchTerm)
        );
    }
    
    // Update table with filtered results
    const tbody = document.querySelector('.tickets-table tbody');
    if (tbody) {
        tbody.innerHTML = filteredTickets.map(ticket => `
            <tr>
                <td>${ticket.ticket_id}</td>
                <td>${ticket.name}</td>
                <td>${ticket.roll_number}</td>
                <td>${ticket.gender}</td>
                <td>${ticket.mobile}</td>
                <td>${ticket.email}</td>
                <td class="status-${ticket.status}">${ticket.status.toUpperCase()}</td>
                <td>${ticket.scanned_at ? new Date(ticket.scanned_at).toLocaleString() : '-'}</td>
                <td class="actions">
                    <button class="btn btn--xs btn--secondary" onclick="showQRModal('${ticket.ticket_id}')">View QR</button>
                </td>
            </tr>
        `).join('');
    }
    
    console.log('Tickets filtered:', filteredTickets.length, 'results');
}

// Modal Functions
function showQRModal(ticketId) {
    console.log('Showing QR modal for ticket:', ticketId);
    const ticket = appState.tickets.find(t => t.ticket_id === ticketId);
    if (!ticket) {
        console.error('Ticket not found:', ticketId);
        return;
    }
    
    const modal = document.getElementById('qr-modal');
    const qrCodeDiv = document.getElementById('modal-qr-code');
    const detailsDiv = document.getElementById('modal-ticket-details');
    
    if (!modal || !qrCodeDiv || !detailsDiv) {
        console.error('Modal elements not found');
        return;
    }
    
    // Generate QR code if not exists
    if (!ticket.qr_code) {
        generateQRForTicket(ticket);
        // Wait a bit for QR generation
        setTimeout(() => {
            qrCodeDiv.innerHTML = `<img src="${ticket.qr_code}" alt="QR Code">`;
        }, 100);
    } else {
        qrCodeDiv.innerHTML = `<img src="${ticket.qr_code}" alt="QR Code">`;
    }
    
    detailsDiv.innerHTML = `
        <h5>Ticket Details</h5>
        <div class="ticket-detail-item">
            <span class="ticket-detail-label">Ticket ID:</span>
            <span class="ticket-detail-value">${ticket.ticket_id}</span>
        </div>
        <div class="ticket-detail-item">
            <span class="ticket-detail-label">Name:</span>
            <span class="ticket-detail-value">${ticket.name}</span>
        </div>
        <div class="ticket-detail-item">
            <span class="ticket-detail-label">Roll Number:</span>
            <span class="ticket-detail-value">${ticket.roll_number}</span>
        </div>
        <div class="ticket-detail-item">
            <span class="ticket-detail-label">Gender:</span>
            <span class="ticket-detail-value">${ticket.gender}</span>
        </div>
        <div class="ticket-detail-item">
            <span class="ticket-detail-label">Mobile:</span>
            <span class="ticket-detail-value">${ticket.mobile}</span>
        </div>
        <div class="ticket-detail-item">
            <span class="ticket-detail-label">Email:</span>
            <span class="ticket-detail-value">${ticket.email}</span>
        </div>
        <div class="ticket-detail-item">
            <span class="ticket-detail-label">Status:</span>
            <span class="ticket-detail-value status-${ticket.status}">${ticket.status.toUpperCase()}</span>
        </div>
        ${ticket.scanned_at ? `
            <div class="ticket-detail-item">
                <span class="ticket-detail-label">Scanned At:</span>
                <span class="ticket-detail-value">${new Date(ticket.scanned_at).toLocaleString()}</span>
            </div>
            <div class="ticket-detail-item">
                <span class="ticket-detail-label">Scanned By:</span>
                <span class="ticket-detail-value">${ticket.scanned_by}</span>
            </div>
        ` : ''}
    `;
    
    modal.classList.remove('hidden');
    console.log('QR modal displayed');
}

function closeModal() {
    console.log('Closing QR modal');
    const modal = document.getElementById('qr-modal');
    if (modal) modal.classList.add('hidden');
}

// Utility Functions
function showError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.classList.remove('hidden');
}

function addActivity(text) {
    console.log('Adding activity:', text);
    appState.recentActivity.push({
        time: new Date().toISOString(),
        text: text,
        type: "info"
    });
    
    // Keep only last 50 activities
    if (appState.recentActivity.length > 50) {
        appState.recentActivity = appState.recentActivity.slice(-50);
    }
    
    renderRecentActivity();
}

// Global functions for onclick handlers
window.showQRModal = showQRModal;

// Add debugging info
console.log('QR Ticket Management System JavaScript loaded successfully');
