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

const mergedItems = mergeItems(allItems, selectedItems); //?

