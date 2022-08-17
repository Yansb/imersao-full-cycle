export interface Product{
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
  price: number;
  created_at: Date;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Product 1',
    price: 100,
    image_url: 'https://source.unsplash.com/random?product',
    slug: 'test-product-1',
    created_at: new Date(),
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.',
  },
  {
    id: '2',
    name: 'Product 2',
    price: 500,
    image_url: `https://source.unsplash.com/random?product-${Math.random()}`,
    slug: 'test-product-2',
    created_at: new Date(),
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.',
  }
]