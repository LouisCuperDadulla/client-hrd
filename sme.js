let currentMonth = 8; // September (0-indexed)
let currentYear = 2025;
const engagements = {
    '2025-8-5': { title: 'Jail Security' },
    '2025-9-20': { title: 'Admin Procedures' }
};

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    document.getElementById(modalId).classList.add('flex');
    lucide.createIcons();
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.getElementById(modalId).classList.remove('flex');
}

function navigate(event, pageId) {
    event.preventDefault();

    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');

    document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');
    if (pageId === 'schedule') {
        renderCalendar();
    }
    lucide.createIcons();
}

function renderCalendar() {
    const calendarBody = document.getElementById('calendar-body');
    const monthYear = document.getElementById('calendar-month-year');
    calendarBody.innerHTML = '';

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let date = 1;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                const cell = document.createElement('div');
                cell.classList.add('calendar-day', 'p-2', 'border-r', 'border-b', 'text-gray-400');
                calendarBody.appendChild(cell);
            } else if (date > daysInMonth) {
                const cell = document.createElement('div');
                cell.classList.add('calendar-day', 'p-2', 'border-r', 'border-b', 'text-gray-400');
                calendarBody.appendChild(cell);
            } else {
                const cell = document.createElement('div');
                cell.classList.add('calendar-day', 'p-2', 'border-r', 'border-b');
                cell.innerHTML = `<span class="font-semibold">${date}</span>`;

                const engagementKey = `${currentYear}-${currentMonth}-${date}`;
                if (engagements[engagementKey]) {
                    cell.classList.add('bg-blue-50');
                    const eventDiv = document.createElement('div');
                    eventDiv.classList.add('mt-1', 'text-xs', 'bg-blue-200', 'text-blue-800', 'p-1', 'rounded-md', 'truncate');
                    eventDiv.textContent = engagements[engagementKey].title;
                    cell.appendChild(eventDiv);
                }
                calendarBody.appendChild(cell);
                date++;
            }
        }
    }
}

function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function acceptRequest(requestId) {
    const requestElement = document.getElementById(requestId);
    if (requestElement) {
        requestElement.remove();
        engagements['2025-10-15'] = { title: 'Crisis Mgmt' };
        alert("Request accepted and added to your schedule for November.");
        if (document.getElementById('schedule').classList.contains('page') && !document.getElementById('schedule').classList.contains('hidden')) {
            renderCalendar();
        }
    }
}

function declineRequest(requestId) {
     const requestElement = document.getElementById(requestId);
     if (requestElement) {
        requestElement.remove();
        alert("Request declined.");
    }
}

function toggleEditMode(isEditing) {
    const viewMode = document.getElementById('profile-view-mode');
    const editMode = document.getElementById('profile-edit-mode');
    if (isEditing) {
        viewMode.classList.add('hidden');
        editMode.classList.remove('hidden');
    } else {
        viewMode.classList.remove('hidden');
        editMode.classList.add('hidden');
    }
}

function saveProfile() {
    const inputs = document.querySelectorAll('#profile-edit-mode .info-input');
    inputs.forEach(input => {
        const fieldName = input.dataset.field;
        const displayElement = document.querySelector(`#profile-view-mode .info-value[data-field="${fieldName}"]`);
        if (displayElement) {
            displayElement.textContent = input.value;
        }
    });
    toggleEditMode(false);
}

function handleSmeDocumentUpload(event) {
    event.preventDefault();
    const docFile = document.getElementById('sme-document-file').files[0];
    const fileName = docFile ? docFile.name : "New Document.pdf";

    const docList = document.getElementById('sme-document-list');
    const newDocItem = document.createElement('li');
    newDocItem.className = 'flex items-center justify-between p-3 bg-slate-50 rounded-md';
    newDocItem.innerHTML = `
        <div class="flex items-center">
            <i data-lucide="file-text" class="w-5 h-5 text-blue-600 mr-3"></i>
            <span class="font-medium">${fileName}</span>
        </div>
        <button class="text-sm text-blue-600 hover:underline">View</button>
    `;
    docList.appendChild(newDocItem);

    hideModal('upload-sme-document-modal');
    document.getElementById('upload-sme-form').reset();
    lucide.createIcons();
}

function previewAvatar(event) {
    const reader = new FileReader();
    reader.onload = function(){
        const output = document.getElementById('profile-avatar');
        const headerOutput = document.getElementById('header-avatar');
        output.src = reader.result;
        headerOutput.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

function searchResources() {
    const searchInput = document.getElementById('resource-search-input');
    const searchTerm = searchInput.value.toLowerCase();

    const activeFilter = document.querySelector('.filter-btn.active').dataset.category;
    const resourceList = document.getElementById('resource-list');
    const items = resourceList.getElementsByTagName('li');

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const category = item.dataset.category;
        const title = item.querySelector('span').textContent.toLowerCase();

        const matchesCategory = activeFilter === 'all' || category === activeFilter;
        const matchesSearch = title.includes(searchTerm);

        if (matchesCategory && matchesSearch) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    }
}

function filterResources(category, buttonElement) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active', 'bg-blue-600', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-700');
    });
    buttonElement.classList.add('active', 'bg-blue-600', 'text-white');
    buttonElement.classList.remove('bg-gray-100', 'text-gray-700');

    buttons.forEach(btn => btn.removeAttribute('data-category'));
    buttonElement.setAttribute('data-category', category);

    searchResources();
}

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    document.getElementById('dashboard').classList.remove('hidden');
});
