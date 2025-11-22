// Utility function to sort sizes in the preferred order
export const sortSizes = (sizes) => {
  if (!Array.isArray(sizes)) return [];
  
  // Define the preferred order for t-shirt sizes
  const sizeOrder = ['S', 'M', 'L', 'XS', 'XL', 'XXL'];
  
  // For pants sizes (numeric), sort numerically
  const isNumericSizes = sizes.every(size => !isNaN(parseInt(size)));
  
  if (isNumericSizes) {
    return [...sizes].sort((a, b) => parseInt(a) - parseInt(b));
  }
  
  // For t-shirt sizes, sort according to preferred order
  return [...sizes].sort((a, b) => {
    const indexA = sizeOrder.indexOf(a);
    const indexB = sizeOrder.indexOf(b);
    
    // If both sizes are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // If only one is in the order array, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    // If neither is in the order array, sort alphabetically
    return a.localeCompare(b);
  });
};
