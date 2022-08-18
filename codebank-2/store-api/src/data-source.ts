import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { createProductsTable1660776111245 } from './migrations/1660776111245-createProductsTable';
import { createOrdersTable1660781059311 } from './migrations/1660781059311-create-orders-table';
import { createOrdersItemsTable1660781067958 } from './migrations/1660781067958-create-orders-items-table';
import { OrderItem } from './orders/entities/order-item.entity';
import { Order } from './orders/entities/order.entity';
import { Product } from './products/entities/product.entity';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  logging: true,
  entities: [Product, OrderItem, Order],
  migrations: [
    createProductsTable1660776111245,
    createOrdersTable1660781059311,
    createOrdersItemsTable1660781067958,
  ],
  migrationsRun: true,
  subscribers: [],
});
