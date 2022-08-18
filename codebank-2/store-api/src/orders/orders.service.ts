import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async findProducts(ids: string[]) {
    const products = await this.productRepo.find({
      where: {
        id: In(ids),
      },
    });

    if (products.length < ids.length) {
      throw new BadRequestException(`One or more products could not be found`);
    }

    return products;
  }

  async create(createOrderDto: CreateOrderDto) {
    const products = await this.findProducts(
      createOrderDto.items.map((item) => item.product_id),
    );

    const order = this.orderRepo.create({
      credit_card: {
        cvv: createOrderDto.credit_card.cvv,
        number: createOrderDto.credit_card.number,
        expirationMonth: createOrderDto.credit_card.expiration_month,
        expirationYear: createOrderDto.credit_card.expiration_year,
        name: createOrderDto.credit_card.name,
      },
      items: createOrderDto.items,
    });
    order.items.forEach((item) => {
      const product = products.find(
        (product) => product.id === item.product_id,
      );
      item.price = product.price;
    });
    return this.orderRepo.save(order);
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
