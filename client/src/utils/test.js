import { createClothingArticle } from './repository.js';

const testClothing = {
    category: 'tops',
    style: 't-shirt',
    color: { R: 255, G: 0, B: 0 },
    vibes: ['casual', 'formal'],
};
  
createClothingArticle(testClothing);