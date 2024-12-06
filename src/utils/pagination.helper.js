export const paginateResults = (items, { page = 1, limit = 10 }) => {
    // 1. Convertir parámetros a números
    const pageNum = parseInt(page);     // ej: page = 2
    const limitNum = parseInt(limit);   // ej: limit = 2
    const skip = (pageNum - 1) * limitNum;  // ej: (2-1) * 2 = 2
  
    // 2. Calcular totales
    const totalItems = items.length;    // ej: 5 items
    const totalPages = Math.ceil(totalItems / limitNum);  // ej: Math.ceil(5/2) = 3 páginas
  
    return {
      // 3. Cortar array según paginación
      items: items.slice(skip, skip + limitNum),
      // 4. Metadata útil para frontend
      metadata: {
        total: totalItems,         
        currentPage: pageNum,      
        totalPages,                 
        itemsPerPage: limitNum,   
        hasNextPage: pageNum < totalPages,  
        hasPrevPage: pageNum > 1    
      }
    };
  };