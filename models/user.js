import mongoose from 'mongoose'
// import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

// userSchema.pre('save', function(next){
//     if(!this.isModified('password')) {
//         return next()
//     }

//     bcrypt.hash(this.password, 8 (err, hash) => {
//         if (err) {
//             return next(err)
//         }

//         this.password = hash
//         next()
//     })
// })

// userSchema.methods.checkPassword = function(password) {
//     const passwordHash = this.password
//     return new Promise ((resolve, reject) => {
//         bcrypt.compare(password, passwordHash, (err, same) =>{
//             if (err) {
//                 return reject(err)
//             }
//             resolve(same)
//         })
//     })
// }

export default mongoose.model('user', userSchema)
