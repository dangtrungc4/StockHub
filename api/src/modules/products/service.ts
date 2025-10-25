import { prisma } from '@/lib/prisma.js'

export const list = async (q?: string, page=1, pageSize=25) => {
  const where = q ? { OR: [ { name: { contains: q } }, { sku: { contains: q } } ] } : {}
  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, skip: (page-1)*pageSize, take: pageSize, orderBy: { id: 'desc' } }),
    prisma.product.count({ where })
  ])
  return { items, total, page, pageSize }
}
export const create = (data: { sku: string; name: string; price: number; stock: number }) => prisma.product.create({ data })
export const update = (id: number, data: Partial<{ sku: string; name: string; price: number; stock: number }>) => prisma.product.update({ where: { id }, data })
export const remove = (id: number) => prisma.product.delete({ where: { id } })
