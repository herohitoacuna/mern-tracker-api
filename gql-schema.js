// GraphQL dependencies.

const graphql = require('graphql')
const graphqlISODate = require('graphql-iso-date')
const { 
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema
} = graphql
const {
    GraphQLDateTime
} = graphqlISODate

// Mongoose models.

const Member = require('models/member')
const Task = require('models/task')
const Team = require('models/team')

// Object types.

const TeamType = new GraphQLObjectType({
    name: 'Team',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve: (parent, args) => {
                return Task.find({ teamId: parent.id })
            }
        },
        members: {
            type: new GraphQLList(MemberType),
            resolve: (parent, args) => {
                return Member.find({ teamId: parent.id })
            }
        }
    })
})

const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: () => ({
        id: { type: GraphQLID },
        description: { type: GraphQLString },
        teamId: { type: GraphQLString },
        isCompleted: { type: GraphQLBoolean },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },
        team: {
            type: TeamType,
            resolve: (parent, args) => {
                return Team.findById(parent.teamId)
            }
        }
    })
})

const MemberType = new GraphQLObjectType({
    name: 'Member',
    fields: () => ({
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        position: { type: GraphQLString },
        teamId: { type: GraphQLString },
        createdAt: { type: GraphQLDateTime },
        updatedAt: { type: GraphQLDateTime },
        team: {
            type: TeamType,
            resolve: (parent, args) => {
                return Team.findById(parent.teamId)
            }
        }
    })
})

// Query type.

const RootQuery = new GraphQLObjectType({
    name: 'Query',
    fields: {
        teams: {
            type: new GraphQLList(TeamType),
            resolve: (parent, args) => {
                return Team.find({})
            }
        },
        team: {
            type: TeamType,
            args: {
                id: { type: GraphQLString }
            },
            resolve: (parent, args) => {
                return Team.findById(args.id)
            }
        },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve: (parent, args) => {
                return Task.find({})
            }
        },
        task: {
            type: TaskType,
            args: {
                id: { type: GraphQLString }
            },
            resolve: (parent, args) => {
                return Task.findById(args.id)
            }
        },
        members: {
            type: new GraphQLList(MemberType),
            resolve: (parent, args) => {
                return Member.find({})
            }   
        },
        member: {
            type: MemberType,
            args: {
                id: { type: GraphQLString }
            },
            resolve: (parent, args) => {
                return Member.findById(args.id)
            }
        }
    }
})

// Mutation type.

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTeam: {
            type: TeamType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                let team = new Team({
                    name: args.name
                })

                return team.save()
            }
        },
        addTask: {
            type: TaskType,
            args: {
                description: { type: new GraphQLNonNull(GraphQLString) },
                teamId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                let task = new Task({
                    description: args.description,
                    teamId: args.teamId,
                    isCompleted: false,
                })

                return task.save()
            }
        },
        addMember: {
            type: MemberType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                position: { type: new GraphQLNonNull(GraphQLString) },
                teamId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                let member = new Member({
                    firstName: args.firstName,
                    lastName: args.lastName,
                    position: args.position,
                    teamId: args.teamId
                })

                return member.save()
            }
        },
        updateTeam: {
            type: GraphQLBoolean,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                let condition = { _id: args.id }
                let updates = {
                    name: args.name,
                }

                return Team.findOneAndUpdate(condition, updates).then((member, err) => {
                    return (err) ? false: true
                })
            }
        },
        updateTask: {
            type: GraphQLBoolean,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                teamId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                let condition = { _id: args.id }
                let updates = {
                    id: args.id,
                    description: args.description,
                    teamId: args.teamId,
                }

                return Task.findOneAndUpdate(condition, updates).then((member, err) => {
                    return (err) ? false: true
                })
            }
        },
        updateMember: {
            type: GraphQLBoolean,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                position: { type: new GraphQLNonNull(GraphQLString) },
                teamId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                let condition = { _id: args.id }
                let updates = {
                    firstName: args.firstName,
                    lastName: args.lastName,
                    position: args.position,
                    teamId: args.teamId
                }

                return Member.findOneAndUpdate(condition, updates).then((member, err) => {
                    return (err) ? false: true
                })
            }
        },
        taskComplete: {
            type: TaskType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                let condition = { _id: args.id }
                let updates = { isCompleted: true }

                return Task.findOneAndUpdate(condition, updates, (task) => {
                    return task
                })
            }
        },
        deleteTask: {
            type: GraphQLBoolean,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                return Task.findByIdAndRemove(args.id).then((err) => {
                    return true
                })
            }
        },
        deleteMember: {
            type: GraphQLBoolean,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                return Member.findByIdAndRemove(args.id).then((err) => {
                    return true
                })
            }
        },
        deleteTeam: {
            type: GraphQLBoolean,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                return Team.findByIdAndRemove(args.id).then((err) => {
                    return true
                })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})