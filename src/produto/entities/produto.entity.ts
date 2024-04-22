import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';

@Entity({ name: 'tb_produtos' })
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  nome: string;

  @IsNotEmpty()
  @Column({ length: 500, nullable: false })
  descricao: string;

  @IsNotEmpty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  preco: number;

  @IsNotEmpty()
  @Column({ length: 500, nullable: false })
  imagem: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.produto, {
    onDelete: 'CASCADE', // se a categoria for deletada, todos os produtos associados também serão deletados
  })
  categoria: Categoria;
}
