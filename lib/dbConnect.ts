import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
  throw new Error('No se encontró la variable MONGODB_URI en .env.local');
}

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(m => m);
    console.log("Conexión exitosa a MongoDB")
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
