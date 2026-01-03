const TOTAL_STEPS = 3;
let currentStep = 1;

// DOM Elements
const wizardSteps = document.querySelectorAll('.wizard-step');
const progressContainer = document.getElementById('wizardProgress');
const btnNext = document.getElementById('btnNext');
const btnBack = document.getElementById('btnBack');
const jsonPreview = document.getElementById('jsonPreview');
const accountsContainer = document.getElementById('accountsContainer');
const btnAddAccount = document.getElementById('btnAddAccount');

// Templates
const accountTemplate = document.getElementById('accountTemplate');
const fileTemplate = document.getElementById('fileTemplate');

// Application State
const formData = {
    client: {},
    accounts: []
};

// Initialize
function init() {
    renderProgressIndicators();
    updateUI();

    // Add one initial account if empty
    if (accountsContainer.children.length === 0) {
        addAccount();
    }
}

// --- Navigation & UI ---

function renderProgressIndicators() {
    progressContainer.innerHTML = '';
    for (let i = 1; i <= TOTAL_STEPS; i++) {
        const dot = document.createElement('div');
        dot.classList.add('step-indicator');
        if (i === currentStep) dot.classList.add('active');
        if (i < currentStep) dot.classList.add('completed');
        progressContainer.appendChild(dot);
    }
}

function updateUI() {
    // Show/Hide Steps
    wizardSteps.forEach(step => {
        if (parseInt(step.dataset.step) === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Update Buttons
    if (currentStep === 1) {
        btnBack.style.visibility = 'hidden';
    } else {
        btnBack.style.visibility = 'visible';
    }

    if (currentStep === TOTAL_STEPS) {
        btnNext.textContent = 'Download JSON';
        generateJSON();
    } else {
        btnNext.textContent = 'Next Step';
    }

    renderProgressIndicators();
}

// --- Event Listeners ---

btnNext.addEventListener('click', () => {
    if (currentStep < TOTAL_STEPS) {
        // Validation could go here
        collectCurrentStepData();
        currentStep++;
        updateUI();
    } else {
        downloadJSON();
    }
});

btnBack.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateUI();
    }
});

btnAddAccount.addEventListener('click', addAccount);

// Event delegation for dynamic elements
accountsContainer.addEventListener('click', (e) => {
    // Remove Account
    if (e.target.classList.contains('btn-remove-account')) {
        const accountBlock = e.target.closest('.account-block');
        accountBlock.remove();
        updateAccountTitles();
    }

    // Add File
    if (e.target.classList.contains('btn-add-file')) {
        const accountBlock = e.target.closest('.account-block');
        const filesContainer = accountBlock.querySelector('.files-container');
        addFileRow(filesContainer);
    }

    // Remove File
    if (e.target.closest('.btn-remove-file')) { // Handle nested span/icon if any, though currently just text
        const fileRow = e.target.closest('.file-row');
        fileRow.remove();
    }
});


// --- Dynamic Form Logic ---

function addAccount() {
    const clone = accountTemplate.content.cloneNode(true);
    const accountBlock = clone.querySelector('.account-block');

    // Add one initial file row
    const filesContainer = accountBlock.querySelector('.files-container');
    addFileRow(filesContainer);

    accountsContainer.appendChild(accountBlock);
    updateAccountTitles();
}

function addFileRow(container) {
    const clone = fileTemplate.content.cloneNode(true);
    container.appendChild(clone);
}

function updateAccountTitles() {
    const accountBlocks = accountsContainer.querySelectorAll('.account-block');
    accountBlocks.forEach((block, index) => {
        const title = block.querySelector('.account-title');
        title.textContent = `Account #${index + 1}`;
    });
}

// --- Data Collection ---

function collectCurrentStepData() {
    if (currentStep === 1) {
        formData.client = {
            name: document.getElementById('clientName').value,
            id: document.getElementById('clientId').value,
            region: document.getElementById('region').value
        };
    } else if (currentStep === 2) {
        const accounts = [];
        const accountBlocks = accountsContainer.querySelectorAll('.account-block');

        accountBlocks.forEach(block => {
            const acc = {
                name: block.querySelector('.acc-name').value,
                glNumber: block.querySelector('.acc-gl').value,
                productCount: block.querySelector('.acc-products').value,
                filesCountManual: block.querySelector('.acc-file-count-manual').value,
                reconciliationLogic: block.querySelector('.acc-logic').value,
                files: []
            };

            const fileRows = block.querySelectorAll('.file-row');
            fileRows.forEach(row => {
                const fileName = row.querySelector('.file-name').value;
                if (fileName) { // Only add if name is not empty
                    acc.files.push({
                        name: fileName,
                        rules: row.querySelector('.file-rules').value
                    });
                }
            });

            accounts.push(acc);
        });
        formData.accounts = accounts;
    }
}

function generateJSON() {
    // Re-collect data to ensure freshness
    // (In a real app, we might rely on state, but here we scrape the DOM on demand for Step 1/2 if needed)
    // Since we navigate away from Step 2 to Step 3, the DOM nodes for Step 2 are hidden but still exist.
    // However, collectCurrentStepData is called ON EXIT from a step.

    const finalData = {
        meta: {
            generatedAt: new Date().toISOString(),
            version: "2.0",
            totalAccounts: formData.accounts.length
        },
        client: formData.client,
        accounts: formData.accounts
    };

    const jsonString = JSON.stringify(finalData, null, 2);
    jsonPreview.textContent = jsonString;
    return jsonString;
}

function downloadJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonPreview.textContent);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `clirec_${formData.client.id || 'onboarding'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Start
init();
