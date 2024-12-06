export const timestampsPlugin = function(schema) {
  schema.pre('save', function(next) {
    const now = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });
    
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now;
    
    next();
  });
}; 