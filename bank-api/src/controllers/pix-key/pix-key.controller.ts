import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { firstValueFrom } from 'rxjs';
import { PixKeyExistsDto } from 'src/dto/pix-key-exists.dto';
import { PixKeyDto } from 'src/dto/pix-key.dto';
import { PixService } from 'src/grpc-types/pix-service.grpc';
import { BankAccount } from 'src/models/bank-account.model';
import { PixKey } from 'src/models/pix-key.model';
import { Repository } from 'typeorm';

@Controller('bank-accounts/:bankAccountId/pix-keys')
export class PixKeyController {
  constructor(
    @InjectRepository(PixKey) private PixKeyRepo: Repository<PixKey>,
    @InjectRepository(BankAccount)
    private bankAccountRepo: Repository<BankAccount>,
    @Inject('CODEPIX_PACKAGE') private client: ClientGrpc,
  ) {}

  @Get()
  index(
    @Param('bankAccountId', new ParseUUIDPipe({ version: '4' }))
    bankAccountId: string,
  ) {
    return this.PixKeyRepo.find({
      where: {
        bank_account_id: bankAccountId,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  @Post()
  async store(
    @Param('bankAccountId', new ParseUUIDPipe({ version: '4' }))
    bankAccountId: string,
    @Body(new ValidationPipe({ errorHttpStatusCode: 422 })) body: PixKeyDto,
  ) {
    await this.bankAccountRepo.findOneOrFail(bankAccountId);

    const pixService = this.client.getService<PixService>('PixService');
    const notFound = await this.checkPixKeyNotFound(body);
    if (!notFound) {
      throw new UnprocessableEntityException('PixKey already exists');
    }

    const createdPixKey = await firstValueFrom(
      pixService.registerPixKey({
        ...body,
        accountId: bankAccountId,
      }),
    );

    if (createdPixKey.error) {
      throw new InternalServerErrorException(createdPixKey.error);
    }

    const newPixKey = this.PixKeyRepo.create({
      id: createdPixKey.id,
      bank_account_id: bankAccountId,
      ...body,
    });

    return await this.PixKeyRepo.save(newPixKey);
  }

  async checkPixKeyNotFound(params: { key: string; kind: string }) {
    const pixService = this.client.getService<PixService>('PixService');
    try {
      await firstValueFrom(pixService.find(params));
      return false;
    } catch (error) {
      if (error.details == 'no key was found') {
        return true;
      }
      throw new InternalServerErrorException('Server not available');
    }
  }

  @Get('exists')
  @HttpCode(204)
  async exists(
    @Query(new ValidationPipe({ errorHttpStatusCode: 422 }))
    params: PixKeyExistsDto,
  ) {
    const pixService = this.client.getService<PixService>('PixService');
    try {
      await firstValueFrom(pixService.find(params));
    } catch (error) {
      if (error.details == 'no key was found') {
        throw new NotFoundException(error.details);
      }
      throw new InternalServerErrorException('Server not available');
    }
  }
}
