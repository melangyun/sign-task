import { Entity, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { User } from "../user/user.entity";
import { TeamUser } from "./teamuser.entity";
import { Signature } from '../signature/signature.entity';

@Entity()
export class Team extends BaseEntity{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar", nullable:false})
    name!: string;

    @Column({name : "is_active", type:"boolean", nullable:false, default:true})
    isActive!: boolean;

    @Column({type:"varchar", nullable:false})
    leader!: string;
    
    @ManyToOne( type => User, user => user.teams )
    user!: User;

    @OneToMany(type => TeamUser, teamUser => teamUser.team)
    teamUsers!: TeamUser[];

    @OneToMany(type => Signature, signature => signature.team)
    signatures!: Signature[];

    @CreateDateColumn({ name: "create_at" })
    createAt! : Date;

    @UpdateDateColumn({ name: "update_at" })
    updateAt! : Date;
}

