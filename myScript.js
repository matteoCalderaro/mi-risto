let allItems = [];
let selectedItems = [];

// Fetch all items from JSON file
async function fetchAllItems() {
  try {
    const response = await fetch('/json/allitems.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allItems = await response.json();
    updateDualListbox();
  } catch (error) {
    console.error('Error fetching allitems.json:', error);
  }
}

// Fetch selected items from JSON file
async function fetchSelectedItems() {
  try {
    const response = await fetch('/json/selecteditems.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    selectedItems = await response.json();
    updateDualListbox();
  } catch (error) {
    console.error('Error fetching selecteditems.json:', error);
  }
}

function mergeItems(allItems, selectedItems) {
  return allItems.map(item => { 
    const selectedItem = selectedItems.find(selected => selected.id === item.id);
    return {
      ...item,
      selected: !!selectedItem
    };
  });
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

function initializeEventListeners() {
  const allItemsSelect = document.querySelector('.all-items-select');
  const selectedItemsSelect = document.querySelector('.selected-items-select');
  
  if (allItemsSelect) {
    allItemsSelect.addEventListener('change', fetchAllItems);
  }
  
  if (selectedItemsSelect) {
    selectedItemsSelect.addEventListener('change', fetchSelectedItems);
  }
}

function initializeDualListbox() {
  const mergedItems = mergeItems(allItems, selectedItems);
  populateSelect(mergedItems);
  createDualListboxInstance();
}

function initialize() {
  initializeEventListeners();
  initializeDualListbox();
}

document.addEventListener('DOMContentLoaded', initialize);