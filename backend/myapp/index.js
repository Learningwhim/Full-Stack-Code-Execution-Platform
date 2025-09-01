
const express = require('express');
const db = require('./db/database');
const cors = require('cors');
const problemRoutes = require('./routes/problems');
const submissionRoutes = require('./routes/submissions');
const testcaseRoutes = require('./routes/testcases');
const authRoutes = require('./routes/users');
const app = express();
const PORT = process.env.DB_PORT || 3000;
app.use(cors());
app.use(express.json());
 app.use(express.urlencoded({extended: true}));
app.use('/problems', problemRoutes);
app.use(submissionRoutes);
app.use(testcaseRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
