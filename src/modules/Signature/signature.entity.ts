import { Entity, PrimaryColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from "../user/user.entity"

@Entity()
export class Signature {

@PrimaryColumn("uuid")
id!: string;

@Column({type:"varchar", nullable:false})
url!: string;

@Column({type:"varchar", nullable:true})
desc!: string;

@Column({name : "is_active", type:"boolean", nullable:false, default:true})
isActive!: boolean;

@ManyToOne( type => User, user => user.signatures )
user!: User;

@CreateDateColumn({ name: "create_at" })
createAt! : Date;

@UpdateDateColumn({ name: "update_at" })
updateAt! : Date;

}