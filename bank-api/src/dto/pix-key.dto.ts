import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PixKeyKind } from '../models/pix-key.model';

export class PixKeyDto {
  @IsString()
  @IsNotEmpty()
  readonly key: string;

  @IsEnum(PixKeyKind)
  readonly kind: PixKeyKind;
}
