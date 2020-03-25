import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class User {

@PrimaryColumn({type : "varchar"})
id!: string;

@Column({type:"varchar", nullable:false})
nickname!: string;

@Column({type:"varchar", nullable:false})
password!: string;

@Column({type:"varchar", nullable:false})
salt!: string;

@Column({name:"is_active",type:"varchar", nullable:false, default: true})
isActive!: string;

@Column({type:"varchar", nullable:false})
refreshToken!: string;

}