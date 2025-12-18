
import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const app = express();
const SECRET = process.env.JWT_SECRET || 'papua-secret-key-2025';

app.use(express.json());

const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Sesi berakhir, silakan login kembali' });
  
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Sesi tidak valid' });
  }
};

// --- AUTH ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.admin.findUnique({ where: { username } });
  
  if (!user && (await prisma.admin.count()) === 0) {
     if (username === 'admin' && password === 'Papua2025') {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.admin.create({ data: { username, password: hashedPassword } });
        const token = jwt.sign({ username }, SECRET, { expiresIn: '24h' });
        return res.json({ token, username });
     }
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Username atau Password salah' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '24h' });
  res.json({ token, username: user.username });
});

// --- EMPLOYEES CRUD ---
app.get('/api/employees', authenticate, async (req, res) => {
  const data = await prisma.employee.findMany({ orderBy: { nama: 'asc' } });
  res.json(data);
});

app.post('/api/employees', authenticate, async (req, res) => {
  try {
    const employee = await prisma.employee.create({ data: req.body });
    await prisma.auditLog.create({
      data: { user: (req as any).user.username, action: 'CREATE', module: 'EMPLOYEE', details: `Menambahkan pegawai: ${employee.nama}` }
    });
    res.json(employee);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/employees/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.update({ where: { id }, data: req.body });
    await prisma.auditLog.create({
      data: { user: (req as any).user.username, action: 'UPDATE', module: 'EMPLOYEE', details: `Memperbarui data pegawai: ${employee.nama}` }
    });
    res.json(employee);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/employees/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.delete({ where: { id } });
    await prisma.auditLog.create({
      data: { user: (req as any).user.username, action: 'DELETE', module: 'EMPLOYEE', details: `Menghapus pegawai: ${employee.nama}` }
    });
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// --- GENERIC RECORDS CRUD (Pangkat, KGB, Cuti, Mutasi, Disiplin, Arsip) ---
const getPrismaModel = (type: string) => {
  switch (type) {
    case 'promotions': return prisma.promotionRecord;
    case 'kgb': return prisma.kgbRecord;
    case 'leaves': return prisma.leaveRecord;
    case 'disciplines': return prisma.disciplineRecord;
    case 'mutations': return prisma.mutationRecord;
    case 'archives': return prisma.archiveDocument;
    default: return null;
  }
};

app.get('/api/records/:type', authenticate, async (req, res) => {
  const model = getPrismaModel(req.params.type) as any;
  if (!model) return res.status(404).json({ error: 'Modul tidak ditemukan' });
  const data = await model.findMany({ include: { employee: true } });
  res.json(data);
});

app.post('/api/records/:type', authenticate, async (req, res) => {
  const model = getPrismaModel(req.params.type) as any;
  if (!model) return res.status(404).json({ error: 'Modul tidak ditemukan' });
  try {
    const record = await model.create({ data: req.body });
    await prisma.auditLog.create({
      data: { user: (req as any).user.username, action: 'CREATE', module: req.params.type.toUpperCase(), details: `Menambahkan riwayat ${req.params.type}` }
    });
    res.json(record);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/api/records/:type/:id', authenticate, async (req, res) => {
  const model = getPrismaModel(req.params.type) as any;
  if (!model) return res.status(404).json({ error: 'Modul tidak ditemukan' });
  try {
    const record = await model.update({ where: { id: req.params.id }, data: req.body });
    res.json(record);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/records/:type/:id', authenticate, async (req, res) => {
  const model = getPrismaModel(req.params.type) as any;
  if (!model) return res.status(404).json({ error: 'Modul tidak ditemukan' });
  try {
    await model.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// --- SETTINGS ---
app.get('/api/settings', authenticate, async (req, res) => {
  const settings = await prisma.appSetting.findMany();
  const config: Record<string, string> = {};
  settings.forEach(s => config[s.key] = s.value);
  res.json(config);
});

app.put('/api/settings', authenticate, async (req, res) => {
  const { config } = req.body;
  try {
    for (const [key, value] of Object.entries(config)) {
      await prisma.appSetting.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string },
      });
    }
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// --- AUDIT LOGS ---
app.get('/api/logs', authenticate, async (req, res) => {
  const data = await prisma.auditLog.findMany({ take: 100, orderBy: { timestamp: 'desc' } });
  res.json(data);
});

export default app;
