import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { UserAlreadyExistsException } from '../services/errors/user-already-exists'
import { makeRegisterService } from '../services/factories/make-register.service'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { name, email, password } = registerBodySchema.parse(request.body)
  
  try {
    const registerService = makeRegisterService()

    await registerService.execute({ name, email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistsException) return reply.status(409).send({
      message: err.message
    })

    throw err
  }

  return reply.status(201).send()
}
