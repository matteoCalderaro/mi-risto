// services.js - HTTP request handlers

// Fetch all items from JSON file
export async function fetchAllItems(selectValue) {
    if (selectValue === '1') {
        try {
            const response = await fetch('./json/allitems.json');
            //const response = await fetch(`./json/allitems-${selectValue}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching allitems.json:', error);
            throw error;
        }
    }
    return [];
}

// Fetch selected items from JSON file
export async function fetchSelectedItems(selectValue) {
    if (selectValue === '1') {
        try {
            const response = await fetch('./json/selecteditems.json');
            //const response = await fetch(`./json/selecteditems-${selectValue}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching selecteditems.json:', error);
            throw error;
        }
    }
    return [];
}

// Save items to database
export async function saveItems(itemsToSave, selectedItemsToSave) {
    try {
        // Post unselected items
        const itemsResponse = await fetch('./api/allitems.json', {
            // method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify(itemsToSave)
        });
        
        if (!itemsResponse.ok) {
            throw new Error(`Failed to save items: ${itemsResponse.status}`);
        }
        
        const savedItems = await itemsResponse.json();
        
        // Post selected items
        const selectedItemsResponse = await fetch('./api/selecteditems.json', {
            // method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify(selectedItemsToSave)
        });
        
        if (!selectedItemsResponse.ok) {
            throw new Error(`Failed to save selected items: ${selectedItemsResponse.status}`);
        }
        
        const savedSelectedItems = await selectedItemsResponse.json();
        
        return { 
            success: true, 
            allItems: savedItems,
            selectedItems: savedSelectedItems
        };
        
    } catch (error) {
        console.error('Error saving items:', error);
        throw error;
    }
}