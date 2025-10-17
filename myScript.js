const allItems = [
    { id: '1', name: 'Apple' },
    { id: '2', name: 'Banana' },
    { id: '3', name: 'Cherry' },
    { id: '4', name: 'Date' },
    { id: '5', name: 'Elderberry' },
];

const selectedItems = [
    { id: '1', name: 'Apple' }
];

function mergeItems(allItems, selectedItems) {
  return allItems.map(item => { 
    const selectedItem = selectedItems.find(selected => selected.id === item.id);
    return {
      ...item,
      selected: !!selectedItem
    };
  });
}

const mergedItems = mergeItems(allItems, selectedItems);


function populateSelect(data) {
    const selectElement = document.querySelector('.select1');
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


function initializeDualListbox() {
   
    populateSelect(mergedItems); 
    
    const dualListboxInstance = new DualListbox('.select1', {
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
    
}

document.addEventListener('DOMContentLoaded', initializeDualListbox);
