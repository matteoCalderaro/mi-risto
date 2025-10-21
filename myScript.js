import { fetchAllItems, fetchSelectedItems, saveItems } from './services.js';

let allItems = [];
let selectedItems = [];
const SIMULATED_LATENCY = 1000;

// Cache DOM elements
const $allItemsSelect = $('#all-items-select');
const $selectedItemsSelect = $('#selected-items-select');
const allItemsSelect = document.querySelector('#all-items-select');
const selectedItemsSelect = document.querySelector('#selected-items-select');
const spinnerElement = document.querySelector('#loading-overlay-bs');

// --- SPINNER MANAGEMENT ---
function showSpinner() {
    if (spinnerElement) {
        spinnerElement.classList.remove('d-none');
    }
}

function hideSpinner() {
    if (spinnerElement) {
        spinnerElement.classList.add('d-none');
    }
}
// --------------------------

// Helper function to disable/enable select
function toggleSelectDisabled(isDisabled) {
    $selectedItemsSelect.prop('disabled', isDisabled).trigger('change');
}

// Initialize Select2 on both selects
function initializeSelect2() {
    $allItemsSelect.select2({
        placeholder: 'Seleziona una CCIA',
        allowClear: true,
        width: '100%'
    });
    
    $selectedItemsSelect.select2({
        placeholder: 'Seleziona un prodotto',
        allowClear: true,
        width: '100%'
    });

    toggleSelectDisabled(true);
    
    // Listen to Select2 change events
    $allItemsSelect.on('change', onAllItemsSelectChange);
    $selectedItemsSelect.on('change', onSelectedItemsSelectChange);
}

/////////////////////////////////////////////////
// SELECTS CHANGE LISTENERS + HTTP REQUESTS
/////////////////////////////////////////

// ALL-ITEMS SELECT
async function onAllItemsSelectChange() {
    if (allItemsSelect.value === '') {
        allItems = [];
        selectedItems = [];
        
        // Clear and disable selected-items-select
        $selectedItemsSelect.val('').trigger('change');
        toggleSelectDisabled(true);
        
        updateDualListbox();
        return;
    }
    
    selectedItems = [];
    
    // Clear and enable selected-items-select
    $selectedItemsSelect.val('').trigger('change');
    toggleSelectDisabled(false);
    
    try {
        showSpinner();
        
        allItems = await fetchAllItems(allItemsSelect.value);
        
        // Simulate latency for UI update
        setTimeout(() => {
            updateDualListbox();
            hideSpinner();
        }, SIMULATED_LATENCY);
        
    } catch (error) {
        console.error('Error:', error);
        hideSpinner();
    }
}

// sELECTED-ITEMS SELECT
async function onSelectedItemsSelectChange() {
    if (selectedItemsSelect.value === '') {
        selectedItems = [];
        updateDualListbox();
        toggleDualListboxAddButtons(true);
        return;
    }
    
    try {
        showSpinner();
        
        selectedItems = await fetchSelectedItems(selectedItemsSelect.value);
        
        // Simulate latency for UI update
        setTimeout(() => {
            updateDualListbox();
            toggleDualListboxAddButtons(false);
            hideSpinner();
        }, SIMULATED_LATENCY);
        
    } catch (error) {
        console.error('Error:', error);
        hideSpinner();
    }
}

function mergeItems(allItems, selectedItems) {
    return [...allItems, ...selectedItems];
}

function populateSelect(data) {
    const selectElement = document.querySelector('.dual-list-select');
    selectElement.innerHTML = ''; 
    
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        
        if (item.selected) {
            option.setAttribute('selected', 'selected');
        }
        
        selectElement.appendChild(option);
    });
}

function createDualListboxInstance() {
    const instance = new DualListbox('.dual-list-select', {
        availableTitle: 'CCIAA Bari',
        selectedTitle: 'Milano Ristorazione',
        addButtonText: '>',
        removeButtonText: '<',
        addAllButtonText: '>>',
        removeAllButtonText: '<<',
        enableDoubleClick: false,
        draggable: false
    });
    toggleDualListboxAddButtons(selectedItemsSelect.value === '');
}

function toggleDualListboxAddButtons(disabled) {
    let buttons = document.querySelectorAll('.dual-listbox__button')
    buttons.forEach(button =>{
       button.disabled = disabled;
    })
}

function updateDualListbox() {
    const mergedItems = mergeItems(allItems, selectedItems);
    populateSelect(mergedItems);
    
    // Destroy previous instance if it exists
    const existingListbox = document.querySelector('.dual-listbox');
    if (existingListbox) {
        existingListbox.remove();
    }
    
    createDualListboxInstance();
}

function initializeDualListbox() {
    const mergedItems = mergeItems(allItems, selectedItems);
    populateSelect(mergedItems);
    createDualListboxInstance();
}

// Extract selected and unselected items from dual-list-select
function extractItemsFromDualListbox() {
    const selectElement = document.querySelector('.dual-list-select');
    const allOptions = Array.from(selectElement.options);
    
    const selectedItemsToSave = allOptions
        .filter(option => option.selected)
        .map(option => ({
            id: option.value,
            name: option.textContent,
            selected: true
        }));
    
    const itemsToSave = allOptions
        .filter(option => !option.selected)
        .map(option => ({
            id: option.value,
            name: option.textContent
        }));
    
    return { itemsToSave, selectedItemsToSave };
}

// Handle save button click
async function onSaveButtonClick() {
    try {
        const { itemsToSave, selectedItemsToSave } = extractItemsFromDualListbox();
        
        showSpinner();
        const result = await saveItems(itemsToSave, selectedItemsToSave);
        
        allItems = result.allItems;
        selectedItems = result.selectedItems;
        
        // Simulate latency for UI update
        setTimeout(() => {
            updateDualListbox();
            
            alert('Items saved successfully!');
            hideSpinner();
        }, SIMULATED_LATENCY);
        
    } catch (error) {
        alert(`Error saving items: ${error.message}`);
        hideSpinner();
    }
}

// Attach save button listener
function attachSaveButtonListener() {
    const saveButton = document.querySelector('.save-items-button');
    if (saveButton) {
        saveButton.addEventListener('click', onSaveButtonClick);
    }
}

function initialize() {
    initializeSelect2();
    initializeDualListbox();
    attachSaveButtonListener();
}

document.addEventListener('DOMContentLoaded', initialize);