import { Entity, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from "../user/user.entity";
import { TeamUser } from "./teamuser.entity";

@Entity()
export class Team {

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

    @CreateDateColumn({ name: "create_at" })
    createAt! : Date;

    @UpdateDateColumn({ name: "update_at" })
    updateAt! : Date;
}

