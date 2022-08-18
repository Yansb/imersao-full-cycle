import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreditCard } from './credit-card.embbeded';
import { OrderItem } from './order-item.entity';
export enum OrderStatus {
  Approved = 'approved',
  Pending = 'pending',
}
@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'double precision' })
  total: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column(() => CreditCard, { prefix: '' })
  credit_card: CreditCard;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @Column()
  status: OrderStatus = OrderStatus.Pending;

  @BeforeInsert()
  beforeInsert() {
    this.generateId();
    this.calculateTotal();
  }

  generateId() {
    if (this.id) {
      return;
    }
    this.id = uuid();
  }

  calculateTotal() {
    return (this.total = this.items.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0));
  }
}
