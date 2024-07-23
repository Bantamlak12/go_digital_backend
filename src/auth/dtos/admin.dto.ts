import { Expose } from 'class-transformer';

export class AdminDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
