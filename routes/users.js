import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/user'
import validateRegisterInput from '../middlewares/signUp'
import validateLoginInput from '../middlewares/signIn'

const router = express.Router()

/**
 * @description POST api/users/register route
 * @access  public
 */
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email already exist' })
    }
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password

    })
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err
        newUser.password = hash
        newUser
          .save()
          .then(user => res.status(200).json(user))
          .catch(err => res.status(500).json({ err }))
      })
    })
  })
})

/**
 * @description POST api/users/login route
 * @access  public
 */
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  const email = req.body.email
  const password = req.body.password
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ msg: 'Username or password is Incorrect' })
      }
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          return res
            .status(400)
            .json({ status: 'fail', msg: 'Username or password is Incorrect' })
        }
        const payload = {
          id: user.id,
          user: user.name

        }
        jwt.sign(
          payload,
          process.env.secretkey,
          { expiresIn: 3600 },
          (err, token) => {
            res.status(200).json({
              status: 'success',
              token: 'Bearer ' + token
            })
          }
        )
      })
    })
    .catch(err => res.status(500).json({ err }))
})
module.exports = router
