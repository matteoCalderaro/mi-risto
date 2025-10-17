const allAvailableItems = [
    { id: '1', name: 'Apple' },
    { id: '2', name: 'Banana' },
    { id: '3', name: 'Cherry' },
    { id: '4', name: 'Date' },
    { id: '5', name: 'Elderberry' },
];


const initiallySelectedIds = ['1', '2']; 


function populateSelect(data, selectedIds) {
    const selectElement = document.querySelector('.select1');
    selectElement.innerHTML = ''; 
    
    const selectedIdSet = new Set(selectedIds);
    
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        
        if (selectedIdSet.has(item.id)) {
            option.setAttribute('selected', 'selected');
        }
        
        selectElement.appendChild(option);
    });
}


function initializeDualListbox() {
   
    populateSelect(allAvailableItems,initiallySelectedIds ); 
    
    const dualListboxInstance = new DualListbox('.select1', {
        availableTitle: 'CCIAA Bari',
        selectedTitle: 'Milano Ristorazione',
        addButtonText: '>',
        removeButtonText: '<',
        addAllButtonText: '>>',
        removeAllButtonText: '<<',
        // ========== NEW CODE ==========
        sortFunction: (a, b) => {
            // Preserve insertion order by comparing order property
            return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
        }
        // ==============================
    });
    

    dualListboxInstance.addEventListener('added', (e) => {
        console.log('Added value:', e.addedElement.dataset.id);
    });
    
    dualListboxInstance.addEventListener('removed', (e) => {
        console.log('Removed value:', e.removedElement.dataset.id);
    });
    
}

document.addEventListener('DOMContentLoaded', initializeDualListbox);