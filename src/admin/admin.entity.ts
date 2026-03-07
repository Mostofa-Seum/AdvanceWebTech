import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity()
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;
  
  @Column()
  password: string;
}

// --- NEW USER CATEGORY 3 ENTITY ---
let idCounter = 1;
@Entity('user_category_3')
export class UserCategory3Entity {
  @PrimaryColumn()
  Id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @BeforeInsert()
  generateId() {
  this.Id = idCounter.toString();
    idCounter++;
  }
}