import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Signature {

@PrimaryColumn({type : "varchar"})
id!: string;

@Column({type:"varchar", nullable:false})
url!: string;

@Column({name : "is_active", type:"boolean", nullable:false, default:true})
isActive!: boolean;

}