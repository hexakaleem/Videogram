import mongoose, {Schema} from 'mongoose'

const subscriptionSchema = new Schema(
    {
        // The one who is subscribing
        subscriber: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        // One who is being subscriber
        channel: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {timestamps: true}
)

subscriptionSchema.index(
    { subscriber: 1, channel: 1 },
    { unique: true }
)


export const Subscription = mongoose.model("Subscription", subscriptionSchema)