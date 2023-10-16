import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrintShop } from 'src/entity/print-shop.entity';
import { Repository } from 'typeorm';
import { CreatePrintShopDto } from './dto/create-print-shop.dto';
import { UpdatePrintShopDto } from './dto/update-print-shop.dto';

@Injectable()
export class PrintShopService {
  constructor(
    @InjectRepository(PrintShop)
    private printShopRepository: Repository<PrintShop>,
  ) {}

  async findAll(page: number, size: number): Promise<PrintShop[]> {
    if (page < 1)
      throw new HttpException('page should be greater than 0.', 400);
    return await this.printShopRepository.find({
      skip: (page - 1) * size,
      take: size,
    });
  }

  async findOne(id: number): Promise<PrintShop> {
    return await this.printShopRepository.findOneBy({ id });
  }

  async create(printShop: CreatePrintShopDto): Promise<PrintShop> {
    return await this.printShopRepository.save(printShop);
  }

  async update(id: number, printShop: UpdatePrintShopDto): Promise<PrintShop> {
    await this.printShopRepository.update(id, printShop);
    return await this.printShopRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<PrintShop> {
    const printShop = await this.printShopRepository.findOneBy({ id });
    await this.printShopRepository.delete(id);
    return printShop;
  }
}
