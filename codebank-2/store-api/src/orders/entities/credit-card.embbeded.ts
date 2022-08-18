import { Exclude, Expose } from 'class-transformer';
import { Column } from 'typeorm';

export class CreditCard {
  @Exclude()
  @Column({ name: 'credit_card_number' })
  number: string;

  @Column({ name: 'credit_card_expiration_month' })
  expirationMonth: number;

  @Column({ name: 'credit_card_expiration_year' })
  expirationYear: number;

  @Exclude()
  @Column({ name: 'credit_card_cvv' })
  cvv: string;

  @Exclude()
  @Column({ name: 'credit_card_name' })
  name: string;

  @Expose({ name: 'number' })
  maskedNumber() {
    return '**** **** **** ' + this.number.substr(this.number.length - 4);
  }
}
