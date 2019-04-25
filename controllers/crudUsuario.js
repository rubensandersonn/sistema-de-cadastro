const Usuario = require('../models/Usuario');
const cXe = require('../public/estados_cidades.json');
/**
 * GET /create
 * Create page.
 */
exports.getCreate = (req, res) => {
    res.render('usuario/create', {
        title: 'Criar Usuario',
    });
};

/**
 * GET /read
 * Read page.
 */
exports.getRead = (req, res) => {
    if (!req.query.searchString | req.query.searchString === '') {
        Usuario.find().then(usrs => {
            res.render('usuario/read', {
                title: 'Ver todos os Usuarios',
                usuarios: usrs
            });
        }).catch(err => {
            console.log('erro ao recuperar os usuarios', err);
        });
    } else {
        Usuario.find({ cpf: req.query.searchString }).then(usrs => {

            res.render('usuario/read', {
                title: 'Ver Usuario',
                usuarios: usrs
            });
        }).catch(err => {
            req.flash('errors', { msg: 'Pessoa não encontrada.' });
            res.render('usuario/read');
        });
    }
};

/**
 * GET /update
 * Update page.
 */
exports.getUpdate = (req, res) => {
    res.render('usuario/update', {
        title: 'Atualizar Pessoa'
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

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('create');
    }

    const user = new Usuario({
        nome: req.body.nome.replace(/\b\w/g, l => l.toUpperCase()),
        tel: req.body.telefone,
        nascimento: req.body.nascimento,
        rg: req.body.rg,
        cpf: req.body.cpf,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        estado: req.body.estado,
        cep: req.body.cep,
    });

     Usuario.findOne({ cpf: req.body.cpf }, (err, existingUser) => {
         if (err) { return next(err); }
         if (existingUser) {
             req.flash('errors', { msg: 'Este usuário já existe.' });
             return res.redirect('create');
            }
            user.save((err) => {
                if (err) {
                    return next(err);
                }
                req.flash('success', { msg: 'Usuário cadastrado com sucesso!' });
                res.redirect('create');
            });
        });
};


/**
 * POST /update
 * Update profile information.
 */
exports.postUpdate = (req, res, next) => {
    req.assert('telefone', 'Desculpe, o formato do telefone é (dd) 9dddddddd ou (dd) dddddddd').matches(/^\(?\d{2}\)?[ ]?9\d{4} ?\d{4}$|^\(?\d{2}\)? ?\9 \d{4} ?\d{4}$/);

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('update');
    }

    Usuario.findOne({ cpf: req.body.cpf })
        .then(user => {
            user.tel = req.body.telefone || '';
            user.nome = req.body.nome.replace(/\b\w/g, l => l.toUpperCase()) || '';
            user.endereco = req.body.endereco || '';
            user.cidade = req.body.cidade || '';
            user.estado = req.body.estado || '';
            user.cep = req.body.cep || '';

            user.save().then(u => {
                req.flash('success', { msg: 'Usuário atualizado com sucesso.' });
                res.redirect('update');
            }).catch(err => {
                return next(err);
            });
        }).catch(err => {
            req.flash('errors', { msg: 'Usuário não encontrado.' });
            res.redirect('update');
        });
    //Usuario.findById(req.user.id, (err, user) => {
    /**
     * 
     Usuario.findOne({ cpf: req.body.cpf }, (err, user) => {
         if (err) { return next(err); }
         user.tel = req.body.telefone || '';
         user.nome = req.body.nome.replace(/\b\w/g, l => l.toUpperCase()) || '';
         user.endereco = req.body.endereco || '';
         user.cidade = req.body.cidade || '';
         user.estado = req.body.estado || '';
         user.cep = req.body.cep || '';
         
         user.save((err) => {
             if (err) {
                 return next(err);
                }
                req.flash('success', { msg: 'Usuário atualizado com sucesso.' });
                res.redirect('update');
            });
        });
    */
};

/**
 * POST /delete
 * Delete user account.
 */
exports.postDelete = (req, res, next) => {
    req.assert('cpf', 'Desculpe, o formato do CPF é ddd.ddd.ddd-dd ou ddddddddddd ou ddddddddd-dd').matches(/^(\d{11}|\d{9}-\d{2}|\d{3}\.\d{3}\.\d{3}-\d{2})$/);

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('delete');
    }
    /**
     Usuario.deleteOne({ cpf: req.body.cpf }, (err) => {
     if (err) { return next(err); }
     req.flash('info', { msg: 'Usuário removido com sucesso.' });
     res.redirect('delete');
    });
    */

    Usuario.deleteOne({ cpf: req.body.cpf }, (err) => {
        if (err) { return next(err); }
        req.flash('info', { msg: 'Cadastro deletado.' });
        res.redirect('delete');
    });
};

