import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from './../entities/produto.entity';
import { DeleteResult, LessThan, Like, MoreThan, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoriaService } from '../../categoria/service/categoria.service';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    private categoriaService: CategoriaService,
  ) {}

  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find({
      relations: {
        categoria: true,
      },
    });
  }

  async findById(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: {
        id,
      },

      relations: {
        categoria: true,
      },
    });

    if (!produto) {
      throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);
    }

    return produto;
  }

  async findByNome(nome: string): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: {
        nome: Like(`%${nome}%`),
      },

      relations: {
        categoria: true,
      },
    });
  }

  async findByPriceRange(): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: [{ preco: MoreThan(100) }, { preco: LessThan(300) }],
      relations: {
        categoria: true,
      },
    });
  }

  async create(produto: Produto): Promise<Produto> {
    if (produto.categoria) {
      const categoria = await this.categoriaService.findById(
        produto.categoria.id,
      );

      if (!categoria) {
        throw new HttpException(
          'Categoria não encontrada!',
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.produtoRepository.save(produto);
    }

    return await this.produtoRepository.save(produto);
  }

  async update(produto: Produto): Promise<Produto> {
    const produtoEncontrado: Produto = await this.findById(produto.id);

    if (!produtoEncontrado || !produto.id) {
      throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);
    }

    if (produto.categoria) {
      const categoria = await this.categoriaService.findById(
        produto.categoria.id,
      );

      if (!categoria) {
        throw new HttpException(
          'Categoria não encontrada!',
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.produtoRepository.save(produto);
    }

    return await this.produtoRepository.save(produto);
  }

  async delete(id: number): Promise<DeleteResult> {
    const produtoEncontrado = await this.findById(id);

    if (!produtoEncontrado) {
      throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);
    }

    return await this.produtoRepository.delete(id);
  }
}
