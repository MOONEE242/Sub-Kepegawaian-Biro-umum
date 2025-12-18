
import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Singleton Prisma Client untuk Vercel
// Fix: Use globalThis instead of global to avoid "Cannot find name 'global'" error in some environments
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const app = express();
const SECRET = process.env.JWT_SECRET || 'papua-secret-key-2025';

app.use(express.json());

const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Sesi berakhir' });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Token tidak valid' });
  }
};

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.admin.findUnique({ where: { username } });
  
  // Jika database kosong, izinkan login pertama dengan admin:Papua2025
  if (!user && (await prisma.admin.count()) === 0) {
     if (username === 'admin' && password === 'Papua2025') {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.admin.create({ data: { username, password: hashedPassword } });
        const token = jwt.sign({ username }, SECRET, { expiresIn: '24h' });
        return res.json({ token, username });
     }
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Kredensial salah' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '24h' });
  res.json({ token, username: user.username });
});

app.get('/api/employees', authenticate, async (req, res) => {
  const data = await prisma.employee.findMany({ orderBy: { nama: 'asc' } });
  res.json(data);
});

app.post('/api/employees', authenticate, async (req, res) => {
  try {
    const employee = await prisma.employee.create({ data: req.body });
    await prisma.auditLog.create({
      data: { user: (req as any).user.username, action: 'CREATE', module: 'EMPLOYEE', details: `Pegawai ${employee.nama} ditambahkan` }
    });
    res.json(employee);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/records/:type', authenticate, async (req, res) => {
  const { type } = req.params;
  const include = { employee: true };
  if (type === 'promotions') res.json(await prisma.promotionRecord.findMany({ include }));
  else if (type === 'kgb') res.json(await prisma.kgbRecord.findMany({ include }));
  else if (type === 'leaves') res.json(await prisma.leaveRecord.findMany({ include }));
  else if (type === 'disciplines') res.json(await prisma.disciplineRecord.findMany({ include }));
  else if (type === 'mutations') res.json(await prisma.mutationRecord.findMany({ include }));
  else if (type === 'archives') res.json(await prisma.archiveDocument.findMany({ include }));
  else res.status(404).json({ error: 'Not found' });
});

app.get('/api/logs', authenticate, async (req, res) => {
  const data = await prisma.auditLog.findMany({ take: 100, orderBy: { timestamp: 'desc' } });
  res.json(data);
});

export default app;