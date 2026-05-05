import app from './app';
import { PORT } from './utils/env';

app.listen(PORT, () => {
console.log(`Perpustakaan API running on http://localhost:${PORT}`);
});