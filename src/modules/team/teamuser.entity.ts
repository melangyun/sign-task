import { Entity, ManyToOne, Column, JoinColumn } from "typeorm";
import { Team } from "./team.entity";
import { User } from "../user/user.entity";

@Entity()
export class TeamUser{
    @ManyToOne( type => Team, team => team.teamUsers, {primary: true} )
    // @JoinColumn({name: "team_id"})
    team!: Team;

    @ManyToOne( type => User, user => user.teamUsers, {primary: true})
    // @JoinColumn({name: "user_id"})
    user!: User;

    @Column({
        type:"simple-json",
        nullable: false,
        default:JSON.stringify({"lookup" : false, "add" : false, "delete": false})
    })
    auth : { "lookup" : boolean, "add" : boolean, "delete": boolean };

}