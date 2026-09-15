'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { RECRUITMENT_CATEGORIES, ACADEMY_CATEGORIES } from '@/lib/constants'

export type ActionState = { error?: string; success?: string }

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

const newsletterSchema = z.object({ email: z.string().email('Adresse e-mail invalide') })

export async function subscribeNewsletterAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = newsletterSchema.safeParse({ email: formData.get('email') })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }
  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email.toLowerCase() },
      update: {},
      create: { email: parsed.data.email.toLowerCase() },
    })
  } catch {
    return { error: 'Une erreur est survenue, merci de réessayer.' }
  }
  return { success: 'Merci ! Vous êtes inscrit à la newsletter AKWABA FC.' }
}

// ---------------------------------------------------------------------------
// Recrutement
// ---------------------------------------------------------------------------

const recruitmentSchema = z.object({
  category: z.enum(RECRUITMENT_CATEGORIES),
  fullName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Adresse e-mail invalide'),
  phone: z.string().min(6, 'Numéro de téléphone requis'),
  message: z.string().optional(),
  cvUrl: z.string().url('Lien invalide').optional().or(z.literal('')),
})

export async function submitRecruitmentAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = recruitmentSchema.safeParse({
    category: formData.get('category'),
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message') || undefined,
    cvUrl: formData.get('cvUrl') || undefined,
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }
  await prisma.recruitmentApplication.create({ data: { ...parsed.data, cvUrl: parsed.data.cvUrl || undefined } })
  return { success: 'Votre candidature a bien été envoyée. Merci pour votre intérêt pour AKWABA FC !' }
}

// ---------------------------------------------------------------------------
// Academy — devenir joueur
// ---------------------------------------------------------------------------

const academySchema = z.object({
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  birthDate: z.string().min(1, 'Date de naissance requise'),
  nationality: z.string().min(1, 'Nationalité requise'),
  position: z.string().min(1, 'Poste requis'),
  preferredFoot: z.string().optional(),
  height: z.coerce.number().optional(),
  videoUrl: z.string().url('Lien invalide').optional().or(z.literal('')),
  category: z.enum(ACADEMY_CATEGORIES),
  parentName: z.string().min(1, 'Nom du parent / tuteur requis'),
  parentEmail: z.string().email('Adresse e-mail du parent invalide'),
  parentPhone: z.string().min(6, 'Téléphone du parent requis'),
  parentalConsent: z.literal('on', { message: "L'accord parental est obligatoire pour les mineurs" }),
  message: z.string().optional(),
})

export async function submitAcademyApplicationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = academySchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }
  const { birthDate, parentalConsent, height, videoUrl, ...rest } = parsed.data
  await prisma.academyApplication.create({
    data: {
      ...rest,
      birthDate: new Date(birthDate),
      parentalConsent: parentalConsent === 'on',
      height: height || undefined,
      videoUrl: videoUrl || undefined,
    },
  })
  return { success: "Merci ! Votre candidature a bien été transmise au Centre de Formation AKWABA FC." }
}

// ---------------------------------------------------------------------------
// Billetterie
// ---------------------------------------------------------------------------

const ticketOrderSchema = z.object({
  ticketOfferId: z.string().min(1),
  fullName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Adresse e-mail invalide'),
  phone: z.string().min(6, 'Téléphone requis'),
  quantity: z.coerce.number().min(1).max(10),
})

export async function submitTicketOrderAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = ticketOrderSchema.safeParse({
    ticketOfferId: formData.get('ticketOfferId'),
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    quantity: formData.get('quantity'),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const offer = await prisma.ticketOffer.findUnique({ where: { id: parsed.data.ticketOfferId } })
  if (!offer || offer.remaining < parsed.data.quantity) return { error: 'Places insuffisantes pour cette catégorie.' }

  await prisma.$transaction([
    prisma.ticketOrder.create({
      data: {
        ticketOfferId: parsed.data.ticketOfferId,
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        quantity: parsed.data.quantity,
        status: 'PENDING',
      },
    }),
    prisma.ticketOffer.update({ where: { id: parsed.data.ticketOfferId }, data: { remaining: { decrement: parsed.data.quantity } } }),
  ])
  revalidatePath('/tickets')
  return { success: 'Votre réservation est enregistrée. Le paiement en ligne sera bientôt disponible — vous recevrez vos billets par e-mail.' }
}

// ---------------------------------------------------------------------------
// Boutique
// ---------------------------------------------------------------------------

const cartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  size: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(0),
})

const shopOrderSchema = z.object({
  fullName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Adresse e-mail invalide'),
  phone: z.string().min(6, 'Téléphone requis'),
  address: z.string().min(4, 'Adresse de livraison requise'),
  items: z.array(cartItemSchema).min(1, 'Votre panier est vide'),
})

export async function submitShopOrderAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const itemsRaw = formData.get('items')
  let items: unknown = []
  try {
    items = JSON.parse(String(itemsRaw ?? '[]'))
  } catch {
    return { error: 'Panier invalide' }
  }
  const parsed = shopOrderSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    items,
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const total = parsed.data.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  await prisma.shopOrder.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      address: parsed.data.address,
      items: parsed.data.items,
      total,
      status: 'PENDING',
    },
  })
  return { success: 'Merci pour votre commande ! Le paiement en ligne sera bientôt disponible — notre équipe vous contactera pour finaliser la livraison.' }
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

const contactSchema = z.object({
  fullName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Adresse e-mail invalide'),
  subject: z.string().min(2, 'Sujet requis'),
  message: z.string().min(5, 'Message requis'),
})

export async function submitContactAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = contactSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }
  return { success: 'Merci, votre message a bien été envoyé au club. Nous reviendrons vers vous rapidement.' }
}
