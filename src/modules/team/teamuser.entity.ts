import { Entity, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";
import { Team } from "./team.entity";
import { User } from "../user/user.entity";

@Entity()
export class TeamUser extends BaseEntity{
    @ManyToOne( type => Team, team => team.teamUsers, { primary: true } )
    team!: Team;

    @ManyToOne( type => User, user => user.teamUsers, { primary: true })
    user!: User;

    @Column({ type:"simple-json", nullable: false, default:'{"lookup":false,"add":false,"delete":false}'})
    auth!: { "lookup" : boolean, "add" : boolean, "delete" : boolean };

    @CreateDateColumn({ name: "create_at" })
    createAt! : Date;

    @UpdateDateColumn({ name: "update_at" })
    updateAt! : Date;

}