import express from 'express';
const router = express.Router();

/* GET home page. */

router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/sukces',  (req, res, next) => {
    res.render('success');
});

router.get('/blad', (req, res, next) => {
    res.render('error');
});

router.get('*', (req, res, next) => {
    res.status(404).render('404');
});

export default router;