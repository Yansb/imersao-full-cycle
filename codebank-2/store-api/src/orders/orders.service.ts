import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { PaymentService } from './payment/payment.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private paymentService: PaymentService,
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
    const newOrder = this.orderRepo.save(order);
    this.paymentService.payment({
      creditCard: {
        name: createOrderDto.credit_card.name,
        number: createOrderDto.credit_card.number,
        expiration_month: createOrderDto.credit_card.expiration_month,
        expiration_year: createOrderDto.credit_card.expiration_year,
        cvv: createOrderDto.credit_card.cvv,
      },
      amount: order.items.reduce((acc, item) => acc + item.price, 0),
      store: process.env.STORE_NAME,
      description: '',
    });

    return newOrder;
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
