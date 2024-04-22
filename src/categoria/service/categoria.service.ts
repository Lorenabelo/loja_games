import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Categoria } from './../entities/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      relations: {
        produto: true,
      },
    });
  }

  async findById(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: {
        id,
      },

      relations: {
        produto: true,
      },
    });

    if (!categoria) {
      throw new HttpException(
        'Categoria não encontrada!',
        HttpStatus.NOT_FOUND,
      );
    }

    return categoria;
  }

  async findByNome(nome: string): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      where: {
        nome: Like(`%${nome}%`),
      },

      relations: {
        produto: true,
      },
    });
  }

  async create(categoria: Categoria): Promise<Categoria> {
    return await this.categoriaRepository.save(categoria);
  }

  async update(categoria: Categoria): Promise<Categoria> {
    const buscaCategoria: Categoria = await this.findById(categoria.id);

    if (!buscaCategoria || !categoria.id) {
      throw new HttpException(
        'Categoria não encontrada!',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.categoriaRepository.save(categoria);
  }

  async delete(id: number): Promise<DeleteResult> {
    const buscaCategoria = await this.findById(id);

    if (!buscaCategoria) {
      throw new HttpException('Tema não encontrado!', HttpStatus.NOT_FOUND);
    }

    return await this.categoriaRepository.delete(id);
  }
}
