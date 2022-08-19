import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreditCard } from '../entities/credit-card.embbeded';

interface PaymentData {
  creditCard: {
    name: string;
    number: string;
    expiration_month: number;
    expiration_year: number;
    cvv: string;
  };
  amount: number;
  store: string;
  description: string;
}

interface PaymentGrpcService {
  payment(data): Observable<void>;
}

@Injectable()
export class PaymentService implements OnModuleInit {
  private paymentGrpcService: PaymentGrpcService;
  constructor(@Inject('PAYMENT_PACKAGE') private grpcClient: ClientGrpc) {}

  onModuleInit() {
    this.paymentGrpcService =
      this.grpcClient.getService<PaymentGrpcService>('PaymentService');
  }

  payment(data: PaymentData) {
    return this.paymentGrpcService.payment(data).toPromise();
  }
}
