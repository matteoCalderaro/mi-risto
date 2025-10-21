import { fetchAllItems, fetchSelectedItems, saveItems } from './services.js';

let allItems = [];
let selectedItems = [];

// Cache DOM elements
const $allItemsSelect = $('#all-items-select');
const $selectedItemsSelect = $('#selected-items-select');
const allItemsSelect = document.querySelector('#all-items-select');
const selectedItemsSelect = document.querySelector('#selected-items-select');

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

// Handle all items select change
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
    
    // Clear and disable selected-items-select
    $selectedItemsSelect.val('').trigger('change');
    
    // Enable selected-items-select
    toggleSelectDisabled(false);
    
    try {
        allItems = await fetchAllItems(allItemsSelect.value);
        updateDualListbox();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Handle selected items select change
async function onSelectedItemsSelectChange() {
    if (selectedItemsSelect.value === '') {
        selectedItems = [];
        updateDualListbox();
        return;
    }
    
    try {
        selectedItems = await fetchSelectedItems(selectedItemsSelect.value);
        updateDualListbox();
    } catch (error) {
        console.error('Error:', error);
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
    const dualListboxInstance = new DualListbox('.dual-list-select', {
        availableTitle: 'CCIAA Bari',
        selectedTitle: 'Milano Ristorazione',
        addButtonText: '>',
        removeButtonText: '<',
        addAllButtonText: '>>',
        removeAllButtonText: '<<',
    });
    
    dualListboxInstance.addEventListener('added', (e) => {
        console.log('Added value:', e.addedElement.dataset.id);
    });
    
    dualListboxInstance.addEventListener('removed', (e) => {
        console.log('Removed value:', e.removedElement.dataset.id);
    });
    
    return dualListboxInstance;
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
        const result = await saveItems(itemsToSave, selectedItemsToSave);
        
        // Update global state with returned data from backend
        allItems = result.allItems;
        selectedItems = result.selectedItems;
        
        // Update UI with fresh data from database
        updateDualListbox();
        
        alert('Items saved successfully!');
    } catch (error) {
        alert(`Error saving items: ${error.message}`);
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