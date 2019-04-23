const { promisify } = require('util');
const crypto = require('crypto');
const passport = require('passport');
const _ = require('lodash');
const User = require('../models/User');


/**
 * GET /create
 * Create page.
 */
exports.getCreate = (req, res) => {
    res.render('usuario/create', {
        title: 'Criar Usuario'
    });
};

/**
 * GET /read
 * Read page.
 */
exports.getRead = (req, res) => {
    res.render('usuario/read', {
        title: 'Ver todos os Usuarios'
    });
};

/**
 * GET /update
 * Update page.
 */
exports.getUpdate = (req, res) => {
    res.render('usuario/update', {
        title: 'Ver todos os Usuários'
    });
};

/**
 * GET /delete
 * delete page.
 */
exports.getDelete = (req, res) => {
    res.render('usuario/delete', {
        title: 'Deletar Usuário'
    });
};

/**
 * POST /create
 * Create a new local account.
 */
exports.postCreate = (req, res, next) => {
    req.assert('telefone', 'Desculpe, o formato do telefone é (dd) 9dddddddd ou (dd) dddddddd').matches(/^\(?\d{2}\)?[ ]?9\d{4} ?\d{4}$|^\(?\d{2}\)? ?\9 \d{4} ?\d{4}$/);
    req.assert('nascimento', 'Desculpe, o formato da data de nascimento é dd/mm/aaaa, antes de hoje e após 1900').matches(/^(0(?=\d)|1(?=\d)|2(?=\d)|3(?=[01]))\d\/(0(?=[1-9])|1(?=[0-2]))\d\/(19\d{2}|20(?=[01]\d)\d\d)$/);
    req.assert('rg', 'Desculpe, o formato do RG é dddddddddd-d').matches(/^\d{10}-\d$/);
    req.assert('cpf', 'Desculpe, o formato do CPF é ddd.ddd.ddd-dd ou ddddddddddd ou ddddddddd-dd').matches(/^(\d{11}|\d{9}-\d{2}|\d{3}\.\d{3}\.\d{3}-\d{2})$/);
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/create');
    }

    const user = new Usuario({
        nome: req.body.nome,
        tel: req.body.tel,
        nascimento: req.body.nascimento,
        rg: req.body.rg,
        cpf: req.body.cpf,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        estado: req.body.estado,
        cep: req.body.cep,
    });

    User.findOne({ cpf: req.body.cpf }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
            req.flash('errors', { msg: 'Este usuário já existe.' });
            return res.redirect('/create');
        }
        user.save((err) => {
            if (err) { return next(err); }
            req.flash('sucess', { msg: 'Usuário cadastrado com sucesso!' });
            res.redirect('/create');
        });
    });
};


/**
 * POST /update
 * Update profile information.
 */
exports.postUpdate = (req, res, next) => {
    req.assert('telefone', 'Desculpe, o formato do telefone é (dd) 9dddddddd ou (dd) dddddddd').matches(/^\(?\d{2}\)?[ ]?9\d{4} ?\d{4}$|^\(?\d{2}\)? ?\9 \d{4} ?\d{4}$/);
    req.assert('nascimento', 'Desculpe, o formato da data de nascimento é dd/mm/aaaa, antes de hoje e após 1900').matches(/^(0(?=\d)|1(?=\d)|2(?=\d)|3(?=[01]))\d\/(0(?=[1-9])|1(?=[0-2]))\d\/(19\d{2}|20(?=[01]\d)\d\d)$/);
    req.assert('rg', 'Desculpe, o formato do RG é dddddddddd-d').matches(/^\d{10}-\d$/);
    req.assert('cpf', 'Desculpe, o formato do CPF é ddd.ddd.ddd-dd ou ddddddddddd ou ddddddddd-dd').matches(/^(\d{11}|\d{9}-\d{2}|\d{3}\.\d{3}\.\d{3}-\d{2})$/);
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/update'); 
    }

    //User.findById(req.user.id, (err, user) => {
    User.findOne({ cpf: req.body.cpf }, (err, user) => {
        if (err) { return next(err); }
        user.nome = req.body.name || '';
        user.telefone = req.body.telefone || '';
        user.nascimento = req.body.nascimento || '';
        user.rg = req.body.rg || '';
        user.endereco = req.body.endereco || '';
        user.cidade = req.body.cidade || '';
        user.estado = req.body.estado || '';
        user.cep = req.body.cep || '';
       
        user.save((err) => {
            if (err) {
                
                return next(err);
            }
            req.flash('success', { msg: 'Usuário atualizado com sucesso.' });
            res.redirect('/');
        });
    });
};

/**
 * POST /delete
 * Delete user account.
 */
exports.postDelete = (req, res, next) => {
    User.deleteOne({ cpf: req.cpf }, (err) => {
        if (err) { return next(err); }
        req.flash('info', { msg: 'Usuário removido com sucesso.' });
        res.redirect('/');
    });
};

