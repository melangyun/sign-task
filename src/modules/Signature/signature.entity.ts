import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { User } from "../user/user.entity"

@Entity()
export class Signature {

@PrimaryColumn({type : "varchar"})
id!: string;

@Column({type:"varchar", nullable:false})
url!: string;

@Column({name : "is_active", type:"boolean", nullable:false, default:true})
isActive!: boolean;

@ManyToOne( type => User, user => user.signatures )
user!: User;

}