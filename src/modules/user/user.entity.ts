import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Signature } from "../Signature/signature.entity";
import { Team } from "../team/team.entity";
import { TeamUser } from "../team/teamuser.entity";

@Entity()
export class User {

@PrimaryColumn({type : "varchar"})
id!: string;

@Column({type:"varchar", nullable:false})
nickname!: string;

@Column({type:"varchar", nullable:false})
password!: string;

@Column({name:"is_active",type:"varchar", nullable:false, default: true})
isActive!: boolean;

@Column({type:"varchar", nullable:true})
refreshToken!: string;

@OneToMany( type => Signature , signature => signature.user)
signatures!: Signature[];

@OneToMany( type => Team , signature => signature.user)
teams!: Team[];

@OneToMany( type => TeamUser , teamUser => teamUser.user)
teamUsers!: TeamUser[];

@CreateDateColumn({ name: "create_at" })
createAt! : Date;

@UpdateDateColumn({ name: "update_at" })
updateAt! : Date;

}