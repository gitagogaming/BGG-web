


//     const filterItems = ({currentPath,  searchQuery, items, setItems}) => {
//         let filteredItems;

//         console.log("Path:", currentPath);
//         console.log("Query:",  searchQuery);

//         if ( searchQuery) {
//             // Filter items based on search query
//             filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
//         } else {
//             // Filter items based on current path
//             filteredItems = items.filter(item => {
//                 const itemPath = item.path || '';
//                 return itemPath.startsWith(currentPath) && itemPath.split('/').length === currentPath.split('/').length + 1;
//             });
//         }

//         // Sort items so folders appear at the top
//         filteredItems.sort((a, b) => {
//             if (a.type === 'folder' && b.type !== 'folder') return -1;
//             if (a.type !== 'folder' && b.type === 'folder') return 1;
//             return a.name.localeCompare(b.name);
//         });

//         console.log('Filtered items:', filteredItems);
//         setItems(filteredItems);
//     };



    

// export default filterItems;