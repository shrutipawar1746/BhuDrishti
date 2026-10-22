document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple interaction for login button
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            alert('Official Login Portal Integration Pending. This would connect to the secure government authentication system.');
        });
    }

    // Animation observer for step cards
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.step-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(card);
    });

    // Mock Database
    const propertyDatabase = {
        'SANGAMNER-IND-7890-4561-23': {
            area: '98.48 sq.m (1060 sq.ft)',
            height: 'Standard RCC (~10 ft)',
            depth: 'West side building, back side',
            floor: 'First Floor (Flat 3)',
            owner: 'Suresh Raghunath Wagh & Sunil Shivaji Wagh',
            rera: 'Prop No: 876 (Ward 4)',
            ec: 'Mortgaged (₹20,00,000 Loan) - Hunaman gramin pathshantha ghargoan',
            address: 'Wagh Building, waghinfraspace upside, akalapur road, ghargoan, tal sangamner dist ahilyanagar',
            body: 'Grampanchayat: Ghargav, Sangamner',
            taxStatus: 'Annual Tax: ₹1,872',
            taxDate: 'Doc Date: 17/07/2023'
        },
        'DEFAULT': {
            area: '850 sq.ft',
            height: '9.8 ft',
            depth: '30 ft',
            floor: '2nd Floor (Flat 201)',
            owner: 'Amit Sharma',
            rera: 'PR/KA/21/2022/00891',
            ec: 'Mortgaged (HDFC Bank)',
            address: '123 Default Street, Sector 4',
            body: 'Local Council',
            taxStatus: 'Pending',
            taxDate: 'N/A'
        }
    };

    // Search Functionality
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('ulpin-search');
    const searchResults = document.getElementById('search-results');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    function handleSearch() {
        const query = searchInput.value.trim().toUpperCase();
        if (!query) {
            alert('Please enter a ULPIN to search.');
            return;
        }

        const data = propertyDatabase[query] || propertyDatabase['DEFAULT'];
        const isVerified = query === 'SANGAMNER-IND-7890-4561-23';

        // Update Dashboard Elements
        document.getElementById('res-ulpin').textContent = query;
        document.getElementById('res-area').textContent = data.area;
        document.getElementById('res-height').textContent = data.height;
        document.getElementById('res-depth').textContent = data.depth;
        document.getElementById('res-floor').textContent = data.floor;
        document.getElementById('res-owner').textContent = data.owner;
        
        const addrElem = document.getElementById('res-address');
        if (addrElem) addrElem.textContent = data.address;

        const statusBadge = document.getElementById('res-status');
        if (isVerified) {
            statusBadge.className = 'status-badge verified';
            statusBadge.innerHTML = '<i class="fa-solid fa-check-circle"></i> Verified';
        } else {
            statusBadge.className = 'status-badge';
            statusBadge.style.background = 'rgba(245, 158, 11, 0.1)';
            statusBadge.style.color = '#f59e0b';
            statusBadge.style.border = '1px solid rgba(245, 158, 11, 0.3)';
            statusBadge.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Unverified/Partial Match';
        }

        document.getElementById('res-area').textContent = data.area;
        document.getElementById('res-height').textContent = data.height;
        document.getElementById('res-depth').textContent = data.depth;
        document.getElementById('res-floor').textContent = data.floor;
        document.getElementById('res-owner').textContent = data.owner;
        document.getElementById('res-rera').textContent = data.rera;
        
        const ecElem = document.getElementById('res-ec');
        ecElem.textContent = data.ec;
        ecElem.className = data.ec.includes('Clear') ? 'status-safe' : 'status-warn';

        document.getElementById('res-body').textContent = data.body;
        
        const taxStatusElem = document.getElementById('res-tax-status');
        taxStatusElem.textContent = data.taxStatus;
        taxStatusElem.style.color = data.taxStatus.includes('Paid') ? '#10b981' : '#ef4444';
        
        document.getElementById('res-tax-date').textContent = data.taxDate;

        // Reveal Dashboard
        searchResults.classList.remove('hidden');
        searchResults.scrollIntoView({ behavior: 'smooth' });
    }

    // 3D Interactive Rotation
    const sceneWrapper = document.querySelector('.scene-wrapper');
    const modelViewer = document.querySelector('.model-viewer-placeholder');
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotation = { x: -25, y: 45 };
    let scale = 1;
    
    // Auto-rotate state
    let autoRotate = true;

    if (sceneWrapper && modelViewer) {
        const updateTransform = () => {
            sceneWrapper.style.transform = `scale(${scale}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
        };

        const startDrag = (e) => {
            if (e.target.closest('button')) return; // ignore button clicks
            isDragging = true;
            
            // stop auto-rotate if dragging manually
            if (autoRotate) {
                autoRotate = false;
                const btnRotate = document.getElementById('btn-rotate');
                if (btnRotate) btnRotate.style.background = 'transparent';
            }
            
            modelViewer.style.cursor = 'grabbing';
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            previousMousePosition = { x: clientX, y: clientY };
        };

        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault(); 
            
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

            const deltaMove = {
                x: clientX - previousMousePosition.x,
                y: clientY - previousMousePosition.y
            };

            rotation.y += deltaMove.x * 0.6;
            rotation.x -= deltaMove.y * 0.6;
            rotation.x = Math.max(-85, Math.min(-10, rotation.x));

            updateTransform();
            previousMousePosition = { x: clientX, y: clientY };
        };

        const stopDrag = () => {
            isDragging = false;
            modelViewer.style.cursor = 'grab';
        };

        modelViewer.style.cursor = 'grab';
        
        modelViewer.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', drag, { passive: false });
        window.addEventListener('mouseup', stopDrag);

        modelViewer.addEventListener('touchstart', startDrag, { passive: true });
        window.addEventListener('touchmove', drag, { passive: false });
        window.addEventListener('touchend', stopDrag);

        // Buttons Integration
        const btnRotate = document.getElementById('btn-rotate');
        const loopRotate = () => {
            if (autoRotate) {
                rotation.y += 0.3; // slightly slower for better UX
                updateTransform();
                requestAnimationFrame(loopRotate);
            }
        };

        // Start auto-rotation immediately
        if (btnRotate) {
            btnRotate.style.background = 'rgba(255,255,255,0.2)';
            btnRotate.addEventListener('click', () => {
                autoRotate = !autoRotate;
                if (autoRotate) {
                    btnRotate.style.background = 'rgba(255,255,255,0.2)';
                    loopRotate();
                } else {
                    btnRotate.style.background = 'transparent';
                }
            });
        }
        loopRotate();
        
        const btnZoom = document.getElementById('btn-zoom');
        if (btnZoom) {
            btnZoom.addEventListener('click', () => {
                scale = scale >= 1.3 ? 0.7 : scale + 0.3;
                updateTransform();
            });
        }
        
        const btnPan = document.getElementById('btn-pan'); // Used as Reset now
        if (btnPan) {
            btnPan.addEventListener('click', () => {
                rotation = { x: -25, y: 45 };
                scale = 1;
                updateTransform();
            });
        }
    }

    // Modal Logic
    const modal = document.getElementById('inside-view-modal');
    const btnInsideView = document.getElementById('btn-inside-view');
    const closeBtn = document.querySelector('.close-modal');
    const mainImg = document.getElementById('main-gallery-img');
    const mainLabel = document.getElementById('main-gallery-label');
    const thumbs = document.querySelectorAll('.thumb');
    const flatName = document.getElementById('modal-flat-name');
    
    // Default flat name
    let currentFlat = 'Flat 301';

    if (btnInsideView && modal) {
        btnInsideView.addEventListener('click', () => {
            flatName.textContent = currentFlat;
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
        
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Gallery logic
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Update main image and label
                mainImg.src = this.src;
                mainLabel.textContent = this.alt;
                
                // Update active state
                thumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Upload simulation
        const dropzone = document.getElementById('upload-dropzone');
        if (dropzone) {
            dropzone.addEventListener('click', () => {
                alert('File picker dialog would open here. Selected images will be cryptographically hashed and linked to ' + currentFlat);
            });
        }
    }
});
