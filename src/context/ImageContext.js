import React, { createContext, useContext, useState, useEffect } from 'react';

const ImageContext = createContext();


// not sure if we actually need this.. hmm

export const useImageContext = () => {
  return useContext(ImageContext);
};

export const ImageProvider = ({ children }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  
  // Fetch images function
  const fetchImages = async (folderName) => {
    try {
      const response = await fetch(`/api/fetchImages?folderName=${folderName}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPhotos(data);
      setFilteredPhotos(data); // Initialize filteredPhotos
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = ({ currentPath, searchQuery, items}) => {
    let filteredItems;

    console.log("Path:", currentPath);
    console.log("Query:", searchQuery);

    if (searchQuery) {
      filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      filteredItems = items.filter(item => {
        const itemPath = item.path || '';
        return itemPath.startsWith(currentPath) && itemPath.split('/').length === currentPath.split('/').length + 1;
      });
    }

    filteredItems.sort((a, b) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });

    console.log('Filtered items:', filteredItems);
    setFilteredPhotos(filteredItems);
  };


//   const filterItems = (query) => {
//     let filteredItems;
//     if (query) {
//       filteredItems = photos.filter(item => item.public_id.toLowerCase().includes(query.toLowerCase()));
//     } else {
//       filteredItems = photos;
//     }
//     setFilteredPhotos(filteredItems);
//   };

  useEffect(() => {
    fetchImages('BGGTOOL_LOGOS'); // Fetch images on mount
  }, []);

  return (
    <ImageContext.Provider value={{ photos, loading, filteredPhotos, filterItems, setLoading }}>
      {children}
    </ImageContext.Provider>
  );
};
