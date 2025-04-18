// Class for creating package items
export class CreatePackagesItemDto {
  constructor(description = '') {
    this.description = description;
  }
  
  // Validate the item
  validate() {
    return this.description && this.description.trim() !== '';
  }
}
