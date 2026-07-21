const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Berhasil terhubung ke MongoDB Atlas!'))
  .catch((err) => console.log('❌ Gagal terhubung ke MongoDB:', err));

// 1. UPDATE SCHEMA: Tambah Beban
const workoutSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  beban: { type: Number, required: true }, 
  set: { type: Number, required: true },
  reps: { type: Number, required: true },
  tanggal: { type: Date, default: Date.now }
});

const Workout = mongoose.model('Workout', workoutSchema);

// GET API
app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ tanggal: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. UPDATE POST API: Terima data Beban
app.post('/api/workouts', async (req, res) => {
  try {
    const { nama, beban, set, reps } = req.body;
    const newWorkout = new Workout({ nama, beban, set, reps });
    await newWorkout.save();
    res.json(newWorkout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE API
app.delete('/api/workouts/:id', async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Latihan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server Backend aktif di http://localhost:${PORT}`);
});