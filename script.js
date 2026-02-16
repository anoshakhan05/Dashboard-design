document.addEventListener('DOMContentLoaded', () => {
    // Current Date
    const dateElement = document.getElementById('current-date');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = new Date().toLocaleDateString('en-US', options);

    // Sidebar Navigation Interactions
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // Mobile Sidebar Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';
    document.body.appendChild(sidebarOverlay);

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('active');
        });
    }

    // Close sidebar when clicking overlay
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    });

    // Close sidebar when clicking a link (optional, good for direct navigating)
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('active');
            }
        });
    });

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');

        // Remove active class from all
        link.parentElement.classList.remove('active');

        // Add active class if paths match
        if (linkPath === currentPath) {
            link.parentElement.classList.add('active');
        }

        // Optional: Hover effect handled by CSS, no JS needed for basic nav now
    });

    // Animate Chart Bars on Load
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        const originalHeight = bar.style.height || bar.style.getPropertyValue('--height');

        // Reset height for animation
        bar.style.height = '0%';

        // Animate back to original height with delay
        setTimeout(() => {
            bar.style.height = originalHeight;
        }, index * 100 + 300);
    });

    // Theme Toggle (Simple implementation)
    const themeBtn = document.querySelector('.theme-toggle');
    themeBtn.addEventListener('click', () => {
        // Toggle an icon change for visual feedback
        const icon = themeBtn.querySelector('.material-icons-round');
        if (icon.textContent === 'dark_mode') {
            icon.textContent = 'light_mode';
            // Here you would toggle a 'light-theme' class on body
            // document.body.classList.toggle('light-theme');
            // For now, let's just rotate the icon for fun
            themeBtn.style.transform = 'rotate(180deg)';
        } else {
            icon.textContent = 'dark_mode';
            themeBtn.style.transform = 'rotate(0deg)';
        }
    });

    // Tooltip simulation for stat cards
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        card.addEventListener('mouseleave', () => {
            setTimeout(() => {
                card.style.zIndex = '1';
            }, 300);
        });
    });

    // Product/Customer Table Interactions (Delete Simulation)
    const deleteBtns = document.querySelectorAll('.action-btn.delete');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const isCustomer = window.location.href.includes('customers.html');
            const isOrder = window.location.href.includes('orders.html');
            let itemType = 'product';
            if (isCustomer) itemType = 'customer';
            if (isOrder) itemType = 'order';

            if (confirm(`Are you sure you want to delete this ${itemType}?`)) {
                const row = btn.closest('tr');
                // Fade out effect
                row.style.transition = 'opacity 0.3s, transform 0.3s';
                row.style.opacity = '0';
                row.style.transform = 'translateX(20px)';

                setTimeout(() => {
                    row.remove();
                }, 300);
            }
        });
    });

    // Settings Tab Interactions (Visual Only)
    const settingsTabs = document.querySelectorAll('.tab-btn');
    if (settingsTabs.length > 0) {
        settingsTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                settingsTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }
    // --- Global Interactivity Features ---

    // 1. Live Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            // Determine target table based on page
            const table = document.querySelector('.data-table tbody');
            if (table) {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
        });
    }

    // 2. Modal System
    const createModalOverlay = () => {
        if (document.querySelector('.modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.classList.add('modal-overlay');
        overlay.innerHTML = `
            <div class="modal-window">
                <div class="modal-header">
                    <h3 class="modal-title">TITLE</h3>
                    <button class="close-modal-btn"><span class="material-icons-round">close</span></button>
                </div>
                <div class="modal-body">
                    <!-- Dynamic Form -->
                </div>
                <div class="modal-footer">
                    <button class="secondary-btn cancel-btn">Cancel</button>
                    <button class="primary-btn save-btn">Save Changes</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Bind Close Events
        const closeBtn = overlay.querySelector('.close-modal-btn');
        const cancelBtn = overlay.querySelector('.cancel-btn');
        const saveBtn = overlay.querySelector('.save-btn');

        const close = () => overlay.classList.remove('open');

        closeBtn.onclick = close;
        cancelBtn.onclick = close;
        overlay.onclick = (e) => { if (e.target === overlay) close(); };

        saveBtn.onclick = () => {
            // Simulate Saving
            const saveBtnText = saveBtn.textContent;
            saveBtn.textContent = 'Saving...';
            setTimeout(() => {
                saveBtn.textContent = saveBtnText;
                close();
                // Optional: Show success toast
                // alert('Changes saved successfully!');
            }, 800);
        };
    };

    const openModal = (title, fields = []) => {
        createModalOverlay();
        const overlay = document.querySelector('.modal-overlay');
        const titleEl = overlay.querySelector('.modal-title');
        const bodyEl = overlay.querySelector('.modal-body');

        titleEl.textContent = title;
        bodyEl.innerHTML = ''; // Clear previous

        // Generate Form Fields
        fields.forEach(field => {
            const group = document.createElement('div');
            group.classList.add('modal-form-group');

            const label = document.createElement('label');
            label.textContent = field.label;

            let input;
            if (field.type === 'select') {
                input = document.createElement('select');
                field.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.textContent = opt;
                    input.appendChild(option);
                });
            } else {
                input = document.createElement('input');
                input.type = field.type || 'text';
                input.value = field.value || '';
                if (field.placeholder) input.placeholder = field.placeholder;
            }

            group.appendChild(label);
            group.appendChild(input);
            bodyEl.appendChild(group);
        });

        setTimeout(() => overlay.classList.add('open'), 10);
    };

    // 3. Wire Interactions

    // Add Buttons (Product, Customer)
    const addBtns = document.querySelectorAll('.primary-btn'); // Assuming 'Add' buttons are primary
    addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const btnText = btn.textContent.toLowerCase();
            if (btnText.includes('product')) {
                openModal('Add New Product', [
                    { label: 'Product Name', placeholder: 'e.g. Wireless Headphones' },
                    { label: 'Price ($)', type: 'number', placeholder: '0.00' },
                    { label: 'Category', type: 'select', options: ['Electronics', 'Clothing', 'Accessories'] },
                    { label: 'Status', type: 'select', options: ['In Stock', 'Low Stock', 'Out of Stock'] }
                ]);
            } else if (btnText.includes('customer')) {
                openModal('Add New Customer', [
                    { label: 'Full Name', placeholder: 'e.g. John Doe' },
                    { label: 'Email', type: 'email', placeholder: 'john@example.com' },
                    { label: 'Location', placeholder: 'e.g. New York, USA' }
                ]);
            }
        });
    });

    // Edit Buttons (Generic)
    const viewEditBtns = document.querySelectorAll('.action-btn');
    viewEditBtns.forEach(btn => {
        // Skip delete buttons as they are handled separately
        if (btn.classList.contains('delete')) return;

        btn.addEventListener('click', () => {
            const icon = btn.querySelector('.material-icons-round').textContent;
            const row = btn.closest('tr');

            if (icon === 'visibility' || icon === 'mail') {
                // View / Message Modal
                openModal('View Details', [
                    { label: 'Message / Notes', type: 'text', value: 'This is a read-only view or quick message.' }
                ]);
            } else if (icon === 'edit' || icon === 'more_vert') {
                // Edit Modal - Try to grab data from row if possible, else generic
                let name = '';
                if (row) {
                    const nameCell = row.querySelector('h4') || row.querySelector('strong'); // Try common selectors
                    if (nameCell) name = nameCell.textContent;
                }

                openModal(name ? `Edit ${name}` : 'Edit Item', [
                    { label: 'Name / ID', value: name },
                    { label: 'Status', type: 'select', options: ['Active', 'Inactive', 'Pending', 'Completed'] },
                    { label: 'Notes', placeholder: 'Add internal notes...' }
                ]);
            }
        });
    });

});
