const Usuario = require('../models/Usuario');
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
 * GET /intupdate
 * intupdate page.
 */
exports.getIntupdate = (req, res) => {
    res.render('usuario/intupdate', {
        title: 'Atualizar Usuario',
    });
};
/**
 * GET /intdelete
 * intdelete page.
 */
exports.getIntdelete = (req, res) => {
    res.render('usuario/intdelete', {
        title: 'Deletar Usuario',
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
    //console.log(req.body.usuarios)
    res.render('usuario/update', {
        title: 'Atualizar Pessoa',
        usuarios: req.body.usuarios
    });
};

/**
 * GET /delete
 * delete page.
 */
exports.getDelete = (req, res) => {
    res.render('usuario/delete', {
        title: 'Deletar Usuário',
        usuarios: req.body.usuarios
    });
};

/**
 * POST /create
 * Create a new local account.
 */
exports.postCreate = (req, res, next) => {
    req.assert('nascimento', 'Desculpe, o formato da data de nascimento é dd/mm/aaaa, antes de hoje e após 1900').matches(/^(0(?=\d)|1(?=\d)|2(?=\d)|3(?=[01]))\d\/(0(?=[1-9])|1(?=[0-2]))\d\/(19\d{2}|20(?=[01]\d)\d\d)$/);
    req.assert('rg', 'Desculpe, o formato do RG é dddddddddd-d').matches(/^\d{10}-\d$/);
    req.assert('nome', 'Desculpe, o nome não pode conter dígitos').matches(/^[\c \D]*$/);
    req.assert('telefone', 'Desculpe, o formato do telefone é (dd) 9dddddddd ou (dd) dddddddd').matches(/^\(?\d{2}\)?[ ]?9\d{4} ?\d{4}$|^\(?\d{2}\)? ?\9 \d{4} ?\d{4}$/);
    req.assert('cpf', 'Desculpe, o formato do CPF é ddd.ddd.ddd-dd ou ddddddddddd ou ddddddddd-dd').matches(/^(\d{11}|\d{9}-\d{2}|\d{3}\.\d{3}\.\d{3}-\d{2})$/);


    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('create');
    }

    var c = req.body.complemento ? '. Complemento: ' + req.body.complemento : '';

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
        numero: req.body.numero,
        complemento: req.body.complemento,

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
 * POST /intupdate
 * Read page.
 */
exports.postIntupdate = (req, res) => {

    Usuario.findOne({ cpf: req.body.cpf }, (err, existingUser) => {
        if (err || !existingUser) {req.flash('errors', { msg: 'Pessoa não encontrada.' }); return res.redirect('intupdate') }
        if (existingUser) {
            console.log(existingUser, "postIntupdate");
            res.render('usuario/update', {
                title: 'Atualizar Usuário',
                usuarios: existingUser
            });
        }
    })
    
};

/**
 * POST /intdelete
 * Read page.
 */
exports.postIntdelete = (req, res) => {
    Usuario.findOne({ cpf: req.body.cpf }, (err, existingUser) => {
        if (err || !existingUser) {req.flash('errors', { msg: 'Pessoa não encontrada.' }); return res.render('usuario/intdelete') }
        if (existingUser) {
            console.log(existingUser, "postIntdelete");
            res.render('usuario/delete', {
                title: 'Deletar Usuário',
                usuarios: existingUser
            });
        }
    })
};



/**
 * POST /update
 * Update profile information.
 */
exports.postUpdate = (req, res, next) => {
    req.assert('telefone', 'Desculpe, o formato do telefone é (dd) 9dddddddd ou (dd) dddddddd').matches(/^\(?\d{2}\)?[ ]?9\d{4} ?\d{4}$|^\(?\d{2}\)? ?\9 \d{4} ?\d{4}$/);
    req.assert('cpf', 'Desculpe, o formato do CPF é ddd.ddd.ddd-dd ou ddddddddddd ou ddddddddd-dd').matches(/^(\d{11}|\d{9}-\d{2}|\d{3}\.\d{3}\.\d{3}-\d{2})$/);
    req.assert('nome', 'Desculpe, o nome não pode conter dígitos').matches(/^[\c \D]*$/);

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('intupdate');
    }

    var c = req.body.complemento ? '. Complemento: ' + req.body.complemento : '';
    Usuario.findOne({ cpf: req.body.cpf }, (err, existingUser) => {
        console.log(existingUser)
        if (err || !existingUser) {req.flash('errors', { msg: 'Pessoa não encontrada.' }); return res.render('usuario/intupdate') }
            existingUser.tel = req.body.telefone || '';
            existingUser.nome = req.body.nome.replace(/\b\w/g, l => l.toUpperCase()) || '';
            existingUser.endereco = req.body.endereco|| '';
            existingUser.cidade = req.body.cidade || '';
            existingUser.estado = req.body.estado || '';
            existingUser.nascimento = req.body.nascimento || '';
            existingUser.cep = req.body.cep || '';
            existingUser.complemento = req.body.complemento || '';
            existingUser.numero = req.body.numero || '';
            existingUser.rg = req.body.rg || '';


            existingUser.save().then(u => {
                req.flash('success', { msg: 'Usuário atualizado com sucesso.' });
                res.redirect('intupdate');
            }).catch(err => {
                req.flash('errors', { msg: 'Erro ao atualizar.' });
                res.redirect('intupdate');
            });
    });
    

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
        return res.redirect('intdelete');
    }
    /**
     Usuario.deleteOne({ cpf: req.body.cpf }, (err) => {
     if (err) { return next(err); }
     req.flash('info', { msg: 'Usuário removido com sucesso.' });
     res.redirect('delete');
    });
    */

    Usuario.deleteOne({ cpf: req.body.cpf }, (err) => {
        if (err) {
            req.flash('errors', err);
            return res.redirect('intdelete');
        }
        req.flash('info', { msg: 'Cadastro deletado.' });
        res.redirect('intdelete');
    });

};

