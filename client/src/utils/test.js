import { createClothingArticle } from './repository.js';

const testClothing = {
    category: 'outerwear',
    style: 'none',
    color: { R: 0, G: 0, B: 0 },
    vibes: ['casual', 'formal', 'party', 'athletic'],
  };
  
  createClothingArticle(testClothing);